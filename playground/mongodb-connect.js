const {MongoClient, ObjectID} = require('mongodb');

let obj = new ObjectID();
console.log(obj);
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('unable to connect to mongodb server')
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos')
    // .find({_id: new ObjectID('592439d9473a7b0d6f8cab49')})
    // .toArray()
    // .then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, err => console.log('Fetch todos failed: ', err)
    // );

    db.collection('Todos').find().count().then(count => {
        console.log(`Todos Count: ${count}`
        )}, err => 'Unable to fetch todos:', err)

    db.collection('Users')
    .find({name: 'Jen'})
    .toArray()
    .then((peeps) => {
        console.log(JSON.stringify(peeps, undefined, 2));
    }, err => console.log('Error:', err))
    // db.close();
});