const express = require('express')
require('dotenv').config();
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const path = require('path');


app.use(bodyParser.json())
app.use(cors())


// JWT Secret Key
app.set('jwtSecretKey', process.env.JWT_SECRET);


//require models
require('./models/guest')
require('./models/user')
require('./models/agent')
require('./models/upload')
//use routes
app.use(require('./routes/guest'))
app.use(require('./routes/user'))
app.use(require('./routes/agent'))
app.use(require('./routes/upload'))

const fs = require('fs');
const uploadPath = path.join(__dirname, 'uploads');

const port = 5000 || process.env.PORT

//Database configuration
mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.9.1/netinstall', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

let isMongoDBConnected = false;

mongoose.connection.on("connected", () => {
    if (!isMongoDBConnected) {
        console.log("MongoDB connection successful");
        isMongoDBConnected = true;
    }
});

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const server = app.listen(port, () => {
    console.log(`Listening at port ${port}`)
});
