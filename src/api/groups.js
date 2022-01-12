const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()

const Group = require("../db/models/group")
// const User = require("../db/models/user")

router.get("/groups", (req, res, next) => {
	Group.find()
		.then((groups) => {
			return res.send({
				success: true,
				data: groups,
			})
		})
		.catch(next)
})

router.post("/groups", (req, res, next) => {
	if (!req.body.name || !req.body.permissions) {
		res.status(400)
		res.json({
			success: false,
			error: "Parameters missing",
		})
		return
	}
	Group.create({
		name: req.body.name,
		description: req.body.description,
		permissions: req.body.permissions.map((x) => mongoose.Types.ObjectId(x)),
		roles: req.body.roles
			? req.body.roles.map((x) => mongoose.Types.ObjectId(x))
			: [],
	})
		.then((group) => {
			return res.send({
				success: true,
				data: group,
			})
		})
		.catch(next)
})

router.delete("/groups/:id", (req, res, next) => {
	Group.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) })
		.then(() => {
			return res.send({
				success: true,
			})
		})
		.catch(next)
})

module.exports = router
