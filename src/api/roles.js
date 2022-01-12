const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()

const Role = require("../db/models/permission")
// const User = require("../db/models/user")

router.get("/roles", (req, res, next) => {
	Role.find()
		.then((roles) => {
			return res.send({
				success: true,
				data: roles,
			})
		})
		.catch(next)
})

router.post("/roles", (req, res, next) => {
	if (!req.body.name || !req.body.permissions) {
		res.status(400)
		res.json({
			success: false,
			error: "Parameters missing",
		})
		return
	}
	Role.create({
		name: req.body.name,
		description: req.body.description,
		permissions: req.body.permissions.map((x) => mongoose.Types.ObjectId(x)),
	})
		.then((role) => {
			return res.send({
				success: true,
				data: role,
			})
		})
		.catch(next)
})

router.delete("/roles/:id", (req, res, next) => {
	Role.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) })
		.then(() => {
			return res.send({
				success: true,
			})
		})
		.catch(next)
})

module.exports = router
