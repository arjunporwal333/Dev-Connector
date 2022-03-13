const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const DbConnect = require("./config/connect");
const path = require("path");

//Require Environment Variables
require("dotenv").config();

//Connect Database
DbConnect();

// For Getting JSON Data
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

//Routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/user", require("./routes/api/user"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

//Serve static assets if application is in production
if (process.env.NODE_ENV === "production") {
    //Set Static Folder
    app.use(express.static('client/build'))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}


//Server Starting
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started at port ${port}`)
})