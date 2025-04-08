import {
  users, User, InsertUser,
  shipments, Shipment, InsertShipment,
  payments, Payment, InsertPayment,
  damages, Damage, InsertDamage,
  complaints, Complaint, InsertComplaint,
  tasks, Task, InsertTask,
  clients, Client, InsertClient
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { randomUUID } from 'crypto';
import { eq } from "drizzle-orm";
import { db, pool } from "./db";
import connectPg from "connect-pg-simple";

const MemoryStore = createMemoryStore(session);

// Storage interface definition
export interface IStorage {
  // Session store
  sessionStore: session.Store;

  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  getUsers(): Promise<User[]>;

  // Shipment methods
  getShipment(id: number): Promise<Shipment | undefined>;
  getShipmentByTrackingId(trackingId: string): Promise<Shipment | undefined>;
  createShipment(shipment: InsertShipment): Promise<Shipment>;
  updateShipment(id: number, shipment: Partial<Shipment>): Promise<Shipment | undefined>;
  getShipments(query?: Partial<Shipment>): Promise<Shipment[]>;
  deleteShipment(id: number): Promise<boolean>;

  // Payment methods
  getPayment(id: number): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, payment: Partial<Payment>): Promise<Payment | undefined>;
  getPayments(query?: Partial<Payment>): Promise<Payment[]>;
  deletePayment(id: number): Promise<boolean>;

  // Damage methods
  getDamage(id: number): Promise<Damage | undefined>;
  createDamage(damage: InsertDamage): Promise<Damage>;
  updateDamage(id: number, damage: Partial<Damage>): Promise<Damage | undefined>;
  getDamages(query?: Partial<Damage>): Promise<Damage[]>;
  deleteDamage(id: number): Promise<boolean>;

  // Complaint methods
  getComplaint(id: number): Promise<Complaint | undefined>;
  createComplaint(complaint: InsertComplaint): Promise<Complaint>;
  updateComplaint(id: number, complaint: Partial<Complaint>): Promise<Complaint | undefined>;
  getComplaints(query?: Partial<Complaint>): Promise<Complaint[]>;
  deleteComplaint(id: number): Promise<boolean>;

  // Task methods
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<Task>): Promise<Task | undefined>;
  getTasks(query?: Partial<Task>): Promise<Task[]>;
  deleteTask(id: number): Promise<boolean>;

  // Client methods
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<Client>): Promise<Client | undefined>;
  getClients(query?: Partial<Client>): Promise<Client[]>;
  deleteClient(id: number): Promise<boolean>;

  // Dashboard stats
  getDashboardStats(): Promise<any>;
}

// In-memory implementation of the storage interface
export class MemStorage implements IStorage {
  private usersStore: Map<number, User>;
  private shipmentsStore: Map<number, Shipment>;
  private paymentsStore: Map<number, Payment>;
  private damagesStore: Map<number, Damage>;
  private complaintsStore: Map<number, Complaint>;
  private tasksStore: Map<number, Task>;
  private clientsStore: Map<number, Client>;
  
  sessionStore: session.Store;
  
  private userIdCounter: number;
  private shipmentIdCounter: number;
  private paymentIdCounter: number;
  private damageIdCounter: number;
  private complaintIdCounter: number;
  private taskIdCounter: number;
  private clientIdCounter: number;

  constructor() {
    this.usersStore = new Map();
    this.shipmentsStore = new Map();
    this.paymentsStore = new Map();
    this.damagesStore = new Map();
    this.complaintsStore = new Map();
    this.tasksStore = new Map();
    this.clientsStore = new Map();
    
    this.userIdCounter = 1;
    this.shipmentIdCounter = 1;
    this.paymentIdCounter = 1;
    this.damageIdCounter = 1;
    this.complaintIdCounter = 1;
    this.taskIdCounter = 1;
    this.clientIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Create default admin user
    this.createUser({
      username: "admin",
      password: "adminpassword", // Will be hashed by auth.ts
      email: "admin@logitrack.com",
      fullName: "System Administrator",
      role: "admin"
    });
    
    // Create some sample clients
    this.createClient({
      name: "Acme Corp",
      email: "contact@acmecorp.com",
      phone: "+1234567890",
      address: "123 Business St, New York, NY",
      country: "USA"
    });
    
    this.createClient({
      name: "Global Industries",
      email: "info@globalind.com",
      phone: "+9876543210",
      address: "456 Corporate Ave, Berlin",
      country: "Germany"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersStore.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersStore.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now
    };
    this.usersStore.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.usersStore.set(id, updatedUser);
    return updatedUser;
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.usersStore.values());
  }

  // Shipment methods
  async getShipment(id: number): Promise<Shipment | undefined> {
    return this.shipmentsStore.get(id);
  }

  async getShipmentByTrackingId(trackingId: string): Promise<Shipment | undefined> {
    return Array.from(this.shipmentsStore.values()).find(
      (shipment) => shipment.trackingId === trackingId,
    );
  }

  async createShipment(insertShipment: InsertShipment): Promise<Shipment> {
    const id = this.shipmentIdCounter++;
    const now = new Date();
    const trackingId = `SH-${Math.floor(Math.random() * 10000000)}`;
    
    const shipment: Shipment = {
      ...insertShipment,
      id,
      trackingId,
      createdAt: now,
      updatedAt: now
    };
    
    this.shipmentsStore.set(id, shipment);
    return shipment;
  }

  async updateShipment(id: number, shipmentData: Partial<Shipment>): Promise<Shipment | undefined> {
    const shipment = await this.getShipment(id);
    if (!shipment) return undefined;
    
    const updatedShipment = { 
      ...shipment, 
      ...shipmentData,
      updatedAt: new Date()
    };
    
    this.shipmentsStore.set(id, updatedShipment);
    return updatedShipment;
  }

  async getShipments(query?: Partial<Shipment>): Promise<Shipment[]> {
    let shipments = Array.from(this.shipmentsStore.values());
    
    if (query) {
      shipments = shipments.filter(shipment => {
        return Object.entries(query).every(([key, value]) => {
          return shipment[key as keyof Shipment] === value;
        });
      });
    }
    
    return shipments;
  }

  async deleteShipment(id: number): Promise<boolean> {
    return this.shipmentsStore.delete(id);
  }

  // Payment methods
  async getPayment(id: number): Promise<Payment | undefined> {
    return this.paymentsStore.get(id);
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = this.paymentIdCounter++;
    const now = new Date();
    
    const payment: Payment = {
      ...insertPayment,
      id,
      createdAt: now
    };
    
    this.paymentsStore.set(id, payment);
    return payment;
  }

  async updatePayment(id: number, paymentData: Partial<Payment>): Promise<Payment | undefined> {
    const payment = await this.getPayment(id);
    if (!payment) return undefined;
    
    const updatedPayment = { ...payment, ...paymentData };
    this.paymentsStore.set(id, updatedPayment);
    return updatedPayment;
  }

  async getPayments(query?: Partial<Payment>): Promise<Payment[]> {
    let payments = Array.from(this.paymentsStore.values());
    
    if (query) {
      payments = payments.filter(payment => {
        return Object.entries(query).every(([key, value]) => {
          return payment[key as keyof Payment] === value;
        });
      });
    }
    
    return payments;
  }

  async deletePayment(id: number): Promise<boolean> {
    return this.paymentsStore.delete(id);
  }

  // Damage methods
  async getDamage(id: number): Promise<Damage | undefined> {
    return this.damagesStore.get(id);
  }

  async createDamage(insertDamage: InsertDamage): Promise<Damage> {
    const id = this.damageIdCounter++;
    const now = new Date();
    
    const damage: Damage = {
      ...insertDamage,
      id,
      createdAt: now
    };
    
    this.damagesStore.set(id, damage);
    return damage;
  }

  async updateDamage(id: number, damageData: Partial<Damage>): Promise<Damage | undefined> {
    const damage = await this.getDamage(id);
    if (!damage) return undefined;
    
    const updatedDamage = { ...damage, ...damageData };
    this.damagesStore.set(id, updatedDamage);
    return updatedDamage;
  }

  async getDamages(query?: Partial<Damage>): Promise<Damage[]> {
    let damages = Array.from(this.damagesStore.values());
    
    if (query) {
      damages = damages.filter(damage => {
        return Object.entries(query).every(([key, value]) => {
          return damage[key as keyof Damage] === value;
        });
      });
    }
    
    return damages;
  }

  async deleteDamage(id: number): Promise<boolean> {
    return this.damagesStore.delete(id);
  }

  // Complaint methods
  async getComplaint(id: number): Promise<Complaint | undefined> {
    return this.complaintsStore.get(id);
  }

  async createComplaint(insertComplaint: InsertComplaint): Promise<Complaint> {
    const id = this.complaintIdCounter++;
    const now = new Date();
    
    const complaint: Complaint = {
      ...insertComplaint,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.complaintsStore.set(id, complaint);
    return complaint;
  }

  async updateComplaint(id: number, complaintData: Partial<Complaint>): Promise<Complaint | undefined> {
    const complaint = await this.getComplaint(id);
    if (!complaint) return undefined;
    
    const updatedComplaint = { 
      ...complaint, 
      ...complaintData,
      updatedAt: new Date()
    };
    
    this.complaintsStore.set(id, updatedComplaint);
    return updatedComplaint;
  }

  async getComplaints(query?: Partial<Complaint>): Promise<Complaint[]> {
    let complaints = Array.from(this.complaintsStore.values());
    
    if (query) {
      complaints = complaints.filter(complaint => {
        return Object.entries(query).every(([key, value]) => {
          return complaint[key as keyof Complaint] === value;
        });
      });
    }
    
    return complaints;
  }

  async deleteComplaint(id: number): Promise<boolean> {
    return this.complaintsStore.delete(id);
  }

  // Task methods
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasksStore.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.taskIdCounter++;
    const now = new Date();
    
    const task: Task = {
      ...insertTask,
      id,
      createdAt: now,
      updatedAt: now,
      completedAt: null
    };
    
    this.tasksStore.set(id, task);
    return task;
  }

  async updateTask(id: number, taskData: Partial<Task>): Promise<Task | undefined> {
    const task = await this.getTask(id);
    if (!task) return undefined;
    
    // If the task is being marked as completed, set the completedAt date
    const isCompleting = taskData.status === 'completed' && task.status !== 'completed';
    
    const updatedTask = { 
      ...task, 
      ...taskData,
      updatedAt: new Date(),
      completedAt: isCompleting ? new Date() : task.completedAt
    };
    
    this.tasksStore.set(id, updatedTask);
    return updatedTask;
  }

  async getTasks(query?: Partial<Task>): Promise<Task[]> {
    let tasks = Array.from(this.tasksStore.values());
    
    if (query) {
      tasks = tasks.filter(task => {
        return Object.entries(query).every(([key, value]) => {
          return task[key as keyof Task] === value;
        });
      });
    }
    
    return tasks;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasksStore.delete(id);
  }

  // Client methods
  async getClient(id: number): Promise<Client | undefined> {
    return this.clientsStore.get(id);
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = this.clientIdCounter++;
    const now = new Date();
    
    const client: Client = {
      ...insertClient,
      id,
      createdAt: now
    };
    
    this.clientsStore.set(id, client);
    return client;
  }

  async updateClient(id: number, clientData: Partial<Client>): Promise<Client | undefined> {
    const client = await this.getClient(id);
    if (!client) return undefined;
    
    const updatedClient = { ...client, ...clientData };
    this.clientsStore.set(id, updatedClient);
    return updatedClient;
  }

  async getClients(query?: Partial<Client>): Promise<Client[]> {
    let clients = Array.from(this.clientsStore.values());
    
    if (query) {
      clients = clients.filter(client => {
        return Object.entries(query).every(([key, value]) => {
          return client[key as keyof Client] === value;
        });
      });
    }
    
    return clients;
  }

  async deleteClient(id: number): Promise<boolean> {
    return this.clientsStore.delete(id);
  }

  // Dashboard stats
  async getDashboardStats(): Promise<any> {
    const tasks = await this.getTasks();
    const users = await this.getUsers();
    
    // Group tasks by status
    const pendingTasks = tasks.filter(t => t.status === 'pending');
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
    const completedTasks = tasks.filter(t => t.status === 'completed');
    
    // Calculate task completion rate
    const totalCompletedTasks = completedTasks.length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? (totalCompletedTasks / totalTasks) * 100 : 0;
    
    // Calculate tasks by priority
    const urgentTasks = tasks.filter(t => t.priority === 'urgent').length;
    const highPriorityTasks = tasks.filter(t => t.priority === 'high').length;
    const mediumPriorityTasks = tasks.filter(t => t.priority === 'medium').length;
    const lowPriorityTasks = tasks.filter(t => t.priority === 'low').length;
    
    // Calculate overdue tasks
    const now = new Date();
    const overdueTasks = tasks.filter(t => {
      if (!t.dueDate || t.status === 'completed' || t.status === 'cancelled') return false;
      return new Date(t.dueDate) < now;
    }).length;
    
    // Calculate on-time completion percentage for tasks with due dates
    const completedTasksWithDueDates = completedTasks.filter(t => t.dueDate && t.completedAt);
    const onTimeCompletions = completedTasksWithDueDates.filter(t => {
      if (!t.dueDate || !t.completedAt) return false;
      return new Date(t.completedAt) <= new Date(t.dueDate);
    });
    
    const onTimePercentage = completedTasksWithDueDates.length > 0 
      ? (onTimeCompletions.length / completedTasksWithDueDates.length) * 100 
      : 100;
    
    // Group tasks by assignee
    const tasksByAssignee: Record<number, {
      total: number;
      pending: number;
      inProgress: number;
      completed: number;
      user: User | undefined;
    }> = {};
    
    tasks.forEach(task => {
      if (task.assignedTo) {
        if (!tasksByAssignee[task.assignedTo]) {
          tasksByAssignee[task.assignedTo] = {
            total: 0,
            pending: 0,
            inProgress: 0,
            completed: 0,
            user: users.find(u => u.id === task.assignedTo)
          };
        }
        tasksByAssignee[task.assignedTo].total++;
        if (task.status === 'pending') tasksByAssignee[task.assignedTo].pending++;
        if (task.status === 'in-progress') tasksByAssignee[task.assignedTo].inProgress++;
        if (task.status === 'completed') tasksByAssignee[task.assignedTo].completed++;
      }
    });
    
    // Group tasks by type
    const tasksByType: Record<string, number> = {};
    tasks.forEach(task => {
      if (!tasksByType[task.type]) {
        tasksByType[task.type] = 0;
      }
      tasksByType[task.type]++;
    });
    
    return {
      tasks: {
        total: totalTasks,
        pending: pendingTasks.length,
        inProgress: inProgressTasks.length,
        completed: completedTasks.length,
        overdue: overdueTasks,
        completionRate: completionRate.toFixed(1),
        onTimeCompletion: onTimePercentage.toFixed(1)
      },
      priorities: {
        urgent: urgentTasks,
        high: highPriorityTasks,
        medium: mediumPriorityTasks,
        low: lowPriorityTasks
      },
      recentTasks: tasks.sort((a, b) => {
        const dateA = a.updatedAt || a.createdAt || new Date(0);
        const dateB = b.updatedAt || b.createdAt || new Date(0);
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      }).slice(0, 5),
      pendingTasks: pendingTasks.slice(0, 5),
      upcomingDeadlines: pendingTasks
        .filter(t => t.dueDate !== null && t.dueDate !== undefined)
        .sort((a, b) => {
          const dateA = a.dueDate || new Date(0);
          const dateB = b.dueDate || new Date(0);
          return new Date(dateA).getTime() - new Date(dateB).getTime();
        })
        .slice(0, 5),
      tasksByAssignee,
      tasksByType
    };
  }
}

// Database implementation of the storage interface
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    // Create a new PostgreSQL session store
    const PostgresStore = connectPg(session);
    this.sessionStore = new PostgresStore({
      pool,
      tableName: 'session', // Default session table name
      createTableIfMissing: true // Create the session table if it doesn't exist
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Shipment methods
  async getShipment(id: number): Promise<Shipment | undefined> {
    const [shipment] = await db.select().from(shipments).where(eq(shipments.id, id));
    return shipment;
  }

  async getShipmentByTrackingId(trackingId: string): Promise<Shipment | undefined> {
    const [shipment] = await db.select().from(shipments).where(eq(shipments.trackingId, trackingId));
    return shipment;
  }

  async createShipment(insertShipment: InsertShipment): Promise<Shipment> {
    // Generate a unique tracking ID
    const trackingId = `SH-${Math.floor(Math.random() * 10000000)}`;
    
    const [shipment] = await db
      .insert(shipments)
      .values({ ...insertShipment, trackingId })
      .returning();
    return shipment;
  }

  async updateShipment(id: number, shipmentData: Partial<Shipment>): Promise<Shipment | undefined> {
    const now = new Date();
    const [updatedShipment] = await db
      .update(shipments)
      .set({ ...shipmentData, updatedAt: now })
      .where(eq(shipments.id, id))
      .returning();
    return updatedShipment;
  }

  async getShipments(query?: Partial<Shipment>): Promise<Shipment[]> {
    if (!query) {
      return await db.select().from(shipments);
    }
    
    // Build a dynamic query based on the provided filters
    let queryBuilder = db.select().from(shipments);
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryBuilder = queryBuilder.where(eq(shipments[key as keyof typeof shipments], value));
      }
    });
    
    return await queryBuilder;
  }

  async deleteShipment(id: number): Promise<boolean> {
    const result = await db.delete(shipments).where(eq(shipments.id, id));
    return result.rowCount > 0;
  }

  // Payment methods
  async getPayment(id: number): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment;
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db.insert(payments).values(insertPayment).returning();
    return payment;
  }

  async updatePayment(id: number, paymentData: Partial<Payment>): Promise<Payment | undefined> {
    const [updatedPayment] = await db
      .update(payments)
      .set(paymentData)
      .where(eq(payments.id, id))
      .returning();
    return updatedPayment;
  }

  async getPayments(query?: Partial<Payment>): Promise<Payment[]> {
    if (!query) {
      return await db.select().from(payments);
    }
    
    let queryBuilder = db.select().from(payments);
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryBuilder = queryBuilder.where(eq(payments[key as keyof typeof payments], value));
      }
    });
    
    return await queryBuilder;
  }

  async deletePayment(id: number): Promise<boolean> {
    const result = await db.delete(payments).where(eq(payments.id, id));
    return result.rowCount > 0;
  }

  // Damage methods
  async getDamage(id: number): Promise<Damage | undefined> {
    const [damage] = await db.select().from(damages).where(eq(damages.id, id));
    return damage;
  }

  async createDamage(insertDamage: InsertDamage): Promise<Damage> {
    const [damage] = await db.insert(damages).values(insertDamage).returning();
    return damage;
  }

  async updateDamage(id: number, damageData: Partial<Damage>): Promise<Damage | undefined> {
    const [updatedDamage] = await db
      .update(damages)
      .set(damageData)
      .where(eq(damages.id, id))
      .returning();
    return updatedDamage;
  }

  async getDamages(query?: Partial<Damage>): Promise<Damage[]> {
    if (!query) {
      return await db.select().from(damages);
    }
    
    let queryBuilder = db.select().from(damages);
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryBuilder = queryBuilder.where(eq(damages[key as keyof typeof damages], value));
      }
    });
    
    return await queryBuilder;
  }

  async deleteDamage(id: number): Promise<boolean> {
    const result = await db.delete(damages).where(eq(damages.id, id));
    return result.rowCount > 0;
  }

  // Complaint methods
  async getComplaint(id: number): Promise<Complaint | undefined> {
    const [complaint] = await db.select().from(complaints).where(eq(complaints.id, id));
    return complaint;
  }

  async createComplaint(insertComplaint: InsertComplaint): Promise<Complaint> {
    const [complaint] = await db.insert(complaints).values(insertComplaint).returning();
    return complaint;
  }

  async updateComplaint(id: number, complaintData: Partial<Complaint>): Promise<Complaint | undefined> {
    const now = new Date();
    const [updatedComplaint] = await db
      .update(complaints)
      .set({ ...complaintData, updatedAt: now })
      .where(eq(complaints.id, id))
      .returning();
    return updatedComplaint;
  }

  async getComplaints(query?: Partial<Complaint>): Promise<Complaint[]> {
    if (!query) {
      return await db.select().from(complaints);
    }
    
    let queryBuilder = db.select().from(complaints);
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryBuilder = queryBuilder.where(eq(complaints[key as keyof typeof complaints], value));
      }
    });
    
    return await queryBuilder;
  }

  async deleteComplaint(id: number): Promise<boolean> {
    const result = await db.delete(complaints).where(eq(complaints.id, id));
    return result.rowCount > 0;
  }

  // Task methods
  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db.insert(tasks).values(insertTask).returning();
    return task;
  }

  async updateTask(id: number, taskData: Partial<Task>): Promise<Task | undefined> {
    const now = new Date();
    // If the task is being completed, set the completed date
    let updateData = { ...taskData, updatedAt: now };
    if (taskData.status === 'completed') {
      updateData.completedAt = now;
    }
    
    const [updatedTask] = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask;
  }

  async getTasks(query?: Partial<Task>): Promise<Task[]> {
    if (!query) {
      return await db.select().from(tasks);
    }
    
    let queryBuilder = db.select().from(tasks);
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryBuilder = queryBuilder.where(eq(tasks[key as keyof typeof tasks], value));
      }
    });
    
    return await queryBuilder;
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return result.rowCount > 0;
  }

  // Client methods
  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client;
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const [client] = await db.insert(clients).values(insertClient).returning();
    return client;
  }

  async updateClient(id: number, clientData: Partial<Client>): Promise<Client | undefined> {
    const [updatedClient] = await db
      .update(clients)
      .set(clientData)
      .where(eq(clients.id, id))
      .returning();
    return updatedClient;
  }

  async getClients(query?: Partial<Client>): Promise<Client[]> {
    if (!query) {
      return await db.select().from(clients);
    }
    
    let queryBuilder = db.select().from(clients);
    
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryBuilder = queryBuilder.where(eq(clients[key as keyof typeof clients], value));
      }
    });
    
    return await queryBuilder;
  }

  async deleteClient(id: number): Promise<boolean> {
    const result = await db.delete(clients).where(eq(clients.id, id));
    return result.rowCount > 0;
  }

  // Dashboard stats
  async getDashboardStats(): Promise<any> {
    // Get all tasks
    const tasksList = await db.select().from(tasks);
    const usersList = await db.select().from(users);
    
    // Group tasks by status
    const pendingTasks = tasksList.filter(t => t.status === 'pending');
    const inProgressTasks = tasksList.filter(t => t.status === 'in-progress');
    const completedTasks = tasksList.filter(t => t.status === 'completed');
    
    // Calculate task completion rate
    const totalCompletedTasks = completedTasks.length;
    const totalTasks = tasksList.length;
    const completionRate = totalTasks > 0 ? (totalCompletedTasks / totalTasks) * 100 : 0;
    
    // Calculate tasks by priority
    const urgentTasks = tasksList.filter(t => t.priority === 'urgent').length;
    const highPriorityTasks = tasksList.filter(t => t.priority === 'high').length;
    const mediumPriorityTasks = tasksList.filter(t => t.priority === 'medium').length;
    const lowPriorityTasks = tasksList.filter(t => t.priority === 'low').length;
    
    // Calculate overdue tasks
    const now = new Date();
    const overdueTasks = tasksList.filter(t => {
      if (!t.dueDate || t.status === 'completed' || t.status === 'cancelled') return false;
      return new Date(t.dueDate) < now;
    }).length;
    
    // Calculate on-time completion percentage for tasks with due dates
    const completedTasksWithDueDates = completedTasks.filter(t => t.dueDate && t.completedAt);
    const onTimeCompletions = completedTasksWithDueDates.filter(t => {
      if (!t.dueDate || !t.completedAt) return false;
      return new Date(t.completedAt) <= new Date(t.dueDate);
    });
    
    const onTimePercentage = completedTasksWithDueDates.length > 0 
      ? (onTimeCompletions.length / completedTasksWithDueDates.length) * 100 
      : 100;
    
    // Group tasks by assignee
    const tasksByAssignee: Record<number, {
      total: number;
      pending: number;
      inProgress: number;
      completed: number;
      user: User | undefined;
    }> = {};
    
    tasksList.forEach(task => {
      if (task.assignedTo) {
        if (!tasksByAssignee[task.assignedTo]) {
          const user = usersList.find(u => u.id === task.assignedTo);
          tasksByAssignee[task.assignedTo] = {
            total: 0,
            pending: 0,
            inProgress: 0,
            completed: 0,
            user
          };
        }
        
        tasksByAssignee[task.assignedTo].total++;
        
        if (task.status === 'pending') {
          tasksByAssignee[task.assignedTo].pending++;
        } else if (task.status === 'in-progress') {
          tasksByAssignee[task.assignedTo].inProgress++;
        } else if (task.status === 'completed') {
          tasksByAssignee[task.assignedTo].completed++;
        }
      }
    });
    
    // Recent tasks (last 5)
    const recentTasks = [...tasksList]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 5);
    
    // Pending tasks (first 5)
    const pendingTasksList = pendingTasks
      .sort((a, b) => new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime())
      .slice(0, 5);

    // Return dashboard stats object
    return {
      counts: {
        total: totalTasks,
        pending: pendingTasks.length,
        inProgress: inProgressTasks.length,
        completed: completedTasks.length,
        overdue: overdueTasks,
      },
      completionRate,
      onTimePercentage,
      priorities: {
        urgent: urgentTasks,
        high: highPriorityTasks,
        medium: mediumPriorityTasks,
        low: lowPriorityTasks,
      },
      assignees: Object.values(tasksByAssignee),
      recentTasks,
      pendingTasks: pendingTasksList,
    };
  }
}

// Initialize storage with the database implementation
export const storage = new DatabaseStorage();
