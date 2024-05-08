const cookieParser = require('cookie-parser')
const express=require('express')
const app=express()
const path=require('path')

const userModel=require('./models/user')

const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

app.set("view engine","ejs")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser())



app.get('/',function(req,res){
    res.render('index')
})

app.post('/create', function(req,res){
    let {username,email,password,age}=req.body;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async(err, hash) => {
            let createdUser=await userModel.create({
                username,
                email,
                password:hash,
                age
            })
        
                let token=jwt.sign({email},"secret");

                res.cookie('token',token)//sending the cookie to the frontend

            res.send(createdUser)
        });
    });
    


})


app.post('/login',function(req,res){

    let user=userModel.findOne({email: req.body.email});

    if(!user)return res.send('Something is wrong');//error handling

    bcrypt.compare(req.body.password,user.password,function(err,result){//comparing the plain password with the hash password stored in the databas
        if(result){
            let token=jwt.sign({email:user.email},"secret");

            res.cookie('token',token)//sending the cookie to the frontend

            res.send(' you can login')
        }

        else res.send('Fuck Off')
    })

})

app.listen(3000);