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