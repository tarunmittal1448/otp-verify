require("dotenv").config();

const express = require('express');
const bodyParser = require('body-parser');
const sendMail = require("./controllers/mailing");
const generateOTP = require("./controllers/otp");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

app.use(bodyParser.json());

let otp;

app.post("/apii", (req, res) => {
    if (otp == req.body.otp) {
        console.log("success");
        res.send({ success: true });
    } else {
        console.log("failure");
        res.send({ success: false });
    }
});

app.post("/api", (req, res) => {
    otp = generateOTP();
    console.log(otp);
    const options = {
        from: process.env.USER,
        to: req.body.input,
        subject: "Thanks for registering",
        text: `Your OTP is ${otp}` 
    }
    sendMail(options, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
        } else {
            console.log("Email sent successfully");
            console.log("MESSAGE ID: ", info.messageId);
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});