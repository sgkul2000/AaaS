const express = require("express")
const morgan = require("morgan")
const helmet = require("helmet")
const cors = require("cors")
const BodyParser = require("body-parser")
const InitDB = require("./db/index")
const setPath = require("./middlewares/path")
const auth = require("./middlewares/auth")

// environment variables setup
require("dotenv").config()

// database setup
InitDB()

// middlewares and routers importss
const middlewares = require("./middlewares/index")
const api = require("./api/index")

// app init
const app = express()

// generic middlewares
app.use(setPath)
app.use(morgan("dev"))
app.use(helmet())
app.use(cors())
app.use(BodyParser.json())

// setting assets folder
app.use(express.static(`${__dirname}/assets`))

InitDB()

app.use("/v1/", api)

app.get("/", (req, res) => {
	res.json({
		message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
	})
})

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

module.exports = app
