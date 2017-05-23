const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('unable to connect to mongodb server')
    }
    console.log('Connected to MongoDB server');


    // delete many
    // db.collection('Todos')
    // .deleteMany({text: 'eat lunch'})
    // .then((res) => { console.log(res);}, err => console.log(err)
    // );

    // delete one
    // db.collection('Todos')
    // .deleteOne({text: 'Something to do'})
    // .then((res) => { console.log(res);}, err => console.log(err))

    // find one and delete
    let id = '';
    db.collection('Todos')
    .findOneAndDelete({completed: false})
    .then((res) => console.log(res));

    // db.close();
});