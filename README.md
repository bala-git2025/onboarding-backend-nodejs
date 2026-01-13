# Onboarding Backend

This project is a **Node.js + Express** backend service for managing onboarding workflows.  
It supports **SQLite** and **PostgreSQL** databases, provides REST APIs for employees, tasks, teams, managers, and health checks, and uses a structured repository/controller pattern.

---

##  Features
- Express.js server with modular controllers
- SQLite/Postgres database support via `DBManager`
- Centralized response utilities for consistent API responses
- Logger with configurable levels and outputs
- Health check endpoints for server and database

---

## Environment Setup

Update your `.env` file with the following credentials:

```env
# Server
PORT=5000        # server port
NODE_ENV=dev  

# Database
DB_TYPE=sqlite or postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=DB_username
DB_PASSWORD=password
DB_NAME=onboarding 

SQLITE_FILE=./onboarding.sqlite3

# Logger
LOGGER_LEVEL=debug       # debug | info | warn | error
LOGGER_CONSOLE=true      # true/false
LOGGER_FILE=false        # true/false
LOGGER_FILE_PATH=logs    # directory for log files

1. Clone the repository
git clone https://github.com/bala-git2025/onboarding-backend-nodejs

2. Install dependencies
npm install

3. Build the project
npm run build

4. Run the server
npm start

5. Run in dev mode (auto build + start)
npm run dev

🔑 Authentication
The backend provides authentication endpoints under /auth.

Login
Endpoint: POST http://localhost:5000/auth/login
Request Body: {
  "userName": "employee",
  "password": "welcome1"
}

## Default Login Credentials
Employee
User Name: employee
Password: welcome1
Manager
User Name: manager
Password: welcome1

Testing APIs
You can test endpoints using Postman or curl:
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userName":"employee","password":"welcome1"}'

Use the returned JWT token in the Authorization header for protected routes:
Authorization: Bearer <token>

# Health Check
Endpoint: GET http://localhost:5000/health

