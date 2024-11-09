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
      createdBy: Joi.string().required() 
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return next(error); 
    }

    next(); 
  };

  // Validation for updating a note
  public updateNote = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      title: Joi.string().min(3).max(100).optional(),
      description: Joi.string().max(500).optional(),
      color: Joi.string().optional(),
      isArchive: Joi.boolean().optional(),
      isTrash: Joi.boolean().optional(),
      createdBy: Joi.string().optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return next(error); 
    }
    next(); 
  };
  
  // Validation for creating and updating a note
  public validateNote = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      title: Joi.string().min(1).required(),
      description: Joi.string().optional(),
      color: Joi.string().optional(),
      isArchive: Joi.boolean().optional(),
      isTrash: Joi.boolean().optional(),
      createdBy: Joi.string().optional() 
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return next(error); 
    }
    next(); 
  };
}

export default NoteValidator;
