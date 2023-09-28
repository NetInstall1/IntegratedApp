const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()

app.use(bodyParser.json())
app.use(cors())

//require models
require('./models/host')

//use routes
app.use(require('./routes/host'))

const port = 5000 || process.env.PORT

//Database configuration
mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.9.1/netinstall', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
let isMongoDBConnected = false;
mongoose.connection.on("connected", () => {
    if (!isMongoDBConnected) {
        console.log("MongoDB connection successfull");
        isMongoDBConnected = true;
    }
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`)
})