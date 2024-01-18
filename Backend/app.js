const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const connectToDB = require('./config/db')
const socket = require("socket.io");
const { instrument } = require('@socket.io/admin-ui')

app.use(express.json())
app.use(cors())

//require models
require('./models/guest')
require('./models/user')
require('./models/agent')
//use routes
app.use(require('./routes/guest'))
// app.use(require('./routes/user'))
app.use(require('./routes/agent'))


const userRoute = require('./routes/user')
const agentRoute = require('./routes/agent')

app.use('/api/user', userRoute)
app.use('/api/agent', agentRoute)

const port = 5000 || process.env.PORT

//Database configuration
connectToDB(process.env.MONGO_URI)


const server = app.listen(port, () => {
    console.log(`Listening at port ${port}`)
})

//Socket IO 
const {getUserId} = require('./controllers/agentControllers')

const io = socket(server, {
  cors: {
    origin: '*',
  },
  credentials: true,

});
/*
 *[
  {room: [{agentid:"", socketid:""}]}
 ] 
 */
var room = []
  io.on("connection", (socket)=>{
    console.log(`A user connected...${socket.id}`)
    socket.emit(`${socket.id}`)
    
    //Agent connects to the server
    socket.on('agent-connect',async(data)=>{
      const {agent_id, socket_id} = data
      const user_id =  await getUserId(agent_id)
      console.log(`user id: ${user_id}`)
      socket.join(user_id)
      
      //Sending the agent that it has joined the room
      io.to(socket_id).emit('room-joined', {room_id: user_id})
      const roomExist = room.some((existingRoom)=>{
        if(Object.keys(existingRoom) == user_id){
          existingRoom[user_id].push({
            agent_id:agent_id,
            socket_id: socket_id
          })
          return true
        }
        return false
      })
      if(!roomExist){
        const setVal = {agent_id: agent_id, socket_id: socket_id}
        room.push({ [user_id] : [setVal]})
      }
      
      console.log(JSON.stringify(room))

    })
    socket.on('user-login',(user_id)=>{
      socket.join(user_id)
      console.log(`user joined room ${user_id}`)
    })

    socket.on('task',()=>{
      const {agent_list, room} = data
      // below is an expected code and not a correct one.
      if(agent_list.length == 0){
        io.to(room).emit('scan')
      } else {
        agent_list.forEach(agent => {
          agentSocketId = getSocketId(agent)
          io.to(agentSocketId).emit('scan')
        });
      }
    })
    socket.on('disconnect',()=>{
        console.log("A user disconnected")
    })
  })
  
instrument(io, {auth : false})
//