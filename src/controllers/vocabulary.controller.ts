import { Request, Response } from 'express';
import { vocabularyService } from '../services/vocabulary.service';
import { IVocabulary } from '../interfaces/vocabulary.interface';
import HttpException from '../application/utils/exceptions/http-exceptions';
import HttpStatusCode from '../application/utils/exceptions/statusCode';

class VocabularyController {
  async getById(req: Request, res: Response): Promise<void> {
    const vocabularyId: string = req.params.id;

    try {
      const vocabulary = await vocabularyService.getById(vocabularyId);
      res.status(HttpStatusCode.OK).json(vocabulary);
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.status).json({ error: error.message });
      } else {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
          error: 'Internal Server Error',
        });
      }
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    const newVocabulary = req.body;
    try {
      const vocabularyId: string = await vocabularyService.create(
        newVocabulary,
      );
      res.status(HttpStatusCode.CREATED).json({ id: vocabularyId });
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.status).json({ error: error.message });
      } else {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
          error: 'Internal Server Error',
        });
      }
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    const vocabularyId: string = req.params.id;
    const newVocabulary: IVocabulary = req.body;
    newVocabulary._id = vocabularyId;

    try {
      const updatedVocabulary: IVocabulary = await vocabularyService.update(
        newVocabulary,
      );
      res.status(HttpStatusCode.OK).json(updatedVocabulary);
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.status).json({ error: error.message });
      } else {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
          error: 'Internal Server Error',
        });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    const vocabularyId: string = req.params.id;

    try {
      await vocabularyService.delete(vocabularyId);
      res.status(HttpStatusCode.NO_CONTENT).send();
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.status).json({ error: error.message });
      } else {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
          error: 'Internal Server Error',
        });
      }
    }
  }
}

export const vocabularyController = new VocabularyController();
