const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

const mailchimp = require("@mailchimp/mailchimp_marketing");
app.use(bodyParser.urlencoded({extended: true}))
//app.use(express.static("public"));
app.use(express.static(__dirname + "/public/"));
mailchimp.setConfig({
  //*****************************ENTER YOUR API KEY HERE******************************
  apiKey: "8f02d30794fe1ece3aec6470af2ce2e3-us1",
  //*****************************ENTER YOUR API KEY PREFIX HERE i.e.THE SERVER******************************
  server: "us1"
});


app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const listId = "b21c02fd94";

console.log(firstName);
console.log(lastName);
console.log(email);
console.log(listId);

const subscribingUser = {
 firstName: firstName,
 lastName: lastName,
 email: email
};

  async function run() {
     try {
          const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
              FNAME: subscribingUser.firstName,
              LNAME: subscribingUser.lastName
            }
          });

          res.sendFile(__dirname + "/success.html");
    } catch (e) {
         res.sendFile(__dirname + "/failure.html");
      }

}
  run();

});

app.post("/failure", function(req, res) {
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () {

});
