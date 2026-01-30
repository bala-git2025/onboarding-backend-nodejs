// Central place for SQL queries

export const CHECK_CONN_QUERY = "SELECT 1";

export const UserQueries = {
  findByUserName: `
    SELECT
      u.id,
      u.username AS userName,
      u.password,
      u.roleId,
      u.employeeId AS employeeId,
      e.name AS employeeName,
      r.name AS role
    FROM "User" u
    JOIN "Role" r ON u.roleId = r.id
    JOIN "Employees" e ON u.employeeId = e.id
    WHERE u.username = $1
  `,

  insertUser: ` 
    INSERT INTO "User" (username, password, roleId)
    VALUES ($1, $2, $3) 
    RETURNING id, username, roleId 
  `,

  findUserById: `
    SELECT 
      u.id,
      u.username AS userName,
      u.password,
      u.roleId,
      u.employeeId AS employeeId,
      r.name AS role
    FROM "User" u
    JOIN "Role" r ON u.roleId = r.id
    WHERE u.id = $1
  `,

  findUserProfile: `
    SELECT 
      u.username,
      u.password,
      r.name as role,
      e.id,
      e.name,
      e.email,
      e.phone,
      e.primarySkill,
      e.joiningDate,
      e.updatedOn AS lastUpdated,
      t.name AS teamName
    FROM "User" u inner join "Role" r
    on u.roleId = r.id
    inner join "Employees" e
    on u.employeeId = e.id
    LEFT JOIN "Teams" t ON e.teamId = t.id
    WHERE e.id = $1
  `,

  updateUserProfile: `
    UPDATE "Employees"
    SET
      email = $1,
      phone = $2,
      primarySkill = $3,
      updatedBy = $4,
      updatedOn = $5
    WHERE id = $6
    RETURNING id, name, email, phone, primarySkill, teamId, joiningDate, updatedOn
  `,

  updateUserEmployeeId: `
    UPDATE "User" 
    SET employeeId = $1 
    WHERE id = $2
  `,

  createEmployee: `
    INSERT INTO "Employees" (name, email, phone, primarySkill, teamId, joiningDate, updatedBy, updatedOn)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, name, email, phone, primarySkill, teamId, joiningDate, updatedOn
  `,
};


/* =========================
   TASK QUERIES
========================= */

// Fetch all the Tasks
export const FETCH_TASKS = "SELECT * FROM Tasks";

// Fetch Task by Id
export const FETCH_TASK_BY_ID = "SELECT * FROM Tasks WHERE id = ?";

// Create a new Task
export const CREATE_TASK = `
  INSERT INTO Tasks (name, description, category, createdBy, updatedBy, createdOn, updatedOn)
  VALUES (?, ?, ?, ?, ?, ?, ?)
  RETURNING *;
`;

// Fetching the newly created Task
export const CREATED_TASK = "SELECT * FROM Tasks ORDER BY id DESC LIMIT 1";

// Update the Task by Id
export const UPDATE_TASK_BY_ID = `
  UPDATE Tasks
  SET
    name = ?,
    description = ?,
    category = ?,
    updatedBy = ?,
    updatedOn = ?
  WHERE id = ?
`;

// Delete a Task
export const DELETE_TASK_BY_ID = "DELETE FROM Tasks WHERE id = ?";

// Fetch all Task Comments
export const FETCH_ALL_TASK_COMMENTS = "SELECT * FROM Task_Comments";

// Fetch Task comments by Employee Task Id
export const FETCH_TASK_COMMENTS_BY_ID = `
  SELECT
    tc.id AS comment_id,
    tc.comment,
    tc.createdOn,
    et.employeeId,
    et.status,
    et.POC,
    et.dueDate
  FROM Task_Comments AS tc
  INNER JOIN Employee_Task AS et ON tc.employeetaskId = et.id
  WHERE et.taskId = ?
  ORDER BY tc.createdOn DESC
`;

// Fetch Employees tasks by task Id
export const FETCH_EMPLOYEES_BY_TASKID = `
  SELECT 
    T.*, 
    ET.status, 
    ET.POC, 
    ET.id as employeeTaskId,
    ET.dueDate
  FROM Tasks T
  JOIN Employee_Task ET ON T.id = ET.taskId
  WHERE ET.employeeId = ? AND ET.taskId = ?
`;

// Check if Task exists
export const CHECK_TASK_EXISTS = "SELECT id FROM Tasks WHERE id = ?";

// Create a new employee-task assignment
export const CREATE_EMPLOYEE_TASK_ASSIGNMENT = `
  INSERT INTO Employee_Task (employeeId, taskId, status, POC, createdBy, updatedBy, createdOn, updatedOn)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

// Check if an employee exists
export const CHECK_EMPLOYEE_EXISTS = "SELECT id FROM Employees WHERE id = ?";

// Check if an assignment already exists
export const CHECK_ASSIGNMENT_EXISTS =
  "SELECT id FROM Employee_Task WHERE taskId = ? AND employeeId = ?";

// Fetch the newly created assignment
export const FETCH_CREATED_ASSIGNMENT = `
  SELECT
    ET.id, ET.employeeId, ET.taskId, ET.status, ET.POC,
    ET.createdBy, ET.updatedBy, ET.createdOn, ET.updatedOn,
    E.name as employeeName,
    T.name as taskName
  FROM Employee_Task ET
  JOIN Employees E ON ET.employeeId = E.id
  JOIN Tasks T ON ET.taskId = T.id
  WHERE ET.taskId = ? AND ET.employeeId = ?
`;

/* =========================
   EMPLOYEE QUERIES
========================= */

// Select employee by Id
export const SELECT_EMP_BY_ID = "SELECT * FROM Employees WHERE id = ?";

// Creating a new employee
export const CREATE_EMP = `
  INSERT INTO Employees (
    teamId, name, email, phone, joiningDate, primarySkill,
    createdBy, updatedBy, createdOn, updatedOn
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

// Fetch all employees
export const FETCH_EMPLOYEES = "SELECT * FROM Employees";

// Fetch last created employee
export const CREATED_EMP = "SELECT * FROM Employees ORDER BY id DESC LIMIT 1";

// Update employee by ID (full update)
export const UPDATE_EMP_BY_ID = `
  UPDATE Employees
  SET
    teamId = ?,
    name = ?,
    email = ?,
    phone = ?,
    joiningDate = ?,
    primarySkill = ?,
    updatedBy = ?,
    updatedOn = ?
  WHERE id = ?
`;

// Delete employee by ID
export const DELETE_EMP_BY_ID = "DELETE FROM Employees WHERE id = ?";

// Check if employee already exists by email
export const CHECK_EMP = "SELECT * FROM Employees WHERE email = ?";

/* =========================
   EMPLOYEE ↔ TASK QUERIES
========================= */

// Assign task to employee
export const ASSIGN_TASK_TO_EMPLOYEE = `
  INSERT INTO Employee_Task
  (employeeId, taskId, status, POC, createdBy, updatedBy)
  VALUES (?, ?, ?, ?, ?, ?)
`;

// Fetch all tasks of an employee
export const FETCH_TASKS_BY_EMPLOYEE = `
  SELECT t.*, et.status, et.POC, et.dueDate
  FROM Tasks t
  JOIN Employee_Task et ON t.id = et.taskId
  WHERE et.employeeId = ?
`;

// Update employee-task mapping
export const UPDATE_EMPLOYEE_TASK = `
  UPDATE Employee_Task
  SET
    status = ?,
    POC = ?
  WHERE id = ?
`;

// Remove task from employee
export const DELETE_EMPLOYEE_TASK = "DELETE FROM Employee_Task WHERE id = ?";

// Get team list
export const GET_TEAM_LIST = `
  SELECT *
  FROM Teams AS TEAM
  INNER JOIN Employees AS EMP ON TEAM.id = EMP.teamId
  INNER JOIN Employee_Task AS EMPTSK ON EMP.id = EMPTSK.employeeId
`;

// Get team details
export const GET_TEAM_DETAILS = `
  SELECT 
    employees.id AS id,
    employees.name AS name,
    employeeTask.status AS status,
    teams.name as TeamName,
    tasks.name as TaskName
  FROM Employees employees
  JOIN Employee_Task employeeTask ON employees.id = employeeTask.employeeId
  JOIN Teams teams ON teams.id = employees.teamId
  JOIN Tasks tasks ON tasks.id = employees.id
  WHERE employees.teamId = ?
`;

export const CREATE_EMPLOYEE_TASK = `
  INSERT INTO Employee_Task (
    employeeId, taskId, status, POC, dueDate, createdBy, updatedBy, createdOn, updatedOn
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  RETURNING *
`;

export const CHECK_EMPLOYEE =
  "SELECT * FROM Employee_Task WHERE employeeId = ?";

// Fetch specific task detail for an employee
export const FETCH_EMPLOYEE_TASK_DETAIL = `
  SELECT 
    T.*, 
    ET.status, 
    ET.POC, 
    ET.id as employeeTaskId,
    ET.dueDate
  FROM Tasks T
  JOIN Employee_Task ET ON T.id = ET.taskId
  WHERE ET.employeeId = ? AND ET.taskId = ?
`;

// Add comment to an employee task
export const ADD_COMMENT_TO_TASK = `
  INSERT INTO Task_Comments (comment, employeetaskId, createdBy, updatedBy, createdOn, updatedOn)
  VALUES (?, ?, ?, ?, ?, ?)
`;
