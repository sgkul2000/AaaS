const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()

const Permission = require("../db/models/permission")
// const User = require("../db/models/user")

router.get("/permissions", (req, res, next) => {
	Permission.find()
		.then((permissions) => {
			return res.send({
				success: true,
				data: permissions,
			})
		})
		.catch(next)
})

router.post("/permissions", (req, res, next) => {
	if (!req.body.name) {
		res.status(400)
		res.json({
			success: false,
			error: "Parameters missing",
		})
		return
	}
	Permission.create({
		name: req.body.name,
		description: req.body.description,
	})
		.then((permission) => {
			return res.send({
				success: true,
				data: permission,
			})
		})
		.catch(next)
})

router.delete("/permissions/:id", (req, res, next) => {
	Permission.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) })
		.then(() => {
			return res.send({
				success: true,
			})
		})
		.catch(next)
})

module.exports = router
