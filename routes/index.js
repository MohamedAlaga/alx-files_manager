import express from 'express';
import AppController from '../controllers/AppController';

const router = express.Router();

const routeController = (app) => {
  app.use('/', router);
  router.get('/status', AppController.getStatus);
  router.get('/stats', AppController.getStats);
};

export default routeController;
