const mongoose = require('mongoose')
const colors = require("colors");

const connectToDB = async(uri)=>{
    try{
        const con = await mongoose.connect(uri)
        console.log(`Connected to MongoDB ${con.connection.host}`.cyan.underline)
    }catch(err){
        console.log(`Error connecting to MongoDB: ${err.message}`.red.bold)
    }
}

module.exports = connectToDB