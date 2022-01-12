const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
require("../db/models/permission")
require("../db/models/role")
require("../db/models/group")
require("../db/models/user")
require("../db/models/token")

const User = require("../db/models/user")

router.get("/users", (req, res, next) => {
	User.find()
		.populate("permissions")
		.populate("roles")
		.populate("groups")
		.then((users) => {
			return res.send({
				success: true,
				data: users,
			})
		})
		.catch(next)
})

router.delete("/user/:id", (req, res, next) => {
	User.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) })
		.then(() => {
			return res.send({
				success: true,
			})
		})
		.catch(next)
})

module.exports = router
