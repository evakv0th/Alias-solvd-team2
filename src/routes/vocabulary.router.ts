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

vocabularyRouter.get('/:id', validateGetVocabularyByIdRout(), authenticateToken, vocabularyController.getById);
vocabularyRouter.post('/', validateCreateVocabularyRout(), authenticateToken, vocabularyController.create);
vocabularyRouter.patch('/:id', validateUpdateVocabularyRout(),  authenticateToken, vocabularyController.update);
vocabularyRouter.delete('/:id', validateDeleteVocabularyRout(), authenticateToken, vocabularyController.delete);

export default vocabularyRouter;
