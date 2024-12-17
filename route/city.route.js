import express from 'express';
import cityController from '../controller/city.controller.js';
import protectedRoute from '../middleware/protectRoute.middleware.js';
const router = express.Router()
router.route('/city/list').get(protectedRoute,cityController.getAllCities);
router.route('/city/:id').get(protectedRoute,cityController.getSingle);
router.route('/city/:id').delete(protectedRoute,cityController.deleteRecord);
router.route('/city/create').post(protectedRoute,cityController.createNewCity);
router.route('/city/update/:id').put(protectedRoute,cityController.updateCity);
export default router