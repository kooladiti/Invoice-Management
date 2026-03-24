const express=require("express")
const router=express.Router();

const st=require('../controller/student')

const ur=require('../Controller/User')

const tm=require('../Controller/Team')

const c=require('../Controller/Course')

const i=require('../Controller/Invoice')

router.get("/getstdata", st.getstudentdata);
router.post("/poststdata", st.poststudentdata);
router.put("/putstdata/:_id", st.putstudentdata);
router.delete("/deletestdata/:_id", st.deletestudentdata);

router.post("/searchuser",ur.searchuser)
router.post("/postuser",ur.postuser)
router.put("/putuser/:_id",ur.putuser)
router.delete("/deleteuser/:_id",ur.deleteuser)

router.get("/gettmdata", tm.getteamdata);
router.post("/posttmdata", tm.postteamdata);
router.put("/puttmdata/:_id", tm.putteamdata);
router.delete("/deletetmdata/:_id", tm.deleteteamdata);

router.get("/getcdata", c.getcoursedata);
router.post("/postcdata", c.postcoursedata);
router.put("/putcdata/:_id", c.putcoursedata);
router.delete("/deletecdata/:_id", c.deletecoursedata); 

router.get("/getinvoice",i.getinvoice)
router.post("/postinvoice",i.postinvoice)
router.put("/putinvoice/:_id",i.putinvoice)
router.delete("/deleteinvoice/:_id",i.deleteinvoice)

module.exports=router;