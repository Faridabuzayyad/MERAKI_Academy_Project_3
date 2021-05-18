const mongoose = require("mongoose");

const options = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }

  
mongoose.connect("mongodb://localhost:27017/project_3_v01", options).
then(
    ()=>{console.log("Db connected");},
    (err)=>{console.log(err)}
);