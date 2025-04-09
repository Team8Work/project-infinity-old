import { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "@shared/supabase";

export function checkRole(allowedRoles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data: { session } } = await supabaseAdmin.auth.getSession();
      if (!session?.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Get user profile to check role
      const { data: profile, error } = await supabaseAdmin
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error || !profile) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!allowedRoles.includes(profile.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // Attach user to request
      req.user = profile;
      next();
    } catch (err) {
      next(err);
    }
  };
} 