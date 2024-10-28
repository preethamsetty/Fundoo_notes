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
      console.log(data.length)
      if (data.length === 0) {  // Check if the notes array is empty
        console.log(0);
        res.status(HttpStatus.NOT_FOUND).json({
          code: HttpStatus.NOT_FOUND,
          message: 'No notes present for the user'
        });
      }
      
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data,
        message: 'Notes fetched successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  // Controller to get a note by its ID
public getNoteById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const noteId = req.params.id;
    const userId = res.locals.user; // Get the user ID from the JWT

    const data = await this.noteService.getNoteById(noteId, userId);
    if (!data) {
      res.status(HttpStatus.NOT_FOUND).json({
        code: HttpStatus.NOT_FOUND,
        message: 'Note not found'
      });
      return;
    }

    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data,
      message: 'Note fetched successfully'
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
        
        message: 'Note updated successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  // Controller to toggle archive/unarchive a note
public ArchiveNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const noteId = req.params.id;
    const userId = res.locals.user;

    const data = await this.noteService.toggleArchiveNote(noteId, userId);
    const message = data.isArchive ? 'Note archived successfully' : 'Note unarchived successfully';

    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      //data,
      message
    });
  } catch (error) {
    next(error);
  }
};

// Controller to toggle trash/restore a note
public TrashNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const noteId = req.params.id;
    const userId = res.locals.user;

    const data = await this.noteService.toggleTrashNote(noteId, userId);

    const message = data.isTrash ? 'Note moved to trash successfully' : 'Note restored from trash successfully';

    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      //data,
      message
    });
  } catch (error) {
    // Specific error handling for archived notes that cannot be trashed
    if (error.message === 'Note is archived and cannot be trashed. Unarchive it first.') {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: error.message
      });
    } else {
      next(error); // For other errors
    }
  }
};

  // Controller to delete a note permanently
  public deleteNoteForever = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const noteId = req.params.id;
      const userId = res.locals.user; // Get the user ID from the JWT
      const data = await this.noteService.deleteNoteForever(noteId, userId);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data,
        message: 'Note deleted permanently'
      });
    } catch (error) {
      // Handle the specific error for notes not found in trash
      if (error.message === 'Note not found or it is not in trash. Cannot delete forever.') {
        res.status(HttpStatus.BAD_REQUEST).json({
          code: HttpStatus.BAD_REQUEST,
          message: error.message
        });
      }
      next(error); // For other errors
    }
  };


}

export default NoteController;
