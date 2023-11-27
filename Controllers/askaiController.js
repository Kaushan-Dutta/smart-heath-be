const express=require('express');
const multer = require('multer');
const Middleware=require('../Middleware/index');

const { Configuration, OpenAIApi } = require("openai");
const router=express.Router();



require("dotenv").config();
router.use(express.static('uploads'));

const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
})
const openai = new OpenAIApi(configuration);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    req.app.locals.file=file.originalname;

    cb(null, file.originalname); 
  },
});

const upload = multer({ storage: storage });

const getResponse=async(prompt)=>{
    try{
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt:prompt,
            max_tokens: 1000,
            temperature: 0,
          });
          //console.log(response);
          const completion = response.data.choices[0].text;
          //console.log(completion);
          return completion
    }
    catch(err){
        console.log(err);
        throw new Error("Uh oh, no prompt was provided");
    }
}
router.post("/askdoubt", async (req, res) => {
    const prompt = req.body.prompt;
    console.log(prompt)
    try {
        
      if (prompt == null) {
        throw new Error("Uh oh, no prompt was provided");
      }
      
      return res.status(200).json({
        success: true,
        message: await getResponse(prompt),
      });
    } catch (error) {
      return console.log(error.message);
    }
});
router.post("/predict", async (req, res) => {
    const prompt = 'What can be the possible cause of the symtoms of '+req.body.prompt;
    console.log(prompt)
    try {
        
      if (prompt == null) {
        throw new Error("Uh oh, no prompt was provided");
      }
      
      return res.status(200).json({
        success: true,
        message: await getResponse(prompt),
      });
    } catch (error) {
      return console.log(error.message);
    }
});
router.post("/prescribe", Middleware.filename,upload.single('file'), async (req, res) => {
    //console.log("]]]]]]]]]]]]]]]]]",req.app.locals.file)
    try {
         const fs = require('fs');

         const filePath = `uploads/${req.app.locals.file}`; // Adjust the path to your file
        
        
          const data = fs.readFileSync(filePath, 'utf8');
          console.log('File contents:');
          //console.log(data);
          const prompt = ' Analyze the medical problem I am having. '+data;
          console.log(prompt);
    
      
      return res.status(200).json({
        success: true,
        message: await getResponse(prompt),
      });
    } catch (error) {
      return console.log(error.message);
    }
});

module.exports=router;