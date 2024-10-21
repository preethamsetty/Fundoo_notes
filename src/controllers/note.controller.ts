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

  // Controller to get all notes for a user
  public getAllNotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = res.locals.user;
      const data = await this.noteService.getAllNotes(userId);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data,
        message: 'Notes fetched successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  // Controller to update a note
  public updateNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = res.locals.user;
      const noteId = req.params.id;
      console.log(req.params.id)
      const data = await this.noteService.updateNote(noteId, req.body, userId);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data,
        message: 'Note updated successfully'
      });
    } catch (error) {
      next(error);
    }
  };


  // Archive a note
  public archiveNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const noteId = req.params.id;
      const userId = res.locals.user;

      // Debugging logs to check if userId and noteId are valid
    console.log("UserID:", userId);
    console.log("NoteID:", noteId);

      // Check if the note is already in trash
      const note = await this.noteService.getNoteById(noteId, userId);
      if (note && note.isTrash) {
        res.status(HttpStatus.BAD_REQUEST).json({
          code: HttpStatus.BAD_REQUEST,
          message: "Cannot archive a note that is in trash"
        });
      }

      const data = await this.noteService.archiveNote(noteId, userId);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data,
        message: 'Note archived successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  // Unarchive a note
  public unarchiveNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const noteId = req.params.id;
      const userId = res.locals.user;
      const data = await this.noteService.unarchiveNote(noteId, userId);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data,
        message: 'Note unarchived successfully'
      });
    } catch (error) {
      next(error);
    }
  };


}

export default NoteController;
