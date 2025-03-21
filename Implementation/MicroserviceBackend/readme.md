# Backend Folder Structure

This document describes the standardized folder structure for the microservices in this project. The goal is to maintain consistency, scalability, and maintainability.

## Folder Overview
```
/MicroServiceBackend
  /services
    /<microservice-name>
      /src
        /prisma          # Prisma schema & database migrations
          schema.prisma  # Database schema (replaces /models)
        /config          # Configuration files (DB, env, logging)
        /controllers     # Handles incoming requests and responses
        /routes          # API route definitions
        /services        # Business logic layer 
        /middleware      # Express middleware (auth, validation)
        /utils           # Helper functions (error handling, logging)
        /interfaces      # Defines typescript interfaces
        /tests           # Unit and integration tests
      .env               # Contains environment variables
      package.json       # Dependencies and scripts
      tsconfig.json      # TypeScript configuration
      README.md          # Documentation for this microservice
```

## Folder Descriptions

### `/config`
Stores configuration-related files such as database connections, environment variables, and logging setup.

### `/controllers`
Handles incoming HTTP requests, calls services, and returns responses to the client.

### `/routes`
Defines API endpoints and maps them to corresponding controllers.

### `/services`
Contains business logic. Services interact with to process requests.

### `/middleware`
Custom Express middleware for authentication, request validation, and logging.

### `/utils`
Utility functions such as error handling, logging, and other reusable helpers.

### `/interfaces`
Defines Typescript interfaces to ensure type safety.

### `/tests`
Contains unit and integration tests for the microservice.

## 🔧 Technologies Used

- **TypeScript**: Enforces static typing and improves code maintainability.
- **Prisma**: Used as the ORM for database modeling, migrations, and query operations.
- **Zod**: Used for validating and parsing request payloads at runtime, ensuring API inputs match expected schemas.

## Development Notes
- Each microservice follows this structure for consistency.
- TypeScript is used for type safety and scalability.
- Environment variables should be stored in `.env`.
- API Gateway is used for managing requests between services.
- Microservices communicate with each other via APIs.


This structure is designed to support the scalability of the project, ensuring it can handle future growth in users and complexity.
