const express = require("express")
const mongoose = require("mongoose")
const router = require("./router/index")
var cors = require("cors")
var cookieParser = require("cookie-parser")
const app = express()
var https = require("https")
var fs = require("fs")
require("dotenv").config()

// mongoClient.connect(function(err, client){
//   if(err) return console.log(err);
//   app.listen(8000, function(){
//       console.log("Сервер ожидает подключения...");
//   });
// });

// app.get("/api/users", function(req, res){

//   return res.send([1,2,3])
//   // const collection = req.app.locals.collection;
//   // collection.find({}).toArray(function(err, users){

//   //     if(err) return console.log(err);
//   //     res.send(users)
//   // });

// });
// to use req.body
// app.use(express.cookieParser());
app.use(cookieParser())
app.use(cors({ credentials: true, origin: process.env.AUTH_CLIENT_URL }))
app.use(express.json())
app.use("/api", router)

let httpsOptions = {}
if (process.env.AUTH_SSL_ENABLED) {
  httpsOptions = {
    key: fs.readFileSync(process.env.AUTH_CERTIFICATE_KEY_PATH),
    cert: fs.readFileSync(process.env.AUTH_CERTIFICATE_PEM_PATH),
  }
}

const server = https.createServer(httpsOptions, app).listen(5001, () => {
  console.log("server running at " + 5001)
})

const start = async () => {
  try {
    server()
    await mongoose.connect(process.env.AUTH_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    // app.listen(8000, () => console.log("started on ", 8000))
  } catch (e) {
    console.log(e)
  }
}

start()
