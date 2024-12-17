import express from 'express';
import warehouseController from '../controller/warehouse.controller.js';
import protectedRoute from '../middleware/protectRoute.middleware.js';
const router = express.Router()
router.route('/warehouse/list').get(protectedRoute,warehouseController.getAllWarehouse);
router.route('/warehouse/:id').get(protectedRoute,warehouseController.getSingle);
router.route('/warehouse/:id').delete(protectedRoute,warehouseController.deleteRecord);
router.route('/warehouse/create').post(protectedRoute,warehouseController.createNewWarehouse);
router.route('/warehouse/update/:id').put(protectedRoute,warehouseController.updateWarehouse);
export default router