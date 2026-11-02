const express =require("express");
const router =express.Router();
const Feedback =require("../models/Feedback");

router.post("/",async(req,res) => {
  try {
    const { studentName, courseName,message,rating } = req.body;
    if (!studentName|| !courseName|| !message|rating ===undefined) {
      return res.status(400).json({error: "ALL Fields are mandatory"});
    }
    if (rating< 1||rating >5) {
      return res.status(400).json({error:"RATING SHOULD BE BETWEEN 1 AND 6"});
    }
    const feedback =await Feedback.create({
      studentName,
      courseName,
      message,
      rating
    });
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({error: err.message });
  }
});
router.get("/",async(req,res) => {
  try {
    const page =parseInt(req.query.page) ||1;
    const limit =parseInt(req.query.limit) ||10;
    const skip =(page -1) *limit;
    const total =await Feedback.countDocuments();
    const feedbacks =await Feedback.find().skip(skip).limit(limit);
    res.json({
      page,
      total,
      data:feedbacks
    });
  }catch(err){
    res.status(500).json({error:err.message});
  }
});
router.patch("/:id",async(req,res) => {
  try {
    const {status} =req.body;
    const feedback =await Feedback.findByIdAndUpdate(
      req.params.id,
      {status},
      { new:true, runValidators:true }
    );
    if (!feedback) {
      return res.status(404).json({error:"Feedback not found"});
    }
    res.json(feedback);
  }catch (err){
    res.status(500).json({error: err.message});
  }
});
module.exports = router;
