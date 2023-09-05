require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const app=express()
const mongoose= require("mongoose");
const bcrypt=require("bcrypt");
const saltRounds=12;




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

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

        const user= new User({
            email:req.body.username,
            password:hash
        });
        user.save().then(()=>{
            res.render("secrets")
        })
        .catch(err=>{
            console.log(err)
        })
    });

   

})

app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;

    User.findOne({email:username}).then(foundUser=>{
        if(foundUser){

            bcrypt.compare(password,foundUser.password, function(err, result) {
                if(result===true){
                    
                    res.render("secrets");
                }
                
            });
                
            
        }
    })
    .catch(err=>{
        console.log(err);
    })
})
































app.listen(3000,function(){
    console.log("sever started at port 3000");
})