const express=require('express');
const {userModel,patientModel,doctorModel,adminModel,doubtModel,appointmentModel}=require('../Model/index')

const router=express.Router();
router.get('/',async(req,res)=>{
    try{
        return res.status(200).json({message:"Welcome to smart health"})
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
})
router.get('/doctors',async(req,res)=>{
    try{
        return res.status(200).json({message:await doctorModel.find({}).populate('userId')})
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
})
router.post('/book-appoint',async(req,res)=>{
    try{
        console.log(req.body);
        const book=new appointmentModel({patientId:req.body.patientId,doctorCheck:req.body.doctorCheck,date:req.body.date});
        console.log(book)
        await book.save()
        return res.status(200).json({message:"Appointment Booked"});
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
})
router.get('/get-appoint',async(req,res)=>{
    try{
        return res.status(200).json({message:await appointmentModel.find({})})
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
})
router.post('/postdoubt',async(req,res)=>{
    const {comment,postedBy}=req.body;
    try{
        const post=new doubtModel({comment,postedBy})
        await post.save();
        return res.status(200).json({message:post})
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
})
router.get('/getdoubts',async(req,res)=>{
    try{
        return res.status(200).json({message:await doubtModel.find({})})
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
})
module.exports=router;