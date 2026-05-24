import mongoose from "mongoose";
async function connectDB(){
   try {
    const connectionInstance=await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB Connected");
   } catch (error) {
    console.log("DB error is: ",error);
    process.exit(1);
   }
}

export default connectDB