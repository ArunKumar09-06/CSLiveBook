import { Router } from 'express';
import { SearchController } from '../controllers/search.controller.js';

export const searchRouter = Router();

searchRouter.get('/', SearchController.search);
