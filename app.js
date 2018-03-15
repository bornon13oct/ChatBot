var express    = require("express"),
    bodyParser = require("body-parser"),
    request    = require("request"),
    app        = express();
    
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get("/", function(req, res){
    res.send("HI I'm a chatbot");
});

app.get("/webhook/", function(req, res){
    if(req.query["hub.verify_token"] === "facebookChatbot"){
        res.send(req.query["hub.challenge"]);
    }
    res.send("Wrong token");
});
    
app.listen(process.env.PORT, process.env.IP, function(){
console.log("server has started.");
});

