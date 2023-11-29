import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import HttpException from '../application/utils/exceptions/http-exceptions';
import HttpStatusCode from '../application/utils/exceptions/statusCode';
import { IUser } from '../interfaces/user.interface';

class UserController {
  async getById(req: Request, res: Response): Promise<void> {
    const id: string = req.params.id;

    try {
      const user = await userService.getById(id);
      res.status(200).json(user);
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
    try {
      const newUser: IUser = req.body;
      const userId: string = await userService.create(newUser);
      res.status(201).json({ id: userId });
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
    const userId: string = req.params.id;
    const newUser: IUser = req.body;
    newUser._id = userId;

    try {
      const updatedUser: IUser = await userService.update(newUser);
      res.status(200).json(updatedUser);
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
    const userId: string = req.params.id;

    try {
      await userService.delete(userId);
      res.status(204).send();
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

export const userController = new UserController();
