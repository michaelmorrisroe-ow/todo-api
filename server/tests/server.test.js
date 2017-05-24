const expect = require('expect');
const request = require('supertest');
const mocha = require('mocha'); // to make ts play nice

const {app} = require('./../server');
const {Todo} = require('./../models/todo')

let testDos = [
  {text: 'first test todo'},
  {text: 'second test todo'},
  {text: 'final test todo'}
  ];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    Todo.insertMany(testDos);
  })
  .then(() => done())
});

describe('POST /todos', () => {
  it('should create a new todo', done => {
    let text = 'Test todo text';

    request(app)  
      .post('/todos')
      .send({text})
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) { return done(err);}

        Todo.find({text})
        .then(todos => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        })
        .catch(e => done(e));
    });
  });

  it('should not create todo with invalid body data', done => {

    request(app)
    .post('/todos')
    .send()
    .expect(400)
    .end((err, res) => {
      if (err) { return done(err);}

      Todo.find()
      .then(todos => {
        expect(todos.length).toBe(3);
        done();
      })
    .catch(e => done(e));
    });
  });
});

describe('GET /todos', () => {
    it('should return all extant todos', done => {

      request(app)
      .get('/todos')
      .expect(200)
      .expect(res => {
        console.log(res.body.todos.length);
        expect(res.body.todos.length).toBe(3);
      })
      .end(done);
    });
  });