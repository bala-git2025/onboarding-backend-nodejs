import { Router, Request, Response } from 'express';
import { EmployeeRepository } from '../repositories/employeeRepository';
import { send200, send500, send404, send201, send400 } from '../arch-layer/response/reponse';

const router = Router();
const employeeRepo = new EmployeeRepository();

/**
 * GET /employees
 * Fetch all employees
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const employees = await employeeRepo.getAllEmployees();
    send200(res, req.path, { employees });
  } catch (err) {
    send500(res, req.path, err as Error);
  }
});

/**
 * GET /employees/:id
 * Fetch employee by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const employeeId = parseInt(req.params.id, 10);

    if (isNaN(employeeId)) {
      return send404(res, req.path, [{
        fieldName: 'id',
        type: 'validation',
        description: 'Invalid Employee Id'
      }]);
    }

    const employee = await employeeRepo.getEmployeeById(employeeId);

    if (!employee) {
      return send404(res, req.path, [{
        fieldName: 'id',
        type: 'not-found',
        description: 'Employee Not Found'
      }]);
    }

    send200(res, req.path, { employee });
  } catch (err) {
    send500(res, req.path, err as Error);
  }
});

/**
 * POST /employees
 * Create a new employee
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return send404(res, req.path, [{
        fieldName: 'name, email, role',
        type: 'validation',
        description: 'One or more required fields are missing'
      }]);
    }

    const employeeData = {
      ...req.body,
      createdOn: req.body.createdOn || new Date().toISOString(),
      updatedOn: req.body.updatedOn || new Date().toISOString(),
      createdBy: req.body.createdBy || (req as any).user?.id || null,
      updatedBy: req.body.updatedBy || (req as any).user?.id || null
    };

    const newEmployee = await employeeRepo.createEmployee(employeeData);
    send201(res, req.path, { employee: newEmployee });
  } catch (err) {
    send500(res, req.path, err as Error);
  }
});

/**
 * PUT /employees/:id
 * Update an employee
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const employeeId = parseInt(req.params.id, 10);

    if (isNaN(employeeId)) {
      return send400(res, req.path, [{
        fieldName: 'id',
        type: 'validation',
        description: 'Invalid Employee Id format. Must be a number.'
      }]);
    }

    const existingEmployee = await employeeRepo.getEmployeeById(employeeId);

    if (!existingEmployee) {
      return send404(res, req.path, [{
        fieldName: 'id',
        type: 'not-found',
        description: 'Employee Not Found'
      }]);
    }

    const updateData = {
      ...req.body,
      updatedOn: new Date().toISOString(),
      updatedBy: req.body.updatedBy || (req as any).user?.id || existingEmployee.updatedBy
    };

    const updatedEmployee = await employeeRepo.updateEmployee(employeeId, updateData);

    if (!updatedEmployee) {
      return send500(res, req.path, new Error('Employee update failed for an unknown reason.'));
    }

    send200(res, req.path, { employee: updatedEmployee });
  } catch (err) {
    send500(res, req.path, err as Error);
  }
});

/**
 * DELETE /employees/:id
 * Delete employee by ID
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const employeeId = parseInt(req.params.id, 10);

    if (isNaN(employeeId)) {
      return send400(res, req.path, [{
        fieldName: 'id',
        type: 'validation',
        description: 'Invalid Employee Id format. Must be a number.'
      }]);
    }

    const deletedEmployee = await employeeRepo.deleteEmployee(employeeId);

    if (!deletedEmployee) {
      return send404(res, req.path, [{
        fieldName: 'id',
        type: 'not-found',
        description: 'Employee Not Found'
      }]);
    }

    res.status(204).send();
  } catch (err) {
    send500(res, req.path, err as Error);
  }
});

export default router;
