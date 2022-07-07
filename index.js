const express = require("express")
const mongoose = require("mongoose")
const router = require("./router/index")
var cors = require("cors")
var cookieParser = require("cookie-parser")
const app = express()
var http = require("http")
var https = require("https")
var fs = require("fs")
require("dotenv").config()

app.use(cookieParser())

const corsConfig = {
  origin: true,
  credentials: true,
}

// app.use(cors(corsConfig))
// app.options("*", cors(corsConfig))

app.use(
  cors({
    credentials: true,
    origin: "http://localhost",
  })
)
app.use(express.json())
app.use("/api", router)

if (process.env.AUTH_SSL_ENABLED === "true") {
  const httpsOptions = {
    key: fs.readFileSync(process.env.AUTH_CERTIFICATE_KEY_PATH),
    cert: fs.readFileSync(process.env.AUTH_CERTIFICATE_PEM_PATH),
  }
  https.createServer(httpsOptions, app).listen(5001, () => {
    console.log("server running at " + 5001)
  })
} else {
  http.createServer({}, app).listen(5001, () => {
    console.log("server running at ", 5001)
  })
}

const start = async () => {
  try {
    await mongoose.connect(process.env.AUTH_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    // app.listen(5001, () => console.log("started on ", 5001))
  } catch (e) {
    console.log(e)
  }
}

start()
