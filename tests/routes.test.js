const request = require('supertest')
const app = require('../app.js')
const mongoose = require('mongoose')
const databaseName = 'wishlistTestDatabase'
const User = require('../models/user')
const faker = require('faker')
const { after } = require("lodash");

beforeAll(async() => {
  const MONGODB_URI = `mongodb://127.0.0.1/${databaseName}`
  await mongoose.connect(MONGODB_URI, { 
 useUnifiedTopology: true, 
 useNewUrlParser: true })
  const users = [...Array(40)].map(user => (
    {
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      items: [
        {
          title: faker.lorem.sentence(),
          link: faker.internet.url()
        },
        { 
          title: faker.lorem.sentence(),
          link: faker.internet.url()
      },
        {
          title: faker.lorem.sentence(),
          link: faker.internet.url()
        }
      ]
    }
  ))
  await User.insertMany(users)
  console.log("Created many users")
})

describe("User API", () => {
  it("should show all users", async (done) => {
    const res = await request(app).get("/users");
    expect(res.statusCode).toEqual(200);
    expect(res.body[0]).toHaveProperty("_id");
    done();
  });
});

let user;

describe('Items API', () => {
  it('should show all users', async done => {
    const res = await request(app).get('/users')
    expect(res.statusCode).toEqual(200)
    expect(res.body[0]).toHaveProperty('_id')
    done()
  }),
    it('should create a new user', async done => {
      const res = await request(app).post('/users').send({
        first_name: 'test1',
        last_name: 'test1',
        email: 'test1@test1.com',
        items: [{
          title: 'Test Item 1',
          link: 'http://www.testing.com'
        },
        {
          title: 'Test Item 2',
          link: 'http://www.testing.com'
        }]
      }
      )
      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty('_id')
      user = res.body._id
      done()
    }),
    it('should show a user', async done => {
      const res = await request(app).get(`/users/${user}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('_id')
      done()
    }),
    it('should update a user', async done => {
      const res = await request(app).put(`/users/${user}`).send(
        {
          first_name: 'TEST1',
          last_name: 'TEST1',
          email: 'test1@test1.com',
          items: [{
              title: 'Test Item 001',
              link: 'http://www.testing.com'
          },
          {
              title: 'Test Item 002',
              link: 'http://www.testing.com'
          }]
      }
      )
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('_id')
      done()
    }),
    it('should delete a user', async done => {
      const res = await request(app).del(`/users/${user}`)
      expect(res.statusCode).toEqual(200)
      expect(res.text).toEqual("User deleted")
      done()
    })
})

afterAll(async () => {
  await mongoose.connection.close()
})