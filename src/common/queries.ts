// Central place for SQL queries

export const CHECK_CONN_QUERY = "SELECT 1";

export const UserQueries = {
  findByUsername: `
    SELECT u.id, u.username, u.password, u.roleId, r.name as role
    FROM User u
    JOIN Role r ON u.roleId = r.id
    WHERE u.username = ?
  `,
  insertUser: ` INSERT INTO User (username, password, roleId) 
  VALUES (?, ?, ?) RETURNING id, username, roleId `,
};

// TASK QUERIES

// Fetch all the Tasks
export const FETCH_TASKS = "SELECT * FROM TASKS";

// Fetch Task by Id
export const FETCH_TASK_BY_ID = "SELECT * FROM TASKS WHERE ID=?";

// Create a new Task
export const CREATE_TASK = `
  INSERT INTO TASKS (name, description, category, createdBy, updatedBy, createdOn, updatedOn)
  VALUES (?, ?, ?, ?, ?, ?, ?)
  RETURNING *;
`;

// Fetching the newly created Task (for validation purpose)
export const CREATED_TASK = "SELECT * FROM TASKS ORDER BY id DESC LIMIT 1";

// Update the Task by Id
export const UPDATE_TASK_BY_ID = `
  UPDATE TASKS 
  SET 
    name = ?, 
    description = ?, 
    category = ?, 
    updatedBy = ?, 
    updatedOn = ? 
  WHERE 
    id = ?
`;

// Delete a Task
export const DELETE_TASK_BY_ID = "DELETE FROM TASKS WHERE ID=?";

// Fetch all Task Comments
export const FETCH_ALL_TASK_COMMENTS = "SELECT * FROM TASK_COMMENTS";

// Fetch Task comments by Employee Task Id
export const FETCH_TASK_COMMENTS_BY_ID = `
  SELECT
    tc.id AS comment_id,
    tc.comment,
    tc.createdOn,
    et.employeeId,
    et.status,
    et.POC
  FROM
    Task_Comments AS tc
  INNER JOIN
    Employee_Task AS et ON tc.employeetaskId = et.id
  WHERE
    et.taskId = ?
  ORDER BY
    tc.createdOn DESC
`;

// Fetch Employees tasks by task Id
export const FETCH_EMPLOYEES_BY_TASKID = `
  SELECT E.*, ET.status, ET.POC, ET.createdBy, ET.updatedBy, ET.createdOn, ET.updatedOn 
  FROM EMPLOYEE_TASK ET 
  JOIN EMPLOYEES E ON E.ID = ET.EMPLOYEEID 
  WHERE ET.TASKID = ?
`;

// Check if Task exists
export const CHECK_TASK_EXISTS = "SELECT id FROM TASKS WHERE id = ?";

// Query to create a new employee-task assignment
export const CREATE_EMPLOYEE_TASK_ASSIGNMENT = `
  INSERT INTO EMPLOYEE_TASK (employeeId, taskId, status, POC, createdBy, updatedBy, createdOn, updatedOn)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

// Query to check if an employee exists
export const CHECK_EMPLOYEE_EXISTS = "SELECT id FROM EMPLOYEES WHERE id = ?";

// Query to check if an assignment already exists (to prevent duplicates)
export const CHECK_ASSIGNMENT_EXISTS =
  "SELECT id FROM EMPLOYEE_TASK WHERE taskId = ? AND employeeId = ?";

// Query to fetch the newly created assignment to return it
export const FETCH_CREATED_ASSIGNMENT = `
  SELECT 
    ET.id, ET.employeeId, ET.taskId, ET.status, ET.POC, 
    ET.createdBy, ET.updatedBy, ET.createdOn, ET.updatedOn,
    E.name as employeeName,
    T.name as taskName
  FROM EMPLOYEE_TASK ET
  JOIN EMPLOYEES E ON ET.employeeId = E.id
  JOIN TASKS T ON ET.taskId = T.id
  WHERE ET.taskId = ? AND ET.employeeId = ?`;

/* =========================
   EMPLOYEE QUERIES
========================= */
// Select employee by Id
export const SELECT_EMP_BY_ID = "SELECT * FROM employees WHERE id = ?";

// Creating a new employee
export const CREATE_EMP = `INSERT INTO Employees (
    teamId, name, email, phone, joiningDate, primarySkill, 
    createdBy, updatedBy, createdOn, updatedOn
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

// Fetch all employees
export const FETCH_EMPLOYEES = "SELECT * FROM employees";

// Fetch last created employee
export const CREATED_EMP = "SELECT * FROM employees ORDER BY id DESC LIMIT 1";

// Update employee by ID
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
  WHERE
    id = ?
`;

// Delete employee by ID
export const DELETE_EMP_BY_ID = "DELETE FROM employees WHERE id = ?";

// Check if employee already exists or not by email
export const CHECK_EMP = "SELECT * FROM Employees WHERE email = ?";

/* =========================
   EMPLOYEE ↔ TASK QUERIES
========================= */

// Assign task to employee
export const ASSIGN_TASK_TO_EMPLOYEE = `
  INSERT INTO employee_task
  (employeeId, taskId, status, poc, createdBy, updatedBy)
  VALUES (?, ?, ?, ?, ?, ?)
`;

// Fetch all tasks of an employee
export const FETCH_TASKS_BY_EMPLOYEE = `
  SELECT t.*, et.status, et.poc
  FROM tasks t
  JOIN employee_task et ON t.id = et.taskId
  WHERE et.employeeId = ?
`;

// Update employee-task mapping
export const UPDATE_EMPLOYEE_TASK = `
  UPDATE employee_task
  SET
    status = ?,
    poc = ?
  WHERE id = ?
`;

// Remove task from employee
export const DELETE_EMPLOYEE_TASK = `
  DELETE FROM employee_task WHERE id = ?
`;
