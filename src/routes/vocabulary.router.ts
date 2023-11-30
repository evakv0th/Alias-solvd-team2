import express from 'express';
import { vocabularyController } from '../controllers/vocabulary.controller';
import { authenticateToken } from '../application/middlewares/authenticateToken';

const vocabularyRouter = express.Router();

vocabularyRouter.get('/:id', authenticateToken, vocabularyController.getById);
vocabularyRouter.post('/', authenticateToken, vocabularyController.create);
vocabularyRouter.patch('/:id', authenticateToken, vocabularyController.update);
vocabularyRouter.delete('/:id', authenticateToken, vocabularyController.delete);

export default vocabularyRouter;
