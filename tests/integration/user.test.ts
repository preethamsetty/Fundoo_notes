import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';

import app from '../../src/index';

describe('User APIs Test', () => {
  before((done) => {
    const clearCollections = () => {
      for (const collection in mongoose.connection.collections) {
        mongoose.connection.collections[collection].deleteOne(() => {});
      }
    };

    const mongooseConnect = async () => {
      await mongoose.connect(process.env.DATABASE_TEST);
      clearCollections();
    };

    if (mongoose.connection.readyState === 0) {
      mongooseConnect();
    } else {
      clearCollections();
    }

    done();
  });

  const userData = {
    firstName: 'Preetham',
    lastName: 'B S',
    email: 'preethambstest@gmail.com',
    password: 'Preethambs',
  };

  const noteData = {
    title: 'Test Note',
    description: 'This is a test note.',
    color: 'blue',
    isArchive: false,
    isTrash: false,
  };

  const updatedNoteData = {
    title: 'Updated Test Note',
    description: 'This is an updated test note.',
    color: 'green',
    isArchive: true,
    isTrash: false,
  };

  let token: string; 
  let createdNoteId:string;

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app.getApp())
        .post('/api/v1/users')
        .send(userData);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message', 'User registered successfully');
    });
    it('should return an error if required fields are missing', async () => {
      const res = await request(app.getApp())
        .post('/api/v1/users')
        .send({ email: 'test@gmail.com' });

      expect(res.status).to.equal(500);
      expect(res.body).to.have.property('message', '"firstName" is required');
    });
  });

  describe('User Login', () => {
    it('should log in an existing user successfully', async () => {
      const res = await request(app.getApp())
        .post('/api/v1/users/login')
        .send({ email: userData.email, password: userData.password });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('token'); 
      token = res.body.token;
    });
    it('should return an error for invalid credentials', async () => {
      const res = await request(app.getApp())
        .post('/api/v1/users/login')
        .send({ email: userData.email, password: 'WrongPassword' });

      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Invalid email or password');
    });
  });

  describe('Forgot Password', () => {
    it('should send a reset token to the user\'s email', async () => {
      const res = await request(app.getApp())
        .post('/api/v1/users/forget-password')
        .send({ email: userData.email });
       
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Reset token sent to email successfully');
    });
  });

  describe('Create Note', () => {
    it('should create a new note successfully', async () => {
      const res = await request(app.getApp())
        .post('/api/v1/notes')
        .set('Authorization', `Bearer ${token}`) 
        .send(noteData);
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message', 'Note created successfully'); 
      createdNoteId = res.body.data._id; 
    });
    it('should return an error if authorization token is missing', async () => {
      const res = await request(app.getApp())
        .post('/api/v1/notes')
        .send(noteData);

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message', 'Authorization token is required');
    });
  });

  describe('Get All Notes', () => {
    it('should return all notes of the user', async () => {
      const res = await request(app.getApp())
        .get('/api/v1/notes')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body.data).to.be.an('array');
    });
    it('should return an error if no authorization token is provided', async () => {
      const res = await request(app.getApp())
        .get('/api/v1/notes');

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message', 'Authorization token is required');
    });
  });

  describe('Get Note by ID', () => {
    it('should return a note by its ID', async () => {
      const noteId = createdNoteId 

      const res = await request(app.getApp())
        .get(`/api/v1/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body.data).to.have.property('_id', noteId);
    });
    it('should return an error for a non-existent note ID', async () => {
      const res = await request(app.getApp())
        .get('/api/v1/notes/invalidID')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(500);
    });
  });

  describe('Update Note', () => {
    it('should update a note successfully', async () => {
      const res = await request(app.getApp())
        .put(`/api/v1/notes/${createdNoteId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedNoteData);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Note updated successfully'); 
    });
    it('should return an error for unauthorized update attempt', async () => {
      const res = await request(app.getApp())
        .put(`/api/v1/notes/${createdNoteId}`)
        .send(updatedNoteData);

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message', 'Authorization token is required');
    });
  });

  describe('Archive/Unarchive Note', () => {
    it('should archive a note successfully', async () => {
      const res = await request(app.getApp())
        .put(`/api/v1/notes/${createdNoteId}/archive`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Note unarchived successfully'); 
    });
    it('should return an error for invalid note ID', async () => {
      const res = await request(app.getApp())
        .put('/api/v1/notes/invalidID/archive')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(500);
    });
  });

  describe('Trash/Restore Note', () => {
    it('should trash a note successfully', async () => {
      const res = await request(app.getApp())
        .put(`/api/v1/notes/${createdNoteId}/trash`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Note moved to trash successfully'); 
    });
    it('should return an error for invalid note ID', async () => {
      const res = await request(app.getApp())
        .put('/api/v1/notes/invalidID/trash')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(500);
    });
  });

  describe('Delete Note Forever', () => {
    it('should delete a note permanently', async () => {
      const res = await request(app.getApp())
        .delete(`/api/v1/notes/${createdNoteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Note deleted permanently'); 
    });
  });
  it('should return an error for unauthorized deletion', async () => {
      const res = await request(app.getApp())
        .delete(`/api/v1/notes/${createdNoteId}`);

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message', 'Authorization token is required');
    });
});