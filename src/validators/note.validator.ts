import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';

class NoteValidator {
  // Validation for creating a new note
  public newNote = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      title: Joi.string().min(3).max(100).required(),
      description: Joi.string().max(500).optional(),
      color: Joi.string().optional(),
      isArchive: Joi.boolean().optional(),
      isTrash: Joi.boolean().optional(),
      createdBy: Joi.string().required() // Make sure to validate the user ID properly
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return next(error); // Pass the validation error to the next middleware
    }

    next(); // Proceed to the next middleware if validation is successful
  };

  // Validation for updating a note
  public updateNote = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      title: Joi.string().min(3).max(100).optional(),
      description: Joi.string().max(500).optional(),
      color: Joi.string().optional(),
      isArchive: Joi.boolean().optional(),
      isTrash: Joi.boolean().optional(),
      createdBy: Joi.string().optional() // Make sure this is optional for updates
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return next(error); // Pass the validation error to the next middleware
    }

    next(); // Proceed to the next middleware if validation is successful
  };
  
  // Validation for creating and updating a note
  public validateNote = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      title: Joi.string().min(1).required(),
      description: Joi.string().optional(),
      color: Joi.string().optional(),
      isArchive: Joi.boolean().optional(),
      isTrash: Joi.boolean().optional(),
      createdBy: Joi.string().optional() // Assuming createdBy is an ObjectId as a string
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return next(error); // Pass the validation error to the next middleware
    }

    next(); // Proceed to the next middleware if validation is successful
  };
}

export default NoteValidator;
