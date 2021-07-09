import mongoose from "mongoose";

async function connectToDb(url) {
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
export {connectToDb};
