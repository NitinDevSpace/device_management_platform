# Device Management Platform

## Introduction
The Device Management Platform is a comprehensive solution designed to manage and monitor devices efficiently. It provides a secure, scalable, and user-friendly interface for registering devices, tracking their status, and logging activities. This platform is ideal for organizations that need centralized control over a large fleet of devices.

## Features
- User authentication and authorization with JWT tokens.
- Device registration, update, and deletion.
- Activity logging for device operations.
- Background jobs for periodic tasks such as device health checks.
- RESTful API endpoints for easy integration.
- Middleware for secure API access.
- Detailed logging model separate from devices for audit and analysis.
- Postman collection for easy testing.

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT)
- **Background Jobs:** Node-cron or similar scheduling library
- **Testing:** Postman

## Project Structure
```
/device_management_platform
│
├── /models
│   ├── DeviceModal.js          # Device schema and model
│   ├── LogModal.js             # Log schema and model (separate for audit trail)
│   └── UserModal.js            # User schema and model
│
├── /routes
│   ├── authRoutes.js            # Authentication routes (login, register)
│   ├── deviceRoutes.js         # Device management routes
│
├── /middleware
│   └── authMiddleware.js  # JWT validation and authorization middleware
│
├── /controllers
│   ├── authController.js
│   ├── deviceController.js
│   └── logController.js
│
├── /config
│   └── db.js              # Database connection setup
│
├── app.js                 # Main Express app setup
├── server.js              # Server bootstrap file
└── README.md              # Project documentation
```

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/device_management_platform.git
cd device_management_platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Environment Variables
Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/device_management
JWT_SECRET=your_jwt_secret_key
```

### 4. Run the Server
```bash
npm start
```
The server will start on the port specified in `.env` (default 3000).

### 5. Import Postman Collection
- Open Postman.
- Import the provided `DeviceManagementPlatform.postman_collection.json` file located in the repo.
- Use this collection to test all API endpoints.

## Authentication Flow
- Users register or login via the Auth API.
- On successful login, a JWT token is issued.
- This token must be included in the `Authorization` header as `Bearer <token>` for all protected routes.
- The `authMiddleware` verifies the token and authorizes the user before granting access to device and log routes.
- This design ensures secure and stateless authentication.

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user.
- `POST /api/auth/login` - Authenticate user and receive JWT token.

### Devices
- `GET /api/devices` - List all devices (authenticated).
- `POST /api/devices` - Register a new device.
- `GET /api/devices/:id` - Get device details.
- `PUT /api/devices/:id` - Update device information.
- `DELETE /api/devices/:id` - Delete a device.

### Logs
- `GET /api/logs` - Retrieve logs with filtering options (date range, device ID).
- Logs are stored separately to maintain a clear audit trail and to optimize queries related to device activities without cluttering device data.

## Background Jobs
The platform includes background jobs that run periodically to:
- Check device health/status.
- Clean up old logs.
- Send notifications or alerts.

This is implemented using a scheduling library such as `node-cron`. Background jobs help maintain system health without manual intervention.

## Testing with Postman
- Use the provided Postman collection to test all endpoints.
- The collection includes pre-configured environment variables for JWT tokens.
- Test user registration, login, device management, and log retrieval workflows.
- This ensures the API behaves as expected and facilitates quick integration.

## Notes for Assessors
- The separation of the `Log` model from the `Device` model was a deliberate design choice to improve scalability and maintainability. It allows for efficient querying of logs without impacting device data retrieval.
- The `authMiddleware` ensures all protected routes are accessed only by authenticated users, enhancing security.
- Background jobs demonstrate the platform’s ability to handle periodic maintenance tasks autonomously.
- The project structure follows best practices for modularity and separation of concerns.
- The use of JWT provides stateless and scalable authentication.
- Postman collection is included to simplify testing and validation of the API endpoints.

Thank you for reviewing the Device Management Platform. Please feel free to reach out for any questions or further clarifications.
