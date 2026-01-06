export const CHECK_CONN_QUERY = 'SELECT 1';
export const SELECT_EMP_BY_ID = `SELECT * FROM employee WHERE id = $1`;
export const CREATE_EMP =  'INSERT INTO employee (name, email) VALUES ($1, $2) RETURNING *';
export const FECTH_TASKS= 'SELECT * FROM TASKS';
export const FETCH_TASK_BY_ID= 'SELECT * FROM TASKS WHERE ID=?';