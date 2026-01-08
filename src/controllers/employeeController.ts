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

    if (isNaN(Number(req.params.id))) {
      return send400(res, req.path, [{
        fieldName: 'id',
        type: 'bad-request',
        description: 'Invalid Employee Id'
      }]);
    }

    const employee = await employeeRepo.getEmployeeById(employeeId);

    if (!employee) {
      return send404(res, req.path, [{
        fieldName: 'id',
        type: 'not-found',
        description: `Employee Not Found with id ${employeeId}`
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
    const { name, email, joiningDate, primarySkill, teamId, phone } = req.body;

    if (!name || !email || !joiningDate || !primarySkill) {
      return send400(res, req.path, [{
        fieldName: 'name, email, joiningDate, primarySkill',
        type: 'bad-request',
        description: 'One or more required fields are missing'
      }]);
    }

    if (teamId !== undefined && teamId !== null && isNaN(Number(teamId))) {
      return send400(res, req.path, [{
        fieldName: 'teamId',
        type: 'validation',
        description: 'teamId must be a number.'
      }]);
    }

    if (phone !== undefined && phone !== null) {
      if (!/^\d{10}$/.test(phone)) {
        return send400(res, req.path, [{
          fieldName: 'phone',
          type: 'validation',
          description: 'phone must be a 10-digit number.'
        }]);
      }
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
    if (err instanceof Error && err.message.includes('UNIQUE constraint failed: Employees.email')) {
      return send400(res, req.path, [{
        fieldName: 'email',
        type: 'validation',
        description: 'An employee with this email already exists.'
      }]);
    }
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
        type: 'bad-request',
        description: 'Invalid Employee Id format. Must be a number.'
      }]);
    }

    const existingEmployee = await employeeRepo.getEmployeeById(employeeId);

    if (!existingEmployee) {
      return send404(res, req.path, [{
        fieldName: 'id',
        type: 'not-found',
        description: `Employee Not Found with Id:${employeeId}`
      }]);
    }

    const allowedFields = ['teamId', 'name', 'email', 'phone', 'joiningDate', 'primarySkill'];
    const updateData: any = {
      updatedOn: new Date().toISOString(),
      updatedBy: req.body.updatedBy || (req as any).user?.id || existingEmployee.updatedBy
    };

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (field === 'teamId' && req.body[field] !== null && isNaN(Number(req.body[field]))) {
          return send400(res, req.path, [{
            fieldName: 'teamId',
            type: 'validation',
            description: 'teamId must be a number.'
          }]);
        }

        if (field === 'phone' && req.body[field] !== null && !/^\d{10}$/.test(req.body[field])) {
          return send400(res, req.path, [{
            fieldName: 'phone',
            type: 'validation',
            description: 'phone must be a 10-digit number.'
          }]);
        }

        updateData[field] = req.body[field];
      }
    }

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

    const deletedEmp = await employeeRepo.deleteEmployee(employeeId);

    if (!deletedEmp) {
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