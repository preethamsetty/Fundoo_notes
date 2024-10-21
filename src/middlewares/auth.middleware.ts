/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to authenticate if user has a valid Authorization token
 * Authorization: Bearer <token>
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export const userAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let bearerToken = req.header('Authorization');
    if (!bearerToken)
      throw {
        code: HttpStatus.UNAUTHORIZED,
        message: 'Authorization token is required'
      };
    bearerToken = bearerToken.split(' ')[1];

    const decoded: any = await jwt.verify(bearerToken, 'your-secret-key');
    console.log('Decoded user',decoded);
    console.log(decoded.user._id);
    res.locals.user = decoded.user._id;
 
    res.locals.token = bearerToken;
    next();
  } catch (error) {
    next(error);
  }
};
