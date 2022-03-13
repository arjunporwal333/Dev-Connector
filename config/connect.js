const config = require("config");
const MongoURI = config.get("MongoURI");
const mongoose = require("mongoose");

const DbConnect = async () => {
    try {
        await mongoose.connect(process.env.MongoURI || MongoURI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        console.log("DB Connected");
    } catch (err) {
        console.log(err.message);

        // Exit Process with Failure
        process.exit(1);
    }
}

module.exports = DbConnect