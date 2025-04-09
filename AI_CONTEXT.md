ut# Project Infinity - AI Context Documentation

## Project Overview
This is a full-stack logistics and supply chain management system built with TypeScript, React, and Express.js. The project is designed to handle shipment tracking, customer management, payment processing, and internal task management.

## Core Technologies
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Radix UI
- **Backend**: Express.js, TypeScript, Drizzle ORM
- **Database**: PostgreSQL (via Neon serverless)
- **Authentication**: Passport.js with session management
- **State Management**: React Query
- **Routing**: Wouter
- **Styling**: Tailwind CSS with custom theme configuration

## Project Structure
```
project-infinity/
├── client/                 # Frontend React application
│   └── src/               # React source code
├── server/                # Backend Express application
│   ├── auth.ts           # Authentication logic
│   ├── db.ts             # Database configuration
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data storage operations
│   └── vite.ts           # Vite server configuration
├── shared/               # Shared code between client and server
│   └── schema.ts        # Database schemas and types
├── package.json         # Project dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## Database Schema
The system uses a PostgreSQL database with the following main entities:

### Users
- Primary authentication entity
- Roles: admin, manager, employee
- Fields: id, username, password, email, fullName, role, company, createdAt

### Shipments
- Core logistics entity
- Fields: id, trackingId, origin, destination, clientId, shipperId, dueDate, status, value, weight, description
- Statuses: pending, in-transit, delivered, delayed, cancelled

### Payments
- Financial transactions
- Fields: id, shipmentId, amount, status, paymentMethod, paymentDate, dueDate
- Statuses: pending, paid, overdue, cancelled

### Damages
- Damage reports and claims
- Fields: id, shipmentId, description, reportedBy, status, damageDate, claimAmount
- Statuses: pending, reviewing, approved, rejected

### Complaints
- Customer service management
- Fields: id, clientId, shipmentId, subject, description, status, priority, assignedTo
- Statuses: pending, investigating, resolved, closed
- Priorities: low, medium, high, critical

### Tasks
- Internal task management
- Fields: id, title, description, assignedTo, assignedBy, priority, type, relatedId, status, dueDate
- Types: shipment, payment, damage, complaint, report, client, general
- Statuses: pending, in-progress, completed, cancelled

### Clients
- Client information
- Fields: id, name, email, phone, address, country, createdAt

## Authentication System
- Session-based authentication using Passport.js
- Password hashing with scrypt
- Role-based access control
- API endpoints:
  - POST /api/register
  - POST /api/login
  - POST /api/logout
  - GET /api/user
  - GET /api/users (admin/manager only)

## API Structure
- RESTful API design
- Request logging middleware
- Error handling middleware
- Role-based route protection
- Development/production environment handling

## Security Features
- Secure password hashing with salt
- Timing-safe password comparison
- Session management with secure cookies
- Role-based authorization
- Environment-based security configurations

## Development Workflow
1. Development: `npm run dev`
2. Building: `npm run build`
3. Database: `npm run db:push`
4. Type Checking: `npm run check`

## Key Features
1. **User Management**
   - Multi-role system
   - Secure authentication
   - User profile management

2. **Logistics Management**
   - Shipment tracking
   - Status management
   - Client management
   - Payment processing

3. **Customer Service**
   - Complaint management
   - Damage reporting
   - Task assignment
   - Priority-based workflow

4. **Financial Management**
   - Payment tracking
   - Status monitoring
   - Due date management
   - Payment method tracking

## Important Notes for AI Assistants
1. **Type Safety**: The project uses TypeScript extensively. Always maintain type safety in suggestions.
2. **Security**: Never suggest exposing sensitive data or bypassing security measures.
3. **Database**: Use Drizzle ORM for database operations, not raw SQL.
4. **Authentication**: Always consider role-based access when suggesting features.
5. **Frontend**: Follow the existing UI patterns using Radix UI components and Tailwind CSS.
6. **State Management**: Use React Query for data fetching and caching.
7. **Error Handling**: Always include proper error handling in suggestions.
8. **Code Style**: Follow the existing code style and patterns.

## Common Patterns
1. **API Responses**: Always return consistent response formats
2. **Error Handling**: Use try-catch blocks with proper error propagation
3. **Authentication**: Check user roles before sensitive operations
4. **Data Validation**: Use Zod schemas for input validation
5. **Type Definitions**: Keep types in shared/schema.ts when used across client and server

## Development Guidelines
1. **New Features**: Consider both frontend and backend implications
2. **Database Changes**: Update schema.ts and run migrations
3. **Security**: Always implement proper authentication and authorization
4. **Performance**: Consider caching and optimization
5. **Testing**: Include error cases and edge conditions

This documentation should help AI assistants understand the project context and provide more accurate and contextually appropriate assistance. 