const database = require('../Database/db');
const { generateToken, verifyToken } = require('../Auth/auth-token');


// LOGIN USER
const searchuser = async (req, res) => {
    try {
        const db = await database.connectDB();
        const { email, password } = req.body;

        const result = await db.collection("user").findOne({ email });

        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }

        if (result.password !== password) {
            return res.status(400).json({ message: "Wrong password" });
        }

        const token = generateToken({ email }, "7d");

        return res.status(200).json({
            message: "Login successful",
            token
        });

    } catch (err) {
        return res.status(500).json({
            message: "Login error: " + err.message
        });
    }
};



// INSERT USER (PROTECTED)
const postuser = async (req, res) => {
    try {

        const token = req.headers.authorization;
        if (!token) return res.status(401).json({ message: "Token missing" });

        verifyToken(token);

        const db = await database.connectDB();
        const result = await db.collection("user").insertOne(req.body);

        return res.status(200).json({
            message: "Record inserted",
            id: result.insertedId
        });

    } catch (err) {
        return res.status(403).json({
            message: "Insert failed: " + err.message
        });
    }
};



// UPDATE USER (PROTECTED)
const putuser = async (req, res) => {
    try {

        const token = req.headers.authorization;
        if (!token) return res.status(401).json({ message: "Token missing" });

        verifyToken(token);

        const db = await database.connectDB();
        const userId = parseInt(req.params.userId);

        const result = await db.collection("user").updateOne(
            { id: userId },
            { $set: req.body }
        );

        if (!result.matchedCount) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({ message: "Updated successfully" });

    } catch (err) {
        return res.status(500).json({
            message: "Update failed: " + err.message
        });
    }
};



// DELETE USER (PROTECTED)
const deleteuser = async (req, res) => {
    try {

        const token = req.headers.authorization;
        if (!token) return res.status(401).json({ message: "Token missing" });

        verifyToken(token);

        const db = await database.connectDB();
        const userId = parseInt(req.params.userId);

        const result = await db.collection("user").deleteOne({ id: userId });

        if (!result.deletedCount) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({ message: "Deleted permanently" });

    } catch (err) {
        return res.status(500).json({
            message: "Delete failed: " + err.message
        });
    }
};


module.exports = { searchuser, postuser, putuser, deleteuser };
