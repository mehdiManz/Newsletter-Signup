//jshint esversion: 6

const express = require('express');
const bodyParser = require("body-parser");
const request = require("request");

const app = express("public");

app.use(express.static('public'));

// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  console.log(`New signup: ${firstName} ${lastName}, email: ${email}`);

  // Configure the request
  const options = {
    url: "https://us21.api.mailchimp.com/3.0/lists/6bfd686eb1/members",
    method: "POST",
    headers: {
      "Authorization": "apikey 9d637c8129211e0787671da3e9137527-us21",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    })
  };


  // Send the request to Mailchimp's API
  request(options, function(error, response, body) {
    if (error) {
      res.sendFile(__dirname + "/failure.html");
    } else {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    }
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port 3000');
});


