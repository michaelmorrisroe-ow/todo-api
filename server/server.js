let env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/ToDoApp'
} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/ToDoAppTest'
}

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

let {mongoose} = require('./db/mongoose.js');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');
let {ObjectID} = require('mongodb');

let app = express();
const port = process.env.PORT;
const db = process.env.MONGODB_URI;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, e => res.status(400).send(e))
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos})
    }, e => res.status(400).send(e));
});

app.get('/todos/:id', (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    }
    Todo.findById(id).then(todo => {
        if (!todo) {
            res.status(404).send();
        }
        res.send({todo});
    }).catch(e => res.status(404).send());
});

app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then(todo => {
        if (!todo) {
            res.status(404)
            .send('No Todo with matching ID')
        }
        res.status(200).send({todo});
    }).catch(e => {
        res.status(400).send()
    });
});

app.patch('/todos/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && (body.completed)) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, { $set: body}, {new: true})
    .then(todo => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch(e => {
        res.status(400).send();
    })
});

// POST /users
app.post('/users', (req, res) => {
    let input = _.pick(req.body, ['email', 'password']);
    let user = new User(input);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch(e => res.status(400).send(e));
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    console.log(`Active DB: ${db}`);
});

module.exports = {
    app
}