import express, { IRouter } from 'express';
import NoteController from '../controllers/note.controller';
import { userAuth } from '../middlewares/auth.middleware';
import NoteValidator from '../validators/note.validator';
import { cacheNotes, cacheNoteById } from '../middlewares/cache.middleware';

class NoteRoutes {
  private router = express.Router();
  private noteController = new NoteController();
  private noteValidator = new NoteValidator();

  constructor() {
    this.routes();
  }

  private routes = (): void => {
    // Route to create a new note
    this.router.post('', userAuth, this.noteValidator.validateNote, this.noteController.createNote);

    // Route to get all Notes of a user
    this.router.get('/', userAuth,cacheNotes, this.noteController.getAllNotes);

    // Route to get a note by its ID
     this.router.get('/:id', userAuth,cacheNoteById, this.noteController.getNoteById);

    // Route to update a note
    this.router.put('/:id', userAuth, this.noteValidator.validateNote, this.noteController.updateNote);

    // Route to permanently delete a note
    this.router.delete('/:id', userAuth, this.noteController.deleteNoteForever);

    // Route to toggle archive/unarchive
    this.router.put('/:id/archive', userAuth, this.noteController.ArchiveNote);

    // Route to toggle trash/restore
    this.router.put('/:id/trash', userAuth, this.noteController.TrashNote);

  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default NoteRoutes;
