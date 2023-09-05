require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose= require("mongoose");
const session=require("express-session");
const passport=require("passport");
const LocalStrategy = require('passport-local');
const passportLocalMongoose=require("passport-local-mongoose");

const app=express()
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    secret:"taylor swift is the best.",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
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
userSchema.plugin(passportLocalMongoose);
const User=new mongoose.model("User",userSchema);
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



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
app.get("/secrets",function(req,res){
    if(req.isAuthenticated()){
        res.render("secrets");
    }else{
        res.redirect("/login")
    }
})
app.get("/logout",function(req,res){
    req.logout(function() {
        res.redirect('/');
    });
})

///////////////////////////////////////////////////////POST REQUESTS//////////////////////////////////////////////////////////

app.post("/register",function(req,res){

   User.register({username:req.body.username},req.body.password,function(err,user){
    if(err){
        console.log(err);
        res.redirect("/register");
    }else{
        passport.authenticate("local")(req,res,function(){
            res.redirect("/secrets");
        })
    }
   });
   

})

app.post("/login",function(req,res){
  
    const user=new User({
        username:req.body.username,
        password:req.body.password
    });

    req.login(user,function(err){
        if(err){
            console.log(err)
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            })
        }
    })
})
































app.listen(3000,function(){
    console.log("sever started at port 3000");
})