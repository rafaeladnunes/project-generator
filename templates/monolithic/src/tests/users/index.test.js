const app = require('../../config/express');
const request = require('supertest');
const { User } = require('../../models');

describe('Users endpoints', () => {
  it('Should create a new user', async () => {
    const body = {
      firstName: 'Nelson',
      lastName: 'Sinis',
      age: 23,
    };

    const response = await request(app).post('/users/').send(body);
    expect(response.status).toBe(200);
  });
});
