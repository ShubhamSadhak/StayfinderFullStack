import {Router} from 'express';
import healthCheck from '../controllers/health.controller.js';

const healthRouter = Router();
healthRouter.route('/healthCheck').get(healthCheck);

export default healthRouter;