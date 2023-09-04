const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const app=express()
const mongoose= require("mongoose");
const encrypt=require("mongoose-encryption");
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

//////////////////////////////////////////////////DATABASE CODE///////////////////////////////////////////////////////
mongoose.connect('mongodb://localhost/userDB',{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    family:4
})
.then(db => console.log('DB is connected'))
.catch(err => console.log(err));

const userSchema=mongoose.Schema({
    email:String,
    password:String
});

const secret="Thisisourlittlesecret."
userSchema.plugin(encrypt,
    {   
        secret:secret,
        encryptedFields:["password"]
    });

const User=new mongoose.model("User",userSchema);


///////////////////////////////////////////////////GET REQUESTS//////////////////////////////////////////////////////////
app.get("/",function(req,res){
    res.render("home");
})
app.get("/login",function(req,res){
    res.render("login");
})
app.get("/register",function(req,res){
    res.render("register");
})

///////////////////////////////////////////////////////POST REQUESTS//////////////////////////////////////////////////////////

app.post("/register",function(req,res){
    const user= new User({
        email:req.body.username,
        password:req.body.password
    });
    user.save().then(()=>{
        res.render("secrets")
    })
    .catch(err=>{
        console.log(err)
    })

})

app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;

    User.findOne({email:username}).then(foundUser=>{
        if(foundUser){
            if(foundUser.password===password){
                res.render("secrets");
            }
        }
    })
    .catch(err=>{
        console.log(err);
    })
})
































app.listen(3000,function(){
    console.log("sever started at port 3000");
})