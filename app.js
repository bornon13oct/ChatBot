var express    = require("express"),
    bodyParser = require("body-parser"),
    request    = require("request"),
    app        = express();
    
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get("/", function(req, res){
    res.send("HI I'm a chatbot");
});

let token = "EAAKSZBtrZArpUBALJj08ZBvBZCuTjP19Qk2SQECV8kRyBQuSCq33OImXCPLqF0AGCZBGw94TQcm1TARBxUZAuajVAy4wZAYBeMpg3QDnjJWmwKDSZAHATlRvENufuXfIyvzjOZC35glH1AZAjVWAV8Ob8NslxgZB9lvC8ae56M3iJZBVAwL2CnThCm1YBPLgtX9y2n8ZD";

app.get("/webhook/", function(req, res){
    if (req.query["hub.verify_token"] === "facebookChatbot"){
        res.send(req.query["hub.challenge"]);
    }
    res.send("Wrong token");
});

app.post("/webhook/", function(req, res){
    let messaging_events = req.body.entry[0].messaging;
    for (let i = 0; i < messaging_events.length; i++) {
        let event = messaging_events[i];
        let sender = event.sender.id;
        if (event.message && event.message.text) {
            // let text = event.message.text;
            let text ="i am"+123;
            sendText(sender, "Text echo: "+text.substring(0, 100));
        }
    }
    res.sendStatus(200);
});

function sendText(sender, text) {
    let messageData = {text: text};
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs : {access_token: token},
        method: "POST",
        json: {
            recipient: {id: sender},
            message: messageData
        }
    }, function(error, response, body){
       if (error) {
           console.log("sending error");
       } else if(response.body.error) {
           console.log("response body error");
       }
    });
}
    
app.listen(process.env.PORT, process.env.IP, function(){
console.log("server has started.");
});

