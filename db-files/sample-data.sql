-- Roles
INSERT INTO ROLE (name, createdBy, updatedBy) VALUES
('Employee', 'system', 'system'),
('Manager', 'system', 'system'),
('Admin', 'system', 'system');

-- Teams
INSERT INTO TEAMS (name, description, createdBy, updatedBy) VALUES
('Backend',  'Develops and maintains server-side business logic and APIs', 'system', 'system'),
('Frontend', 'Designs and implements user-facing interfaces and client-side logic', 'system', 'system'),
('Testing',  'Ensures application quality through manual and automated testing', 'system', 'system'),
('DBA',      'Manages database design, performance, security, and maintenance', 'system', 'system'),
('TechOps',  'Handles infrastructure, deployments, monitoring, and system reliability', 'system', 'system');

-- Employees
INSERT INTO EMPLOYEES (teamId, name, email, phone, joiningDate, primarySkill, createdBy, updatedBy)
VALUES
(5, 'Alice Johnson', 'alice@example.com', '9876543210', '2023-05-10', 'Node.js', 'system', 'system'),
(5, 'Bob Smith', 'bob@example.com', '9876543211', '2023-06-15', 'React', 'system', 'system'),
(1, 'Vivek Singh', 'viveksingh12@testing.com', '9812345678', '2023-08-21', 'Full stack', 'system', 'system'),
(1, 'Suraj kumar', 'surajkumar34@testing.com', '9876501234', '2023-09-12', 'Java', 'system', 'system'),
(2, 'Aastha singh', 'aasthasingh56@testing.com', '9123456789', '2023-11-03', 'ReactJS', 'system', 'system'),
(4, 'Gayatri Belihelli', 'gayatribelihelli78@testing.com', '9988776655', '2024-01-18', 'Java', 'system', 'system'),
(2, 'Praveen Mylvakanam', 'praveenmylvakanam90@testing.com', '9090909090', '2024-03-05', 'Java', 'system', 'system'),
(1, 'Balasubramanian Kumarasamy', 'balasubramaniankumarasamy11@testing.com', '9345678901', '2024-04-22', 'Full stack', 'system', 'system'),
(3, 'Archan Thirikot', 'archanthirikot22@testing.com', '9765432109', '2024-06-10', 'QA', 'system', 'system');


-- Users (passwords should be bcrypt hashes)
INSERT INTO USER (username, password, roleId, employeeId, createdBy, updatedBy)
VALUES
('employee',     '$2b$10$ODKMzhIA9LKAy/ndvJYjS.XmIybdOgADHVhFXFvgzi/VTxy0GKjyq', 1, 2, 'system', 'system'),
('vivek_s',   '$2b$10$ODKMzhIA9LKAy/ndvJYjS.XmIybdOgADHVhFXFvgzi/VTxy0GKjyq', 1, 3, 'system', 'system'),
('suraj_k',   '$2b$10$ODKMzhIA9LKAy/ndvJYjS.XmIybdOgADHVhFXFvgzi/VTxy0GKjyq', 1, 4, 'system', 'system'),
('aastha_s',  '$2b$10$ODKMzhIA9LKAy/ndvJYjS.XmIybdOgADHVhFXFvgzi/VTxy0GKjyq', 1, 5, 'system', 'system'),
('gayatri_b', '$2b$10$ODKMzhIA9LKAy/ndvJYjS.XmIybdOgADHVhFXFvgzi/VTxy0GKjyq', 1, 6, 'system', 'system'),
('praveen_m', '$2b$10$ODKMzhIA9LKAy/ndvJYjS.XmIybdOgADHVhFXFvgzi/VTxy0GKjyq', 1, 7, 'system', 'system'),
('archan_t',  '$2b$10$ODKMzhIA9LKAy/ndvJYjS.XmIybdOgADHVhFXFvgzi/VTxy0GKjyq', 1, 9, 'system', 'system'),
('manager', '$2b$10$ODKMzhIA9LKAy/ndvJYjS.XmIybdOgADHVhFXFvgzi/VTxy0GKjyq', 2, 1, 'system', 'system'),
('bala',  '$2b$10$ODKMzhIA9LKAy/ndvJYjS.XmIybdOgADHVhFXFvgzi/VTxy0GKjyq', 2, 8, 'system', 'system');

-- Tasks
INSERT INTO TASKS (name, description, category, createdBy, updatedBy)
VALUES
-- KT (Knowledge Transfer)
('KT: Project Overview', 'Provide end-to-end overview of the project, architecture, and key modules', 'KT', 'system', 'system'),
('KT: Codebase Walkthrough', 'Walk through repository structure, coding standards, and key services', 'KT', 'system', 'system'),
('KT: Data Flow & Integrations', 'Explain data flow, upstream/downstream integrations, and dependencies', 'KT', 'system', 'system'),
('KT: Support & Ops Handover', 'Share SOPs, incident handling, and escalation paths', 'KT', 'system', 'system'),

-- Local setup
('Local Setup: Access & Accounts', 'Set up required access (repo, VPN, DB, tools) and validate permissions', 'Local setup', 'system', 'system'),
('Local Setup: Dev Environment', 'Install prerequisites and configure IDE, SDKs, and environment variables', 'Local setup', 'system', 'system'),
('Local Setup: Run Application Locally', 'Build and run services locally; verify health checks and logs', 'Local setup', 'system', 'system'),
('Local Setup: Database Connection', 'Configure DB connection strings and validate read/write connectivity', 'Local setup', 'system', 'system'),

-- Onboarding
('Onboarding: Company Policies', 'Complete HR and compliance onboarding requirements', 'Onboarding', 'system', 'system'),
('Onboarding: Team Introduction', 'Meet the team, understand roles, and communication channels', 'Onboarding', 'system', 'system'),
('Onboarding: Tooling Orientation', 'Get familiar with Jira/ADO, Confluence/Wiki, Git flow, and release process', 'Onboarding', 'system', 'system'),
('Onboarding: First Contribution', 'Pick a starter ticket, raise PR, and complete code review cycle', 'Onboarding', 'system', 'system'),

-- Trainings
('Training: Secure Coding Basics', 'Complete secure coding training and review OWASP basics', 'Trainings', 'system', 'system'),
('Training: CI/CD Pipeline', 'Learn build/release pipeline stages, approvals, and deployment strategy', 'Trainings', 'system', 'system'),
('Training: Database Fundamentals', 'Complete training on schema, indexing, query tuning, and backup strategy', 'Trainings', 'system', 'system'),
('Training: Monitoring & Alerts', 'Learn dashboards, logs, metrics, alert triage, and on-call basics', 'Trainings', 'system', 'system');

INSERT INTO EMPLOYEE_TASK (employeeId, taskId, status, POC, dueDate, createdBy, updatedBy)
VALUES
-- Alice (Manager) onboarding + KT
(1,  3,  'Completed',       'Bala',    '2023-08-25', 'system', 'system'),
(1,  11, 'Completed',       'HR',      '2023-08-20', 'system', 'system'),
(1,  12, 'Sent for Review', 'Bala',    '2023-08-28', 'system', 'system'),

-- Bob
(2,  2,  'In Progress',     'Suraj',   '2023-09-22', 'system', 'system'),
(2,  13, 'New',             'Alice',   '2023-09-30', 'system', 'system'),

-- Vivek
(3,  7,  'Completed',       'TechOps', '2023-08-18', 'system', 'system'),
(3,  8,  'Sent for Review', 'TechOps', '2023-08-23', 'system', 'system'),
(3,  9,  'In Progress',     'Alice',   '2023-09-05', 'system', 'system'),

-- Suraj
(4,  2,  'Sent for Review', 'Alice',   '2023-09-18', 'system', 'system'),
(4,  14, 'New',             'Alice',   '2023-10-02', 'system', 'system'),

-- Aastha (Testing)
(5,  15, 'Completed',       'Bala',    '2023-11-10', 'system', 'system'),
(5,  18, 'In Progress',     'Praveen', '2023-11-20', 'system', 'system'),

-- Gayatri (DBA)
(6,  10, 'In Progress',     'Gayatri', '2024-02-05', 'system', 'system'),
(6,  17, 'New',             'Bala',    '2024-02-25', 'system', 'system'),

-- Praveen (TechOps)
(7,  16, 'Completed',       'Praveen', '2024-03-20', 'system', 'system'),
(7,  18, 'Completed',       'Praveen', '2024-03-25', 'system', 'system'),

-- Bala (Manager)
(8,  6,  'Completed',       'Bala',    '2024-04-30', 'system', 'system'),
(8,  5,  'In Progress',     'Bala',    '2024-05-10', 'system', 'system'),

-- Archan
(9,  1,  'New',             'Alice',   '2024-06-20', 'system', 'system'),
(9,  9,  'New',             'TechOps', '2024-06-28', 'system', 'system');

INSERT INTO TASK_COMMENTS (comment, employeetaskId, createdBy, updatedBy)
VALUES
-- Alice's tasks (1,2,3)
('KT completed and materials shared on the wiki.', 1, 'alice', 'alice'),
('HR onboarding completed; compliance acknowledged.', 2, 'alice', 'alice'),
('Team intro sent for review; awaiting manager confirmation.', 3, 'bala', 'bala'),

-- Bob's tasks (4,5)
('UI design work in progress; pending final UX inputs.', 4, 'bob', 'bob'),
('Tooling orientation created; session to be scheduled.', 5, 'alice', 'alice'),

-- Vivek's tasks (6,7,8)
('Access setup completed: repo/VPN/tools verified.', 6, 'vivek', 'vivek'),
('Dev environment setup sent for review; awaiting validation.', 7, 'vivek', 'vivek'),
('Local run in progress; troubleshooting env configs.', 8, 'vivek', 'vivek'),

-- Suraj's tasks (9,10)
('UI screens sent for review; need API contract confirmation.', 9, 'suraj', 'suraj'),
('First contribution created as New; will start next sprint.', 10, 'suraj', 'suraj'),

-- Aastha's tasks (11,12)
('Secure coding training completed; quiz passed.', 11, 'aastha', 'aastha'),
('Monitoring training in progress; reviewing alerts & dashboards.', 12, 'aastha', 'aastha'),

-- Gayatri's tasks (13,14)
('DB connection setup in progress; validating network access.', 13, 'gayatri', 'gayatri'),
('DB fundamentals training marked New; scheduled for next week.', 14, 'gayatri', 'gayatri'),

-- Praveen's tasks (15,16)
('CI/CD training completed; understood pipeline flow.', 15, 'praveen', 'praveen'),
('Monitoring training completed; on-call runbook reviewed.', 16, 'praveen', 'praveen'),

-- Bala's tasks (17,18)
('Ops handover completed; SOPs and escalation shared.', 17, 'bala', 'bala'),
('Data flow KT in progress; aligning with integration owners.', 18, 'bala', 'bala'),

-- Archan's tasks (19,20)
('Task marked New; waiting for access approvals.', 19, 'archan', 'archan'),
('Local run task created as New; will start after setup.', 20, 'archan', 'archan');