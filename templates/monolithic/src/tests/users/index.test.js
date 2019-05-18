const app = require('../../config/express');
const request = require('supertest');
const models = require('../../models');

describe('Users endpoints', () => {
  const user = {
    firstName: 'Nelson',
    lastName: 'Sinis',
    age: 23,
    active: true,
  };

  beforeAll(() => {
    return models.User.sync();
  });

  afterAll(() => models.sequelize.queryInterface.dropAllTables());

  it('Should create a new user', () => {
    return request(app).post('/users/').send(user).then(response => {
      expect(response.status).toBe(200);
    });
  });

  it('Should return an user', async () => {
    return request(app).get('/users/1').then(response => {
      delete response.body.createdAt;
      delete response.body.updatedAt;
      user.id = 1;
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual(user);
    });
  });

  it('Should update an user', async () => {
    const updatedUser = {
      ...user,
      age: 24,
      id: 1,
    };
    
    let response = await request(app).patch('/users/1').send(updatedUser);
    expect(response.status).toBe(200);
    
    response = await request(app).get('/users/1');
    delete response.body.createdAt;
    delete response.body.updatedAt;

    expect(response.body).toEqual(updatedUser);
  });

  it('Should delete an user', async () => {
    const response = await request(app).delete('/users/1');
    expect(response.status).toBe(200);
  });
});
