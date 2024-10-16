const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRETE = "withoutDatabase"
const app = express();
const users = [];
app.use(express.json());

function logger(req, res, next){
    console.log(`${req.method} this reques is send`);
    next();
    
}

app.get("/", function(req, res){
    res.sendFile(__dirname + "/public/index.html");
})

app.post("/signup",logger, function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    users.push({
        username : username,
        password : password
    })
    res.status(200).json({
        message : "Signup is successfully done"
    })
})

app.post("/signin",logger, function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    const user = users.find(User =>User.username === username && User.password === password);
    if(user){
        const token = jwt.sign({
            username
        }, JWT_SECRETE);
        res.json({
            token : token
        })
    }else{
        res.status(404).json({
            message : "Credentials are not currect"
        })
    }
})



function auth(req, res, next){
    const token = req.headers.token;
    const decodedData = jwt.verify(token,JWT_SECRETE);
    if(decodedData.username){
        req.username = decodedData.username;
        next();
    }else{
        res.json({
            message : "Unautharized"
        })
    }
}

app.get("/me",logger, auth, function(req, res){
    
        const user = users.find(User=>User.username === req.username);
        res.json({
            username : user.username,
            password : user.password
        })
    
})

app.listen(3000);