import express from 'express';
import { getRole, storeRole,updateRole,deleteRole } from '../controllers/RoleController.js';

const RolePermRouter = express.Router();

RolePermRouter.get('/roles',getRole);
RolePermRouter.post('/roles/store',storeRole);
RolePermRouter.post('/roles/update/:_id',updateRole);
RolePermRouter.post('/roles/delete/:_id',deleteRole);

export default RolePermRouter;