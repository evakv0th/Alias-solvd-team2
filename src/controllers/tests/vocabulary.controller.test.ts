jest.mock('../../services/vocabulary.service');
import { Request, Response } from 'express';
import { vocabularyService } from '../../services/vocabulary.service';
import { vocabularyController } from '../vocabulary.controller';
import HttpStatusCode from '../../application/utils/exceptions/statusCode';
import HttpException from '../../application/utils/exceptions/http-exceptions';

const mockRequest = (params: any = {}, body: any = {}): Partial<Request> => ({
    params,
    body,
  });


const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};



describe('VocabularyController.getById', () => {
    it('should return vocabulary when found', async () => {
      const req = mockRequest();
      req.params = { id: 'vocabId' };
      const res = mockResponse();
  
      (vocabularyService.getById as jest.Mock).mockResolvedValue({ id: 'vocabId', words: [] });
  
      await vocabularyController.getById(req as Request, res as Response);
  
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
      expect(res.json).toHaveBeenCalledWith({ id: 'vocabId', words: [] });
    });
  
    it('should handle errors', async () => {
      const req = mockRequest();
      req.params = { id: 'vocabId' };
      const res = mockResponse();
  
      (vocabularyService.getById as jest.Mock).mockRejectedValue(new HttpException(HttpStatusCode.NOT_FOUND, 'Not found'));
  
      await vocabularyController.getById(req as Request, res as Response);
  
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
});
  

describe('VocabularyController.create', () => {
    it('should create a new vocabulary and return its id', async () => {
      const req = mockRequest({}, { words: ['word1', 'word2'] });
      const res = mockResponse();
  
      (vocabularyService.create as jest.Mock).mockResolvedValue('newVocabId');
  
      await vocabularyController.create(req as Request, res as Response);
  
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.CREATED);
      expect(res.json).toHaveBeenCalledWith({ id: 'newVocabId' });
    });
  
    it('should handle errors during vocabulary creation', async () => {
      const req = mockRequest({}, { words: ['word1', 'word2'] });
      const res = mockResponse();
  
      (vocabularyService.create as jest.Mock).mockRejectedValue(new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Error creating vocabulary'));
  
      await vocabularyController.create(req as Request, res as Response);
  
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error creating vocabulary' });
    });
  });
  
  describe('VocabularyController.update', () => {
    it('should update an existing vocabulary and return the updated vocabulary', async () => {
      const req = mockRequest({ id: 'vocabId' }, { words: ['word1', 'word2'] });
      const res = mockResponse();
      const updatedVocabulary = { _id: 'vocabId', words: ['word1', 'word2'] };
  
      (vocabularyService.update as jest.Mock).mockResolvedValue(updatedVocabulary);
  
      await vocabularyController.update(req as Request, res as Response);
  
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.OK);
      expect(res.json).toHaveBeenCalledWith(updatedVocabulary);
    });
  
    it('should handle errors during vocabulary update', async () => {
      const req = mockRequest({ id: 'vocabId' }, { words: ['word1', 'word2'] });
      const res = mockResponse();
  
      (vocabularyService.update as jest.Mock).mockRejectedValue(new HttpException(HttpStatusCode.NOT_FOUND, 'Vocabulary not found'));
  
      await vocabularyController.update(req as Request, res as Response);
  
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: 'Vocabulary not found' });
    });
  });
  
  describe('VocabularyController.delete', () => {
    it('should delete a vocabulary and return no content', async () => {
      const req = mockRequest({ id: 'vocabId' });
      const res = mockResponse();
  
      (vocabularyService.delete as jest.Mock).mockResolvedValue({});
  
      await vocabularyController.delete(req as Request, res as Response);
  
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.NO_CONTENT);
      expect(res.send).toHaveBeenCalled();
    });
  
    it('should handle errors during vocabulary deletion', async () => {
      const req = mockRequest({ id: 'vocabId' });
      const res = mockResponse();
  
      (vocabularyService.delete as jest.Mock).mockRejectedValue(new HttpException(HttpStatusCode.NOT_FOUND, 'Vocabulary not found'));
  
      await vocabularyController.delete(req as Request, res as Response);
  
      expect(res.status).toHaveBeenCalledWith(HttpStatusCode.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: 'Vocabulary not found' });
    });
});

  