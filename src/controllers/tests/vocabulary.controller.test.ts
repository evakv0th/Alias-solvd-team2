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
  