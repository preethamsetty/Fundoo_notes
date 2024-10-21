import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status-codes';
import NoteService from '../services/note.service';


class NoteController {
  private noteService = new NoteService();

  // Controller to create a new note
  public createNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = res.locals.user;  // Get the user ID from the JWT
      console.log(userId);
      
      const data = await this.noteService.createNote(req.body, userId);
      res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        data,
        message: 'Note created successfully'
      });
    } catch (error) {
      next(error);
    }
  };

}

export default NoteController;
