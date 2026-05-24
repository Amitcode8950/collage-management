import { Feather } from "lucide";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    fathername :{
        type : String,
        required : true
    },
    email : {
        type : String,
        unique : [true,"Email already exists!!"],
        lowercase : ["Email must be in lowercase"],
        trim : ["Email should be trimmed"],
        required : ["Email is required"],
        match : [/^[^\s@]+@[^\s@]+\.[^\s@]+$/,"Invalid email format"]
    },
    Rollno : {
        type : String,
        unique : [true,"Rollno already exists!!"],
        required : ["Rollno is required"]
    },
    gender : {
        type : String,
        enum : ['Male' , 'Female' , 'Other'],
        required : [true,"Gender is required"]
    },
    Branch : {
        type : String,
        required : [true,"Branch is required"]
    },
    
    password : {
        type : String,
        required : [true,"Password is required"]
    },
    phone : {
        type : String,
        required : [true,"Phone is required"],
        match : [/^[6-9][0-9]{9}$/,"Invalid phone number"]
    },
    image : {
        type : String,
        required : [true,"Image is required"]
    },
    isVerified : {
        type : Boolean,
        default : false
    }
    
},{timestamps : true})
const User = mongoose.model("User",userSchema);
export default User;