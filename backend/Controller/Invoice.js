const database=require('../Database/db')
// const {verifyToken}= require ('../Auth/auth-token')
const { ObjectId } = require("mongodb");


const getinvoice = async (req, res) => {
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
    const result = await db.collection("invoice").find({}).toArray();

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


const postinvoice=async(req,res) => {
    try{
//       const token= req.headers.authorization;
//  if (!token){
//    return res.status(400).json({
//     message:"Access to token denied"
    
//    })
//  }
 
// verifyToken(token);
        const db=await database.connectDB();
        const result = await db.collection("invoice").insertOne(req.body);
        if(result.acknowledged==true)
        {
        res.send({
            "status": 200,
             "message": req.body
        })
    }

    else{
            res.send({
            "status":400,
            "message":"post error try again"
        })
    }
}
    catch(err){
        res.send({
            "status":500,
            "message":"Something went wrong"+err
        })
    }
}

const putinvoice = async (req, res) => {
  try {
    // const token = req.headers.authorization;
    // if (!token) {
    //   return res.status(401).json({ message: "Access denied. Token missing" });
    // }

    // verifyToken(token);

    const db = await database.connectDB();

    const invoiceId = new ObjectId(req.params._id);

    const result = await db.collection("invoice").updateOne(
      { _id: invoiceId },
      { $set: req.body }
    );

    if (result.matchedCount > 0) {
      return res.json({
        status: 200,
        message: "Updated successfully"
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "invoice not found"
      });
    }

  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Update failed: " + err.message
    });
  }
};




const deleteinvoice = async (req, res) => {
try {
//   const token= req.headers.authorization;
//  if (!token){
//    return res.status(400).json({
//     message:"Access to token denied"
//    })
//  }
// verifyToken(token);
    const db = await database.connectDB();
const invoiceId = new ObjectId(req.params._id);
const result = await db.collection("invoice")
.deleteOne({ _id: invoiceId });

    if (result.deletedCount === 1) {
      res.send({
        status: 200,
        message: "Deleted permanently",
      });
    } else {
      res.status(404).send({
        status: 404,
        message: "invoice not found",
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


module.exports={getinvoice,postinvoice,putinvoice,deleteinvoice}