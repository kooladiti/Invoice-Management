const express=require("express");
const cors = require ('cors')
const indexrouter=require('./Router/index')
const app=express(); 
app.use(express.json())
app.use(cors())
app.use(express.static("public"));

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bishnoi.aditi6@gmail.com",
    pass: "uwgdrrwzwldvdrqo"
  }
});

app.post("/sendmail", async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    await transporter.sendMail({
      from: "yourmail@gmail.com",
      to,
      subject,
      text: message
    });

    res.json({ success: true, msg: "Email sent successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.use('/',indexrouter)

 app.listen(2000,(err)=>{
       if(err){
        console.log("Opsie wopsie! your code caught some error :( ")
       }
       console.log("Congrats, your code has been run successfully!")                  
}  
)

