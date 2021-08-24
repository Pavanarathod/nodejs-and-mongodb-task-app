const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongo = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log(`MonogoDB Connected ${mongo.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

module.exports = connectDB;

// mongodb+srv://pavandas:PavaDas@1996@cluster0.hcjjl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
