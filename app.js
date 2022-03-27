const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const emailId = req.body.email;

    const data = {
        members: [{
            email_address: emailId,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName,
            },
        }, ],
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us14.api.mailchimp.com/3.0/lists/9f800801cd";

    const options = {
        method: "POST",
        auth: "jyosthna:087db9be859b7ec4548c4fe34d6c38a3-us14",
    };

    const request = https.request(url, options, (response) => {
        response.on("data", (data) => {
            //console.log(JSON.parse(data))
            if (response.statusCode == 200) res.sendFile(__dirname + "/success.html");
            else res.sendFile(__dirname + "/failure.html");
        });
    });

    request.write(jsonData); //pass jsonData to mailchimp server
    request.end(); //Done with the request
});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, (req, res) => {
    console.log(`Server listening on port 3000`);
});


//9f800801cd - listid