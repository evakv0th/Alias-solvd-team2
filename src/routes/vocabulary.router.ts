import express from 'express';
import { vocabularyController } from '../controllers/vocabulary.controller';
import { authenticateToken } from '../application/middlewares/authenticateToken';
import {
  validateGetVocabularyByIdRout,
  validateCreateVocabularyRout,
  validateUpdateVocabularyRout,
  validateDeleteVocabularyRout
} from "../security/requestVocabularyRouteValidator"

const vocabularyRouter = express.Router();

vocabularyRouter.get('/:id', authenticateToken, validateGetVocabularyByIdRout, vocabularyController.getById);
vocabularyRouter.post('/', authenticateToken, validateCreateVocabularyRout, vocabularyController.create);
vocabularyRouter.patch('/:id', authenticateToken, validateUpdateVocabularyRout, vocabularyController.update);
vocabularyRouter.delete('/:id', authenticateToken, validateDeleteVocabularyRout, vocabularyController.delete);

export default vocabularyRouter;
