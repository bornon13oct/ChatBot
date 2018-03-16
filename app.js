var express    = require("express"),
    bodyParser = require("body-parser"),
    request    = require("request"),
    Twitter         = require('twitter'),
    app        = express();
    
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

var twit = new Twitter({
  consumer_key: '8WupYFgGq1sjztH6AN2jQdYDb',
  consumer_secret: 'f5MPa3lGFenoacyTGmPByH1zSpaV8kFilT69TFhwHVEwGNeskt',
  access_token_key: '753772479600955392-sWugKE5NZrUzg0SHShOytIzALXRozdK',
  access_token_secret: 'Gx5yhbZnDt2jUYVca8LvdcRPa0hCiuXNS6kcD7Ugue7Q9'
});

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
            let text = event.message.text;
    
            var handle = text;
            var start  = handle.indexOf("@");
            if (start != -1) {
                var post   = handle.indexOf(" ", start);
                if(post==-1)
                    post = handle.indexOf("?",start);
                var check  = handle.substring(start,post);
                handle     = check;
                if(handle.charAt(0)=='@')
                    handle = handle.substring(1);
                    var params = {screen_name: handle};
                    twit.get('users/lookup', params, function(error, users, response) {
                      if (!error) {
                        var followers = users[0].followers_count,
                            stats     = users[0].statuses_count;
                            var latestTweets = require('latest-tweets')
                            latestTweets(handle, function (err, tweets) {
                              var latest = tweets[0].content;
                              if(text.includes("followers")){
                                var infoSent = "The number of followers of @"+handle+" are ";
                                sendText(sender, infoSent+followers+"."+"\nDo you want to check anything else?");
                              }
                              else if(text.includes("tweets")){
                                var infoSent = "The number of tweets done by @"+handle+" are ";
                                sendText(sender, infoSent+stats+"."+"\nDo you want to check anything else?");
                              }
                              else if(text.includes("latest")){
                                var infoSent = "The latest tweet done by @"+handle+" is - \n";
                                sendText(sender, infoSent+latest+"\nDo you want to check anything else?");
                              }
                            });
                      }
                    }); 
            } else {
                if(text.includes("Hi")||text.includes("Hello"))
                    sendText(sender, "Hi");
                else if(text.includes("no")||text.includes("No"))
                    sendText(sender, "Thank You For using me.");
                else 
                    sendText(sender, "I do not understand.\n Try again.");
            }
            // if(handle.charAt(0)=='@')
            //     handle = handle.substring(1);
            // var params = {screen_name: handle};
            // twit.get('users/lookup', params, function(error, users, response) {
            //   if (!error) {
            //     var followers = users[0].followers_count,
            //         stats     = users[0].statuses_count;
            //         var latestTweets = require('latest-tweets')
            //         latestTweets(handle, function (err, tweets) {
            //           var latest = tweets[0].content;
            //           text = "followers- "+followers;
            //           sendText(sender, text);
            //           text = "tweets- "+stats;
            //           sendText(sender, text);
            //           text = "latest tweet- "+latest;
            //           sendText(sender, text);
            //         });
            //   }
            // });
            
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

