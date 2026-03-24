const database=require('../Database/db')
// const {verifyToken}= require ('../Auth/auth-token')
const { ObjectId } = require("mongodb");


const getcoursedata = async (req, res) => {
  try {

    // const token = req.headers.authorization;

    // if (!token) {
    //   return res.status(401).json({
    //     message: "Access denied. Token missing"
    //   });
    // }
    
    // // verify token
    // const decoded = verifyToken(token);

    const db = await database.connectDB();
    const result = await db.collection("course").find({}).toArray();

    return res.status(200).json({
      status: 200,
      data: result,
    //   user: decoded   // optional: shows token payload
    });

  } catch (err) {

    return res.status(401).json({
      status: 403,
      message: "Invalid or expired token",
      error: err.message
    });

  }
};


const postcoursedata = async (req, res) => {
  try {
    const db = await database.connectDB();

    // destructure properly
    const { courseName, name, duration, fee } = req.body;

    // fix for old frontend sending "name"
    const finalCourseName = courseName || name;

    if (!finalCourseName || !duration || !fee) {
      return res.status(400).json({
        status: 400,
        message: "All fields are required"
      });
    }

    const newCourse = {
      courseName: finalCourseName,
      duration: duration,
      fee: Number(fee)   // force number
    };

    const result = await db.collection("course").insertOne(newCourse);

    return res.status(200).json({
      status: 200,
      message: "Course added successfully",
      data: newCourse
    });

  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Something went wrong: " + err.message
    });
  }
};

const putcoursedata = async (req, res) => {
  try {
    const db = await database.connectDB();
    const courseId = new ObjectId(req.params._id);

    const { courseName, name, duration, fee } = req.body;

    const updatedData = {
      courseName: courseName || name,
      duration: duration,
      fee: Number(fee)
    };

    const result = await db.collection("course").updateOne(
      { _id: courseId },
      { $set: updatedData }
    );

    if (result.matchedCount > 0) {
      return res.json({
        status: 200,
        message: "Updated successfully"
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "Course not found"
      });
    }

  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Update failed: " + err.message
    });
  }
};



const deletecoursedata = async (req, res) => {
try {
//   const token= req.headers.authorization;
//  if (!token){
//    return res.status(400).json({
//     message:"Access to token denied"
//    })
//  }
// verifyToken(token);
    const db = await database.connectDB();
const courseId = new ObjectId(req.params._id);
const result = await db.collection("course")
.deleteOne({ _id: courseId });

    if (result.deletedCount === 1) {
      res.send({
        status: 200,
        message: "Deleted permanently",
      });
    } else {
      res.status(404).send({
        status: 404,
        message: "Course not found",
      });
    }
  }
  catch (err) {
    res.status(500).send({
      status: 500,
      message: "Delete failed: " + err,
    });
  }
};


module.exports={getcoursedata,postcoursedata,putcoursedata,deletecoursedata}