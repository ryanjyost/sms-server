const mongoose = require("mongoose");
const URL = process.env.MlabUrl;

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

mongoose.connect(
    URL,
    { useNewUrlParser: true }
);
mongoose.Promise = global.Promise;