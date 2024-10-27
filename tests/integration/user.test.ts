import app from '../../src/index'; // Ensure this points to the correct path of the exported app instance
import mongoose from 'mongoose';
import request from 'supertest';
import { expect } from 'chai';

const testDbUri = process.env.DATABASE_TEST || 'mongodb://localhost:27017/test_fundoo_notes';

describe('User Routes', () => {
  // Connect to test database before running tests
  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(testDbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  });

  // Disconnect after all tests
  after(async () => {
    await mongoose.disconnect();
  });

  const userData = {
    firstName: 'Preetham',
    lastName: 'B S',
    email: 'preethambstest@gmail.com',
    password: 'password123',
  };

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/v1/users/register')
        .send(userData);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message', 'User registered successfully');
    });

    it('should return an error if the user already exists', async () => {
      const res = await request(app)
        .post('/api/v1/users/register')
        .send(userData);

      expect(res.status).to.equal(409);
      expect(res.body).to.have.property('message', 'User already exists');
    });
  });

  describe('User Login', () => {
    it('should log in an existing user successfully', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({ email: userData.email, password: userData.password });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('token');
    });

    it('should return an error for invalid login credentials', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({ email: userData.email, password: 'wrongpassword' });

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message', 'Invalid email or password');
    });
  });

  describe('Password Reset Functionality', () => {
    it('should send a password reset link to the user', async () => {
      const res = await request(app)
        .post('/api/v1/users/forget-password')
        .send({ email: userData.email });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Password reset link sent');
    });

    it('should reset the user password', async () => {
      const token = 'valid-reset-token';
      const newPassword = 'newPassword123';

      const res = await request(app)
        .post('/api/v1/users/reset-password')
        .send({ token, newPassword });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Password reset successful');

      const loginRes = await request(app)
        .post('/api/v1/users/login')
        .send({ email: userData.email, password: newPassword });

      expect(loginRes.status).to.equal(200);
      expect(loginRes.body).to.have.property('token');
    });
  });
});
