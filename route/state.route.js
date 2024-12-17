import express from 'express';
import stateController from '../controller/state.controller.js';
import protectedRoute from '../middleware/protectRoute.middleware.js';
const router = express.Router()
router.route('/state/list').get(protectedRoute,stateController.getAllStates);
router.route('/state/:id').get(protectedRoute,stateController.getSingle);
router.route('/state/:id').delete(protectedRoute,stateController.deleteRecord);
router.route('/state/create').post(protectedRoute,stateController.createNewState);
router.route('/state/update/:id').put(protectedRoute,stateController.updateState);
export default router