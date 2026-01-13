-- Roles
INSERT INTO ROLE (name, createdBy) VALUES
('Employee', 'system'),
('Manager', 'system');

-- Teams
INSERT INTO TEAMS (name, description, createdBy) VALUES
('Backend Team', 'Handles server-side logic', 'system'),
('Frontend Team', 'Responsible for UI development', 'system');

-- Employees
INSERT INTO EMPLOYEES (teamId, name, email, phone, joiningDate, primarySkill, createdBy)
VALUES
(1, 'Alice Johnson', 'alice@example.com', '9876543210', '2023-05-10', 'Node.js', 'system'),
(2, 'Bob Smith', 'bob@example.com', '9876543211', '2023-06-15', 'React', 'system');

-- Users (passwords should be bcrypt hashes)
INSERT INTO USER (username, password, roleId, employeeId, createdBy)
VALUES
('alice_user', '$2b$10$hashedpassword1', 1, 1, 'system'),
('bob_manager', '$2b$10$hashedpassword2', 2, 2, 'system');

-- Tasks
INSERT INTO TASKS (name, description, category, createdBy)
VALUES
('Build API', 'Develop REST API for onboarding', 'Development', 'system'),
('Design UI', 'Create onboarding UI screens', 'Design', 'system');

-- Employee_Task
INSERT INTO EMPLOYEE_TASK (employeeId, taskId, status, POC, createdBy)
VALUES
(1, 1, 'In Progress', 'Alice Johnson', 'system'),
(2, 2, 'Completed', 'Bob Smith', 'system');

-- Task_Comments
INSERT INTO TASK_COMMENTS (comment, employeetaskId, createdBy)
VALUES
('API endpoints need authentication', 1, 'Alice Johnson'),
('UI design approved by client', 2, 'Bob Smith');