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
      res.status(HttpStatus.UNAUTHORIZED).send(error.message);
    }
  };

  // Forget password
  public forgetPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { email } = req.body;
      const token = await this.UserService.forgetPassword(email);

      // Send token via email
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
      const userId = res.locals.user; // Get the user ID from the JWT
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
