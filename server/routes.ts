import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, checkRole, hashPassword } from "./auth";
import { z } from "zod";
import {
  insertShipmentSchema,
  insertPaymentSchema,
  insertDamageSchema,
  insertComplaintSchema,
  insertTaskSchema,
  insertClientSchema,
  insertUserSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Dashboard statistics
  app.get("/api/dashboard/stats", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (err) {
      next(err);
    }
  });

  // Shipment routes
  app.get("/api/shipments", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const shipments = await storage.getShipments();
      res.json(shipments);
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/shipments/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const shipment = await storage.getShipment(parseInt(req.params.id));
      if (!shipment) {
        return res.status(404).json({ message: "Shipment not found" });
      }
      
      res.json(shipment);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/shipments", checkRole(["admin", "manager"]), async (req, res, next) => {
    try {
      const validatedData = insertShipmentSchema.parse(req.body);
      const shipment = await storage.createShipment(validatedData);
      res.status(201).json(shipment);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      next(err);
    }
  });

  app.put("/api/shipments/:id", checkRole(["admin", "manager"]), async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const shipment = await storage.getShipment(id);
      
      if (!shipment) {
        return res.status(404).json({ message: "Shipment not found" });
      }
      
      const validatedData = insertShipmentSchema.partial().parse(req.body);
      const updatedShipment = await storage.updateShipment(id, validatedData);
      res.json(updatedShipment);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      next(err);
    }
  });

  app.delete("/api/shipments/:id", checkRole(["admin", "manager"]), async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const shipment = await storage.getShipment(id);
      
      if (!shipment) {
        return res.status(404).json({ message: "Shipment not found" });
      }
      
      await storage.deleteShipment(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  // Payment routes
  app.get("/api/payments", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const payments = await storage.getPayments();
      res.json(payments);
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/payments/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const payment = await storage.getPayment(parseInt(req.params.id));
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      
      res.json(payment);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/payments", checkRole(["admin", "manager"]), async (req, res, next) => {
    try {
      const validatedData = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(validatedData);
      res.status(201).json(payment);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      next(err);
    }
  });

  app.put("/api/payments/:id", checkRole(["admin", "manager"]), async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const payment = await storage.getPayment(id);
      
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      
      const validatedData = insertPaymentSchema.partial().parse(req.body);
      const updatedPayment = await storage.updatePayment(id, validatedData);
      res.json(updatedPayment);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      next(err);
    }
  });

  // Damage reports routes
  app.get("/api/damages", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const damages = await storage.getDamages();
      res.json(damages);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/damages", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const validatedData = insertDamageSchema.parse(req.body);
      const damage = await storage.createDamage(validatedData);
      res.status(201).json(damage);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      next(err);
    }
  });

  // Complaints routes
  app.get("/api/complaints", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const complaints = await storage.getComplaints();
      res.json(complaints);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/complaints", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const validatedData = insertComplaintSchema.parse(req.body);
      const complaint = await storage.createComplaint(validatedData);
      res.status(201).json(complaint);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      next(err);
    }
  });

  // Task routes
  // Get tasks assigned to the current user
  app.get("/api/tasks/my-tasks", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const tasks = await storage.getTasks({ assignedTo: req.user.id });
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  });
  
  // Get tasks created by the current user
  app.get("/api/tasks/assigned-by-me", checkRole(["admin", "manager"]), async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const tasks = await storage.getTasks({ assignedBy: req.user.id });
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  });

  // Get all tasks (with filtering based on role)
  app.get("/api/tasks", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Filter tasks based on user role
      let tasks;
      if (req.user.role === 'admin' || req.user.role === 'manager') {
        // Admins and managers can see all tasks
        tasks = await storage.getTasks();
      } else {
        // Employees can only see tasks assigned to them
        tasks = await storage.getTasks({ assignedTo: req.user.id });
      }
      
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  });
  
  // Get a specific task by ID
  app.get("/api/tasks/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const taskId = parseInt(req.params.id);
      const task = await storage.getTask(taskId);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      // Check if user has permission to view this task
      const canView = 
        req.user.role === 'admin' || 
        req.user.role === 'manager' ||
        task.assignedTo === req.user.id ||
        task.assignedBy === req.user.id;
        
      if (!canView) {
        return res.status(403).json({ message: "You don't have permission to view this task" });
      }
      
      res.json(task);
    } catch (err) {
      next(err);
    }
  });

  // Create new task
  app.post("/api/tasks", checkRole(["admin", "manager"]), async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Add the current user as the assigner
      const taskData = {
        ...req.body,
        assignedBy: req.user.id
      };
      
      const validatedData = insertTaskSchema.parse(taskData);
      const task = await storage.createTask(validatedData);
      
      // TODO: In a real app, we would send a notification here to the assignee
      
      res.status(201).json(task);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      next(err);
    }
  });

  // Update task
  app.put("/api/tasks/:id", checkRole(["admin", "manager", "employee"]), async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const id = parseInt(req.params.id);
      const task = await storage.getTask(id);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      // Check permissions: only assignee can update status,
      // only admin/manager/assigner can update other fields
      const isAssignee = task.assignedTo === req.user.id;
      const isAssigner = task.assignedBy === req.user.id;
      const isAdminOrManager = ['admin', 'manager'].includes(req.user.role);
      
      if (!isAssignee && !isAssigner && !isAdminOrManager) {
        // If updating status only and user is assignee, allow the update
        if (Object.keys(req.body).length === 1 && 'status' in req.body && isAssignee) {
          // Allow this update
        } else {
          return res.status(403).json({ 
            message: "You don't have permission to update this task" 
          });
        }
      }
      
      // Add completedAt date if the task is being completed
      let taskData = req.body;
      if (taskData.status === 'completed' && task.status !== 'completed') {
        taskData.completedAt = new Date();
      }
      
      const validatedData = insertTaskSchema.partial().parse(taskData);
      const updatedTask = await storage.updateTask(id, validatedData);
      
      // TODO: In a real app, we would send a notification here for status updates
      
      res.json(updatedTask);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      next(err);
    }
  });

  // Client routes
  app.get("/api/clients", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const clients = await storage.getClients();
      res.json(clients);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/clients", checkRole(["admin", "manager"]), async (req, res, next) => {
    try {
      const validatedData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(validatedData);
      res.status(201).json(client);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      next(err);
    }
  });

  // User Management Routes (Admin only)
  app.get("/api/users/:id", checkRole(["admin"]), async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send password back to client
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (err) {
      next(err);
    }
  });

  // Create user (admin only)
  app.post("/api/users", checkRole(["admin"]), async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Validate the input data
      const validatedData = insertUserSchema.parse(req.body);
      
      // Hash the password before storing
      const hashedPassword = await hashPassword(validatedData.password);
      
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword
      });

      // Don't send password back to client
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      next(err);
    }
  });

  // Update user (admin only)
  app.put("/api/users/:id", checkRole(["admin"]), async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Make sure password is hashed if it's being updated
      let userData = { ...req.body };
      if (userData.password) {
        userData.password = await hashPassword(userData.password);
      }
      
      // Validate partial data
      const validatedData = insertUserSchema.partial().parse(userData);
      const updatedUser = await storage.updateUser(id, validatedData);
      
      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to update user" });
      }
      
      // Don't send password back to client
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors });
      }
      next(err);
    }
  });

  // Get all users (admin only)
  app.get("/api/users", checkRole(["admin"]), async (req, res, next) => {
    try {
      const users = await storage.getUsers();
      // Don't send passwords back to client
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.json(usersWithoutPasswords);
    } catch (err) {
      next(err);
    }
  });

  // Delete user (admin only)
  app.delete("/api/users/:id", checkRole(["admin"]), async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      
      // Don't allow admin to delete themselves
      if (id === req.user?.id) {
        return res.status(400).json({ message: "Cannot delete your own account" });
      }
      
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user is also an admin - only admins can delete admins
      if (user.role === 'admin' && req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Only admins can delete admin accounts" });
      }
      
      const success = await storage.deleteUser(id);
      
      if (!success) {
        return res.status(500).json({ message: "Failed to delete user" });
      }
      
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
