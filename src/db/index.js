const mongoose = require("mongoose")
require("./models/permission")
require("./models/role")
require("./models/group")
require("./models/user")
require("./models/token")

async function InitDB() {
	if (!process.env.MONGO_URI) {
		console.error(new Error("MongoDB uri missing."))
		return
	}
	await mongoose.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
}

module.exports = InitDB
