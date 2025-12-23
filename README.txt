# Onboarding Backend

This project is a Node.js + Express backend service for managing onboarding workflows.  
It supports SQLite and PostgreSQL databases, provides REST APIs for employees, tasks, teams, managers
and health checks, and uses a structured repository/controller pattern.

## Features
- Express.js server with modular controllers
- SQLite/Postgres database support via DBManager
- Centralized response utilities for consistent API responses
- Logger with configurable levels and outputs
- Health check endpoints for server and database

## Environment Setup

update `.env` file with your credential :

#Server
PORT=5000  #server port
NODE_ENV=dev  

#Database
DB_TYPE=sqlite or postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=DB_username
DB_PASSWORD=password
DB_NAME=onboarding

SQLITE_FILE=./onboarding.sqlite3

#Logger
LOGGER_LEVEL=debug #debug | info | warn | error
LOGGER_CONSOLE=true  #true/false
LOGGER_FILE=false    #true/false
LOGGER_FILE_PATH=logs  #directory for log files

Notes:
- `DB_TYPE` can be `sqlite` or `postgres`.
- For SQLite, only `SQLITE_FILE` is required.
- For Postgres, configure host, port, user, password, and db name.

## Commands: 

1. Clone the repository:
git clone https://github.com/bala-git2025/onboarding-backend-nodejs

2. Install dependencies:
npm install

3. Build the project:
npm run build

4. Running the Server
npm start

npm run dev -- In dev Environment, it will build and start the server.



