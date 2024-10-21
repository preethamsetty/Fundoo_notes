import express, { IRouter } from 'express';
const router = express.Router();

import userRoute from './user.route';
import noteRoute from './note.route';  // Import the note route

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
  router.use('/notes', new noteRoute().getRoutes());  // Add the note routes

  return router;
};

export default routes;
