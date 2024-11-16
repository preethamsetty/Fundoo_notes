import HttpStatus from 'http-status-codes';
import userService from '../services/user.service';
import { Request, Response, NextFunction } from 'express';
import { sendEmail } from '../utils/user.util';

class UserController {
  public UserService = new userService();

  // Register user
  public registerUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const data = await this.UserService.registerUser(req.body);
      res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        message: 'User registered successfully'
      });
    } catch (error) {
      next(error); 
    }
  };

  // Log in user
  public loginUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { token, user } = await this.UserService.loginUser(req.body);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        token,
        message: `${user.firstName} Logged in successfully`
      });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).send(error.message);
    }
  };

  // Forget password
  public forgetPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { email } = req.body;
      const token = await this.UserService.forgetPassword(email);

      // Sending token via email
      await sendEmail(email, token);

      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Reset token sent to email successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // Reset password
  public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const token = req.header('Authorization')?.split(' ')[1];
      const { newPassword } = req.body;
      if (!token) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          code: HttpStatus.UNAUTHORIZED,
          message: 'Authorization token is required'
        });
      }
      const userId = res.locals.user; 
      await this.UserService.resetPassword(newPassword,userId);

      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Password reset successfully',
      });
    } catch (error) {
      next(error);
    }
  };

}

export default UserController;
