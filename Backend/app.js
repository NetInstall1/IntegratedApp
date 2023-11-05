const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const socket = require("socket.io");

app.use(bodyParser.json())
app.use(cors())

//require models
require('./models/guest')
require('./models/user')
require('./models/agent')
//use routes
app.use(require('./routes/guest'))
app.use(require('./routes/user'))
app.use(require('./routes/agent'))


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

const server = app.listen(port, () => {
    console.log(`Listening at port ${port}`)
})

// const io = socket(server, {
//     cors: {
//       origin: "http://localhost:3000",
//       credentials: true,
//     },
//   });

//   io.on("connection", (socket)=>{
//     console.log("A user connected...")

//     socket.on('host-updated',()=>{
//         io.emit('host-updated')
//     })
    
//     socket.on('disconnect',()=>{
//         console.log("A user disconnected")
//     })
//   })
  