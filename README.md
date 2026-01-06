# Investment Banking Deal Pipeline Management Portal

A full-stack web application that simulates how investment banks manage deal pipelines across M&A, equity financing, debt offerings, and IPOs, with strong focus on security, role-based access, and testing.

---

## Project Overview

Investment banks handle multiple high-value deals simultaneously. They require a system that provides:

- Clear pipeline visibility  
- Secure access to sensitive data  
- Role-based permissions  
- Audit-friendly workflows  

This project implements a secure and scalable Deal Pipeline Management Portal using modern full-stack technologies.

---

## Architecture

- Frontend: React Single Page Application (SPA)  
- Backend: RESTful Spring Boot application  
- Authentication: JWT-based stateless authentication  
- Database: MongoDB  
- Deployment: Docker and Docker Compose  
- Security: Role-based authorization (USER / ADMIN)  

---

## Technology Stack

### Frontend
- React with TypeScript  
- React Router v6  
- Redux Toolkit  
- React Hook Form with Zod  
- Material UI (MUI)  
- Axios with JWT interceptor  
- Vitest and React Testing Library  

### Backend
- Java 17  
- Spring Boot 3.x  
- Spring Security  
- Spring Data MongoDB  
- JWT Authentication  
- BCrypt password hashing  
- JUnit 5 and Mockito  
- JaCoCo for coverage  

### DevOps
- Docker  
- Docker Compose  
- Nginx (serving frontend build)  

---

## User Roles and Permissions

### USER
- Login  
- Create deals  
- View all deals  
- Edit non-sensitive fields (summary, sector, deal type)  
- Add notes  
- Update deal stage  
- Cannot view or edit deal value  
- Cannot delete deals  
- Cannot manage users  

### ADMIN
- All USER permissions  
- Edit deal value (sensitive field)  
- Delete deals  
- Create users  
- Activate or deactivate users  

---

## Authentication and Authorization

- JWT token issued on successful login  
- Token validated for all protected endpoints  
- Role-based authorization enforced on backend  
- Frontend route protection using PrivateRoute and RoleRoute  
- Passwords stored using BCrypt hashing  

---

## Backend API Overview

### Authentication and User Management

| Method | Endpoint                       | Description                    | Role         |
| ------ | ------------------------------ | ------------------------------ | ------------ |
| POST   | `/api/auth/login`              | Authenticate user & return JWT | Public       |
| POST   | `/api/admin/users`             | Create new user                | ADMIN        |
| GET    | `/api/users/me`                | Get logged-in user profile     | USER / ADMIN |
| PUT    | `/api/admin/users/{id}/status` | Activate / deactivate user     | ADMIN        |


---

### Deal Management

| Method | Endpoint                | Description                 | Role         |
| ------ | ----------------------- | --------------------------- | ------------ |
| POST   | `/api/deals`            | Create deal                 | USER / ADMIN |
| GET    | `/api/deals`            | List deals (with filters)   | USER / ADMIN |
| GET    | `/api/deals/{id}`       | Get deal details            | USER / ADMIN |
| PUT    | `/api/deals/{id}`       | Update non-sensitive fields | USER / ADMIN |
| PATCH  | `/api/deals/{id}/stage` | Update deal stage           | USER / ADMIN |
| PATCH  | `/api/deals/{id}/value` | Update deal value           | ADMIN        |
| POST   | `/api/deals/{id}/notes` | Add deal note               | USER / ADMIN |
| DELETE | `/api/deals/{id}`       | Delete deal                 | ADMIN        |


---

## Database Design (MongoDB)

### Users Collection
```json
{
  "_id": "ObjectId",
  "username": "rahul.doe",
  "email": "rahul@bank.com",
  "password": "$2a$10$...",
  "role": "USER",
  "active": true,
  "createdAt": "ISODate()"
}

### Deals Collection 
{
  "_id": "ObjectId",
  "clientName": "Groww Capital",
  "dealType": "M&A",
  "sector": "Manufacturing",
  "dealValue": 5000000,
  "currentStage": "Prospect",
  "summary": "Possible acquisition",
  "notes": [
    {
      "note": "Initial discussion completed",
      "timestamp": "ISODate()"
    }
  ],
  "createdAt": "ISODate()",
  "updatedAt": "ISODate()"
}


Testing Strategy
Backend Testing

Service-layer unit tests using JUnit 5 and Mockito

Both success and failure paths tested

Business logic isolated from infrastructure

JaCoCo used for coverage reporting

Backend coverage achieved:

Instruction coverage: ~93%

Branch coverage: ~80%

Frontend Testing

Vitest and React Testing Library

Tests include:

Login flow

Role-based UI rendering

Deal creation and updates

Notes functionality

API integration

Frontend coverage achieved: ~92%

Docker and Deployment
Run using Docker Compose
docker compose up --build


Services started:

Frontend (React build served via Nginx)

Backend (Spring Boot)

MongoDB

Running Locally Without Docker
Backend
cd deal-pipeline-backend
mvn spring-boot:run

Frontend
cd deal-pipeline-frontend
npm install
npm run dev

Key Highlights

Secure JWT-based authentication

Role-based access control

Clean layered architecture

High frontend and backend test coverage

Real-world investment banking workflow simulation