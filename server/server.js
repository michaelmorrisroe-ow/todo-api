let express = require('express');
let bodyParser = require('body-parser');

let {mongoose} = require('./db/mongoose.js');
let {User} = require('./models/user')
let {Todo} = require('./models/todo')
let {ObjectID} = require('mongodb');

let app = express();
const port = process.env.PORT || 3000;

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
        res.send({
            todos})
    }, e => res.status(400).send(e));
});

// GET /todos/1234234
app.get('/todos/:id', (req, res) => {
    let id = req.params.id;

    // valid id
        // 404 - send back empty send
    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    }
    Todo.findById(id).then(todo => {
        if (!todo) {
            res.status(404).send();
        }
        res.send({todo});
    }).catch(e => res.status(404).send());

    

    // find byid
        // success
            // if todo - send back
            // if no todo - send back 404 w/empty body
        // error
            // 400 - send empty body back
    
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

module.exports = {
    app
}