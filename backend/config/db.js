import mongoose from 'mongoose';
const connectDB = async () => {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
        .then(() => console.log('Connected!'))
        .catch(err => console.log(err));
}
export default connectDB