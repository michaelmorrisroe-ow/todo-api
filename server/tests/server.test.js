const expect = require('expect');
const request = require('supertest');
const mocha = require('mocha'); // to make ts play nice
const {ObjectID} = require('mongodb')

const {app} = require('./../server');
const {Todo} = require('./../models/todo')

let testID = new ObjectID();
let wrongID = new ObjectID();
console.log(testID !== wrongID);

let testDos = [
  {_id: testID,
    text: 'first test todo'},
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

describe('GET /todos/:id', () => {
  it('should return a todo with a specific ID', done => {
    
    request(app)
    .get(`/todos/${testID}`)
    .expect(200)
    .expect(res => {
      expect(res.body.todo.text).toBe(testDos[0].text)
    })
    .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
    .get(`/todos/${wrongID}`)
    .expect(404)
    .end(done);
  });

  it('should return 404 for non-object IDs', done => {
    request(app)
    .get(`/todos/${wrongID + '1234'}`)
    .expect(404)
    .end(done);
  });
});