import HttpStatus from 'http-status-codes';
import userService from '../services/user.service';
import { Request, Response, NextFunction } from 'express';

class UserController {
  public UserService = new userService();

  // Register user
  public registerUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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

  // Log in user
  public loginUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { token, user } = await this.UserService.loginUser(req.body);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: { user, token }, // Return the user and token
        message: 'Login successful'
      });
    } catch (error) {
      next(error); // Pass the error to the next middleware
    }
  };

}

export default UserController;
