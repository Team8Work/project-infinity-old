import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User and Auth related schemas
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("client"),
  company: text("company"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true })
  .extend({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    email: z.string().email("Invalid email format"),
    role: z.enum(["admin", "manager", "employee"]).default("employee"),
  });

// Shipment related schemas
export const shipments = pgTable("shipments", {
  id: serial("id").primaryKey(),
  trackingId: text("tracking_id").notNull().unique(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  clientId: integer("client_id").notNull(),
  shipperId: integer("shipper_id"),
  dueDate: timestamp("due_date").notNull(),
  status: text("status").notNull().default("pending"),
  value: integer("value"),
  weight: integer("weight"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertShipmentSchema = createInsertSchema(shipments)
  .omit({ id: true, trackingId: true, createdAt: true, updatedAt: true })
  .extend({
    status: z.enum(["pending", "in-transit", "delivered", "delayed", "cancelled"]).default("pending"),
  });

// Payment related schemas
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  shipmentId: integer("shipment_id").notNull(),
  amount: integer("amount").notNull(),
  status: text("status").notNull().default("pending"),
  paymentMethod: text("payment_method"),
  paymentDate: timestamp("payment_date"),
  dueDate: timestamp("due_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPaymentSchema = createInsertSchema(payments)
  .omit({ id: true, createdAt: true })
  .extend({
    status: z.enum(["pending", "paid", "overdue", "cancelled"]).default("pending"),
  });

// Damage reports
export const damages = pgTable("damages", {
  id: serial("id").primaryKey(),
  shipmentId: integer("shipment_id").notNull(),
  description: text("description").notNull(),
  reportedBy: integer("reported_by").notNull(),
  status: text("status").notNull().default("pending"),
  damageDate: timestamp("damage_date").notNull(),
  claimAmount: integer("claim_amount"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDamageSchema = createInsertSchema(damages)
  .omit({ id: true, createdAt: true })
  .extend({
    status: z.enum(["pending", "reviewing", "approved", "rejected"]).default("pending"),
  });

// Complaints
export const complaints = pgTable("complaints", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  shipmentId: integer("shipment_id"),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"),
  priority: text("priority").notNull().default("medium"),
  assignedTo: integer("assigned_to"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertComplaintSchema = createInsertSchema(complaints)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    status: z.enum(["pending", "investigating", "resolved", "closed"]).default("pending"),
    priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  });

// Tasks
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  assignedTo: integer("assigned_to"),
  assignedBy: integer("assigned_by"),
  priority: text("priority").notNull().default("medium"),
  type: text("type").notNull(),
  relatedId: integer("related_id"),
  status: text("status").notNull().default("pending"),
  dueDate: timestamp("due_date"),
  reminderDate: timestamp("reminder_date"),
  completedAt: timestamp("completed_at"),
  comments: text("comments"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTaskSchema = createInsertSchema(tasks)
  .omit({ id: true, createdAt: true, updatedAt: true, completedAt: true })
  .extend({
    type: z.enum(["shipment", "payment", "damage", "complaint", "report", "client", "general"]).default("general"),
    status: z.enum(["pending", "in-progress", "completed", "cancelled"]).default("pending"),
    priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
    dueDate: z.string().nullable().optional().transform(val => val ? new Date(val) : null),
  });

// Clients
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  address: text("address"),
  country: text("country"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertClientSchema = createInsertSchema(clients)
  .omit({ id: true, createdAt: true });

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Shipment = typeof shipments.$inferSelect;
export type InsertShipment = z.infer<typeof insertShipmentSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type Damage = typeof damages.$inferSelect;
export type InsertDamage = z.infer<typeof insertDamageSchema>;

export type Complaint = typeof complaints.$inferSelect;
export type InsertComplaint = z.infer<typeof insertComplaintSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
