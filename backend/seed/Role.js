
import * as dotenv from 'dotenv'
import connectDB from '../config/db.js'
import mongoose from 'mongoose'
import Role from '../model/Role.js'

dotenv.config();  // Must be import dotenv and config db file
connectDB();
/*
    ||=> we can use both two line.
 mongoose.set('strictQuery', false);
 mongoose.connect('mongodb://root:example@mongo:27017/test?authSource=admin', { useNewUrlParser: true, useUnifiedTopology: true });
    ||=> we also can use this
 mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
*/
    const roles = [
    { name: 'Admin' },
    { name: 'Manager' },
    { name: 'Reader' },
    { name: 'Informer' },
    // Add more URLs as needed
    ];


const seedData = async () => {
    await Role.deleteMany({}, { maxTimeMS: 30000 });
    await Role.insertMany(roles);
    console.log('Seed data inserted successfully');
};

seedData().then(() => {
    mongoose.connection.close();
});
