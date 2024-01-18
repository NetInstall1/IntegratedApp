const mongoose = require('mongoose')
const express = require('express')


const userSchema = mongoose.Schema({
    user_email: String,
    user_pass: String,
    last_login: {
        type: String,
        default: "Never",
    }
})

userSchema.methods.matchPassword = async(enteredPass)=>{
    if(this.user_pass == enteredPass){
        return true
    }
    return false
}



const User = mongoose.model('User', userSchema)
module.exports = User