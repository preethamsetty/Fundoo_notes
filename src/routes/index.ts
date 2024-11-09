import express, { IRouter } from 'express';
const router = express.Router();

import userRoute from './user.route';
import noteRoute from './note.route';  
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger/openapi.json';

// Set up the Swagger documentation route
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

console.log('Swagger Docs available at /api-docs');

/**
 * Function contains Application routes
 *
 * @returns router
 */
const routes = (): IRouter => {
  // Root route
  router.get('/', (req, res) => {
    res.json('Welcome to Fundoo Notes');
  });
  
  // User routes
  router.use('/users', new userRoute().getRoutes());

  // Note routes
  router.use('/notes', new noteRoute().getRoutes());  

  return router;
};

export default routes;
