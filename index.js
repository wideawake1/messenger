const express=require("express");
const app=express();
const dotenv=require("dotenv");
const mongoose=require("mongoose");
const helmet=require("helmet");
const morgan=require("morgan");
const userRoute=require("./routes/users");
const authRoute=require("./routes/auth");
const postRoute=require("./routes/posts");
const conversationRoute=require("./routes/conversations");
const messageRoute=require("./routes/messages");
const cors=require('cors')
const multer=require("multer")
const path=require("path")

dotenv.config();


mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true},()=>{
    console.log("connected to MongoDB!")
});

//middleware 
//var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use("/images",express.static(path.join(__dirname,"public/images")))
app.use(express.json());
app.use(helmet());
app.use(morgan("common"))
app.use(cors({
    origin: 'https://stole-oyster.cyclic.app/',
}))

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public/images")
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }

})
const upload=multer({storage:storage})
app.post("/api/upload",upload.single("file"),(req,res)=>{
    try {
        return res.status(200).json("File uploaded")
        
    } catch (err) {
        console.log(err)
        
    }

})

app.use(express.static(path.join(__dirname,'./client/build')))
app.get("*",function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'))
})


app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/posts",postRoute);
app.use("/api/messages",messageRoute);
app.use("/api/conversations",conversationRoute);


app.listen(8800,()=>{
    console.log("backend server is running!");
});