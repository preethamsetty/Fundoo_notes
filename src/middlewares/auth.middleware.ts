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
const Auth = (secret_token:string)=>{
  return async (
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

    const decoded: any = await jwt.verify(bearerToken, secret_token);
    //console.log(decoded);
    res.locals.user = decoded.user._id;
 
    res.locals.token = bearerToken;
    next();
  } catch (error) {
    next(error);
  }
};
}
export const userAuth=Auth(process.env.JWT_SECRET);

export const passwordResetAuth=Auth(process.env.JWT_SECRET1);
