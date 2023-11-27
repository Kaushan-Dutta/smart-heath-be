const express=require('express');
const jwt = require('jsonwebtoken');

const {userModel,patientModel,doctorModel,adminModel}=require('../Model/index')

const router=express.Router();
const secret="My secret Key"

async function verifyToken(req,res,next){
    try{
        const token=req.headers.authorization?.split(' ')[1];
        //console.log(token);
        if(!token){
            return res.status(401).json({message:'Not authorized'})
        }
        const verifyToken=jwt.verify(token,secret);
        if(!verifyToken){
            return res.status(401).json({message:'Not authorized'})
        }
        req.token=verifyToken;
        //console.log(verifyToken);
        next();
        
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}
router.get('/user',verifyToken,async(req,res)=>{
    try{
        //console.log(req.token);
        const user=await userModel.findOne({email:req.token.email});
        if(!user){
            return res.status(403).json({message:'User not found'})
        }
        if(user.entity=='patient'){
            return res.status(200).json({message:await patientModel.findOne({userId:user._id}).populate('userId')})
        }
        if(user.entity=='doctor'){
            return res.status(200).json({message:await doctorModel.findOne({userId:user._id}).populate('userId')})
        }
        if(user.entity=='admin'){
            return res.status(200).json({message:await adminModel.findOne({userId:user._id}).populate('userId')})
        }
        return res.status(403).json({message:'User not found'})

    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
})    
router.post('/login',async(req,res)=>{
    try{
        const user=await userModel.findOne({email:req.body.email});
        if(!user){
            return res.status(403).json({message:'User not found'})
        }
        if(user.password!=req.body.password){
            return res.status(403).json({message:'Password incorrect'})
        }
        console.log(user)
        const token=jwt.sign({entity:user.entity,password:user.password,email:user.email},secret,{expiresIn:'24 hours'});

        if(user.entity=='patient'){
            return res.status(200).json({message:await patientModel.findOne({userId:user._id}).populate('userId'),token:token})
        }
        if(user.entity=='doctor'){
            return res.status(200).json({message:await doctorModel.findOne({userId:user._id}).populate('userId'),token:token})
        }
        if(user.entity=='admin'){
            return res.status(200).json({message:await adminModel.findOne({userId:user._id}).populate('userId'),token:token})
        }
        return res.status(403).json({message:'User not found'})

    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
})
router.post('/signup',async(req,res)=>{
    try{
        const user=new userModel({entity:'patient',password:req.body.password,email:req.body.email});
        await user.save();
        const createPatient=new patientModel({userId:user._id}) 
        await createPatient.save();
        return res.status(200).json({message:'User created'})
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
})
module.exports=router;