import express, { IRouter } from 'express';
import NoteController from '../controllers/note.controller';
import { userAuth } from '../middlewares/auth.middleware';
import NoteValidator from '../validators/note.validator';

class NoteRoutes {
  private router = express.Router();
  private noteController = new NoteController();
  private noteValidator = new NoteValidator();

  constructor() {
    this.routes();
  }

  private routes = (): void => {
    // Route to create a new note
    this.router.post('/create', userAuth, this.noteValidator.validateNote, this.noteController.createNote);

  this.router.get('/', userAuth, this.noteController.getAllNotes);

  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default NoteRoutes;
