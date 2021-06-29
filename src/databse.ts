import mongoose from "mongoose";


async function connectToDb(url:string){
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
}
export default connectToDb;