const express = require("express")
const router = express.Router();


//user
//Index
router.get("/user",(req,res)=>{
    res.send("This is user root")
})

//new
router.get("/user/new", (req,res)=>{
    res.send("This is user/new root")
})

//edit
router.get("/user/edit",(req,res)=>{
    res.send("This is user/edit root")
})

module.exports = router;