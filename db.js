const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://Chakshika:@-Qkp9ecqvT8ZSA@cluster.mongodb.net/travel-planner"

let db;

async function connectToDatabase() {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        db = client.db('travel-planner');
        console.log('Connected to MongoDB');
        return db;
    } catch (error) {
        console.error('Database connection error:', error);
    }
}

module.exports = { connectToDatabase, getDb: () => db };