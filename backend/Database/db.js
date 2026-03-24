const { MongoClient } = require("mongodb");
//const uri = "mongodb://localhost:27017/"; //local mongodb
const uri = "mongodb+srv://aditi:admin123@cluster0.p2cffpn.mongodb.net/?appName=Cluster0"
const client = new MongoClient(uri);
async function connectDB() {
    try{
        await client.connect();
        console.log("Connected to MongoDB!");
        const db= client.db("softech"); //database name
        return db;
    }
    catch (err) {
        console.error(err);
    }
}

module.exports={ connectDB };