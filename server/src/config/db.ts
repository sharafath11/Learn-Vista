import mongoose from "mongoose"
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("db connected succesfully")
    } catch (error) {
        console.error(error)
    }
}
export default connectDb