//package imports
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
//importing routes
const personRoutes = require("./routes/person");
//calling express
const app = express();
//cors
app.use(
  cors({
    //add in origin every domain where api will be accessed
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

//bodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
multer;
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("profilePic")
);

//routes
app.use("/person", personRoutes);

// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   next();
// });

app.use(
  cors({
    allowedHeaders: "Authorization",
    origin: ["*"],
  })
);

mongoose
  .connect(
    "mongodb+srv://raghav:password1234@cluster0.zw0t1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
  .then(
    app.listen(4000, () => {
      "Server is live at Port 4000";
    })
  )
  .catch((err) => {
    console.log(err);
  });
