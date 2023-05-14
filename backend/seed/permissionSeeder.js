import * as dotenv from 'dotenv'
import connectDB from '../config/db.js'
import mongoose from 'mongoose'

import Permission from '../model/Permission.js';
import Role from '../model/Role.js';
import Url from '../model/Url.js';

dotenv.config();  // Must be import dotenv and config db file
connectDB();
/*
    ||=> we can use both two line.
    mongoose.set('strictQuery', false);
    mongoose.connect('mongodb://root:example@mongo:27017/test?authSource=admin', { useNewUrlParser: true, useUnifiedTopology: true });
    ||=> we also can use this
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
*/

const permissions = [
    { url: new mongoose.Types.ObjectId('645f95ddbd7cc83cffa76a9f'), role: new mongoose.Types.ObjectId('645f97c9ac4cefc7496a198a') }
    // { url: new mongoose.Types.ObjectId('645f95ddbd7cc83cffa76aa0'), role: new mongoose.Types.ObjectId('645f97c9ac4cefc7496a198b') },
    // Add more permissions as needed
    ];
    const seedData = async () => {
        try {
        // Clear existing data
        await Permission.deleteMany();

        // Get the URL and Role references
        const urls = await Url.find();
        const roles = await Role.find();
        // console.log('Urls:', urls);
        // console.log('Roles:', roles);
        // Create the permission documents
        const permissionDocuments = permissions.map((permission) => {
            const url = urls.find((url) => url._id.equals(permission.url));
            const role = roles.find((role) => role._id.equals(permission.role));

            if (!url || !role) {
                console.error('Matching URL or role not found:', permission);
                return null;
            }

            return {
                url: url._id,
                role: role._id,
            };
        });

        // Insert the seed data
        await Permission.insertMany(permissionDocuments);

        console.log('Seed data inserted successfully');
        } catch (error) {
        console.error('Error seeding data:', error);
        }
    };
    seedData().then(() => {
        mongoose.connection.close();
    });
