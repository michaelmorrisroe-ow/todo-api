const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('unable to connect to mongodb server')
    }
    console.log('Connected to MongoDB server');

    db.collection('Users')
    .findOneAndUpdate({
        _id: new ObjectID('59243ae68028aa0df7294497')},
        { $set: {age: 57}},
        { returnOriginal: false}
        ).then((res) => console.log(res))

    db.collection('Users')
    .findOneAndUpdate({name: 'Jen'},
    { $inc: {age: 1}},
    {returnOriginal: true})
    .then(res => console.log(res))

    // db.close();
});