const expect = require('expect');
const request = require('supertest');
const mocha = require('mocha'); // to make ts play nice
const {ObjectID} = require('mongodb')

const {app} = require('./../server');
const {Todo} = require('./../models/todo')

let testID = new ObjectID();
let secondTestID = new ObjectID();
let wrongID = new ObjectID();

const testDos = [
  {_id: testID,
    text: 'first test todo'},
  {_id: secondTestID, text: 'second test todo',
  completed: true, completedAt:333},
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


describe('DELETE todos/:id', () => {
  it('should remove a todo with a given id', done => {

    request(app)
    .delete(`/todos/${testID}`)
    .expect(200)
    .expect(res => {
      expect(res.body.todo._id).toBe(testID.toHexString());
    })
    .end((err,res) => {
      if (err) {
        return done(err);
      }

      // query database using find by ID
      Todo.findById(testID)
      .then(todo => {
      expect(todo).toNotExist();
      done();
      });
    });
  });

  it('should return 404 if todo not found', done => {
    request(app)
    .delete(`/todos/${wrongID}`)
    .expect(404)
    .end(done);
  });

  it('should return 404 if ObjectId not valid', done => {
    request(app)
    .get(`/todos/${wrongID + '1234'}`)
    .expect(404)
    .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', done => {
    // grab id of first item
    // update text, set completed: true
    // 200
    // text is changed, completed: true, compAt: number

    let id = testDos[0]._id;
    let text = 'This is the test text';

    request(app)
    .patch(`/todos/${id}`)
    .send({text, completed: true})
    .expect(200)
    .expect(res => {
      expect(res.body.todo._id).toBe(id.toHexString());
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.completedAt).toBeA('number');
    })
    .end(done);
  });

  it('should clear completedAt when todo is not completed', done => {
    //grab id of second todo item
    // update text, set completed: false
    // 200
    // text changes, completed: false, compAt: null

    let id = testDos[1]._id;
    let text = 'no completion';

    request(app)
    .patch(`/todos/${id}`)
    .send({text, completed: false})
    .expect(200)
    .expect(res => {
      expect(res.body.todo._id).toBe(id.toHexString());
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toNotExist();
    })
    .end(done);
  });
})