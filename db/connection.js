// import models
import mongoose from "mongoose";

export const connectDB = () => {
    mongoose.connect('mongodb://127.0.0.1:27017/jobSearchApp').then(() => {
        console.log("db connected successfully");
    }).catch((err) => {
        console.log("ield connect to db");
    })
}

