import * as supertest from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import * as assert from 'assert';

describe('TranslationController', () => {
  let app: INestApplication;
  let user;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    user = {
      nombre: 'Michael',
      apellido: 'Salazar',
      email: 'michael@gmail.com',
      password: 'testPassMike',
    };
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Test User CRUD', () => {
    it('Should create correct user', async () => {
      const {
        body: { statusCode, data },
      } = await supertest(app.getHttpServer()).post('/user').send(user);

      assert.equal(statusCode, 201);
      assert.equal(data.nombre, user.nombre, 'Expected equals names');
    });

    it('Should update correct user', async () => {
      const {
        body: { statusCode, data },
      } = await supertest(app.getHttpServer()).post('/user').send(user);

      assert.equal(statusCode, 201);
      assert.equal(data.nombre, user.nombre, 'Expected equals names');

      user.nombre = 'Sebastian';
      user.apellido = 'Boada';

      const {
        body: { statusCode: statusUpdate, data: dataUpdate },
      } = await supertest(app.getHttpServer()).put('/user').send(user);

      assert.equal(statusUpdate, 200);
      assert.equal(dataUpdate.nombre, user.nombre, 'Expected equals names');
      assert.equal(
        dataUpdate.apellido,
        user.apellido,
        'Expected equals last names',
      );
    });

    it('Should get all users', async () => {
      const {
        body: { statusCode, data },
      } = await supertest(app.getHttpServer()).post('/user').send(user);

      assert.equal(statusCode, 201);
      assert.equal(data.nombre, user.nombre, 'Expected equals names');

      const {
        body: { statusCode: statusGet, data: users },
      } = await supertest(app.getHttpServer()).get('/user/all').send();

      assert.equal(statusGet, 200);
      assert.equal(users[0].nombre, user.nombre, 'Expected equals names');
      assert.equal(
        users[0].apellido,
        user.apellido,
        'Expected equals last names',
      );
    });

    it('Should get user by email', async () => {
      const {
        body: { statusCode, data },
      } = await supertest(app.getHttpServer()).post('/user').send(user);

      assert.equal(statusCode, 201);
      assert.equal(data.nombre, user.nombre, 'Expected equals names');

      const {
        body: { statusCode: statusGet, data: userData },
      } = await supertest(app.getHttpServer())
        .get('/user/email')
        .query({ email: 'michael@gmail.com' })
        .send();

      assert.equal(statusGet, 200);
      assert.equal(userData.nombre, user.nombre, 'Expected equals names');
      assert.equal(
        userData.apellido,
        user.apellido,
        'Expected equals lastnames',
      );
    });

    it('Should save user when already exists', async () => {
      const {
        body: { statusCode, data },
      } = await supertest(app.getHttpServer()).post('/user').send(user);

      assert.equal(statusCode, 201);
      assert.equal(data.nombre, user.nombre, 'Expected equals names');

      const {
        body: { statusCode: statusSave, message },
      } = await supertest(app.getHttpServer()).post('/user').send(user);

      assert.equal(statusSave, 409);
      assert.equal(
        message,
        'Error saving user, the user already exists',
        'Expected equals messages',
      );
    });

    it('Should update user without email', async () => {
      const {
        body: { statusCode, data },
      } = await supertest(app.getHttpServer()).post('/user').send(user);

      assert.equal(statusCode, 201);
      assert.equal(data.nombre, user.nombre, 'Expected equals names');

      user.nombre = 'Sebastian';
      user.apellido = 'Boada';
      delete user.email;

      const {
        body: { statusCode: statusUpdate, message },
      } = await supertest(app.getHttpServer()).put('/user').send(user);

      assert.equal(statusUpdate, 409);
      assert.equal(
        message,
        'Error updating user',
        'Expected equals error message',
      );
    });

    it('Should get user by email when not exists', async () => {
      const {
        body: { statusCode: statusGet, message },
      } = await supertest(app.getHttpServer())
        .get('/user/email')
        .query({ email: 'michael@gmail.com' })
        .send();

      assert.equal(statusGet, 409);
      assert.equal(
        message,
        'Error getting user, the user does not exists',
        'Expected equals error message',
      );
    });

    it('Should delete correct user', async () => {
      const {
        body: { statusCode, data },
      } = await supertest(app.getHttpServer()).post('/user').send(user);

      assert.equal(statusCode, 201);
      assert.equal(data.nombre, user.nombre, 'Expected equals names');

      const {
        body: { statusCode: statusGet, data: userData },
      } = await supertest(app.getHttpServer())
        .get('/user/email')
        .query({ email: 'michael@gmail.com' })
        .send();

      assert.equal(statusGet, 200);
      assert.equal(userData.nombre, user.nombre, 'Expected equals names');
      assert.equal(
        userData.apellido,
        user.apellido,
        'Expected equals lastnames',
      );

      const {
        body: { statusCode: statusDelete },
      } = await supertest(app.getHttpServer())
        .delete('/user')
        .query({ email: 'michael@gmail.com' })
        .send();

      assert.equal(statusDelete, 200);

      const {
        body: { statusCode: statusGetAll, data: users },
      } = await supertest(app.getHttpServer()).get('/user/all').send();

      assert.equal(statusGetAll, 200);
      assert.equal(users.length, 0, 'Expected empty array');
    });
  });
});
