import mongoose from "mongoose";
export default async function connectDB (){
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Database connected successfully ✅`)
    }
    catch(error){
        console.error(`Database connection failed ❌`);
        console.log(error.message)
    }
}