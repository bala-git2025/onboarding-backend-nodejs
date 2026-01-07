export const CHECK_CONN_QUERY = 'SELECT 1';
export const SELECT_EMP_BY_ID = `SELECT * FROM employee WHERE id = $1`;
export const CREATE_EMP = 'INSERT INTO employee (name, email) VALUES ($1, $2) RETURNING *';
export const FETCH_TASKS = 'SELECT * FROM TASKS';
export const FETCH_TASK_BY_ID = 'SELECT * FROM TASKS WHERE ID=?';
export const CREATE_TASK = `
  INSERT INTO tasks (name, description, category, createdBy, updatedBy, createdOn, updatedOn)
  VALUES (?, ?, ?, ?, ?, ?, ?)
  RETURNING *;
`;
export const CREATED_TASK = 'SELECT * FROM Tasks ORDER BY id DESC LIMIT 1';
export const UPDATE_TASK_BY_ID = `
  UPDATE Tasks 
  SET 
    name = ?, 
    description = ?, 
    category = ?, 
    updatedBy = ?, 
    updatedOn = ? 
  WHERE 
    id = ?
`;
export const DELETE_TASK_BY_ID = 'DELETE FROM TASKS WHERE ID=?';
export const FETCH_ALL_TASK_COMMENTS = 'SELECT * FROM TASK_COMMENTS';


/* =========================
   EMPLOYEE QUERIES
========================= */

// Fetch all employees
export const FETCH_EMPLOYEES =
  'SELECT * FROM employee';

// Fetch last created employee
export const CREATED_EMP =
  'SELECT * FROM employee ORDER BY id DESC LIMIT 1';

// Update employee by ID
export const UPDATE_EMP_BY_ID = `
  UPDATE employee
  SET
    name = ?,
    email = ?,
    role = ?,
    updatedBy = ?,
    updatedOn = ?
  WHERE
    id = ?
`;

// Delete employee by ID
export const DELETE_EMP_BY_ID =
  'DELETE FROM employee WHERE id = ?';

/* =========================
   EMPLOYEE COMMENTS
========================= */

// Fetch comments by employee-task
export const FETCH_EMPLOYEE_COMMENTS_BY_EMPLOYEE_TASK_ID =
  'SELECT * FROM employee_comments WHERE employeetaskid = ?';

// Create employee comment
export const CREATE_EMPLOYEE_COMMENT =
  `INSERT INTO employee_comments
   (comment, employeetaskid, createdBy, updatedBy, createdOn, updatedOn)
   VALUES (?, ?, ?, ?, ?, ?)`;

// Fetch last created employee comment
export const CREATED_EMPLOYEE_COMMENT =
  'SELECT * FROM employee_comments ORDER BY id DESC LIMIT 1';

// Delete employee comment by ID
export const DELETE_EMPLOYEE_COMMENT_BY_ID =
  'DELETE FROM employee_comments WHERE id = ?';

  export const FETCH_ALL_EMPLOYEE_COMMENTS =
  'SELECT * FROM employee_comments';