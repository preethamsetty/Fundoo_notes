/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from 'http-status-codes';
import userService from '../services/user.service';
import { Request, Response, NextFunction } from 'express';

class UserController {
  public UserService = new userService();

  /**
   * Controller to create a new user
   * @param  {object} req - request object
   * @param {object} res - response object
   * @param {Function} next - next function
   */
  public registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const data = await this.UserService.registerUser(req.body);
      res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        data: data,
        message: 'User registered successfully'
      });
    } catch (error) {
      next(error); // Pass the error to the next middleware
    }
  };

  /**
   * Controller to log in a user
   * @param  {object} req - request object
   * @param {object} res - response object
   * @param {Function} next - next function
   */
  public loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const data = await this.UserService.loginUser(req.body);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: data,
        message: 'Login successful'
      });
    } catch (error) {
      next(error); // Pass the error to the next middleware
    }
  };
}

export default UserController;
