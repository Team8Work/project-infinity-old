import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import { supabaseAdmin } from "@shared/supabase";
import { checkRole } from "./middleware";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Middleware to check user role permissions
export function checkRole(allowedRoles: string[]) {
  return (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    
    next();
  };
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "logitrack-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
      
      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", async (req, res) => {
    try {
      const { data: { session } } = await supabaseAdmin.auth.getSession();
      if (!session?.user) return res.sendStatus(401);

      // Get user profile from our users table
      const { data: profile } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (!profile) return res.sendStatus(401);
      res.json(profile);
    } catch (err) {
      res.sendStatus(401);
    }
  });

  // Get all users (admin and manager only)
  app.get("/api/users", checkRole(["admin", "manager"]), async (req, res, next) => {
    try {
      const { data: users, error } = await supabaseAdmin
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      res.json(users);
    } catch (err) {
      next(err);
    }
  });

  // Create user (admin only)
  app.post("/api/users", checkRole(["admin"]), async (req, res, next) => {
    try {
      const { email, password, fullName, role, company } = req.body;

      // First, create the auth user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create user");

      // Then, create the user profile
      const { error: profileError } = await supabaseAdmin
        .from("users")
        .insert({
          id: authData.user.id,
          email,
          fullName,
          role,
          company,
          username: email.split("@")[0], // Generate username from email
        });

      if (profileError) throw profileError;

      // Get the created user profile
      const { data: user, error: getError } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (getError) throw getError;
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  });

  // Delete user (admin only)
  app.delete("/api/users/:id", checkRole(["admin"]), async (req, res, next) => {
    try {
      const userId = req.params.id;

      // Delete the auth user
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (authError) throw authError;

      // Delete the user profile
      const { error: profileError } = await supabaseAdmin
        .from("users")
        .delete()
        .eq("id", userId);

      if (profileError) throw profileError;
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });
}
