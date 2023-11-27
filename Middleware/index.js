const filename=async(req,res,next)=>{
    req.app.locals={
        file:null,resetSession:false
    }
    next();
}
module.exports={filename};