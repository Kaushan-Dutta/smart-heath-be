const mongoose=require('mongoose');
require('dotenv').config();

mongoose.connect('mongodb+srv://kaushandutta5:S1RJwo3U8miNIiTA@cluster0.ogou781.mongodb.net/?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("Successful connection....");
}).catch((err)=>{
    console.log(err);
})
