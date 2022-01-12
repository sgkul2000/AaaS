const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()

const jwt = require("jsonwebtoken")
const Bcrypt = require("bcrypt")

const User = require("../db/models/user")
const Token = require("../db/models/token")

router.post("/users", (req, res, next) => {
	if (!req.body.email || !req.body.password) {
		res.status(400)
		res.json({
			success: false,
			error: "Parameters missing",
		})
		return
	}

	User.create({
		email: req.body.email,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		dob: req.body.dob,
		gender: req.body.gender,
		password: Bcrypt.hashSync(req.body.password, 8),
		phone: req.body.phone,
	})
		.then(async (user) => {
			const token = jwt.sign(
				{
					user: user._id,
					email: user.email,
					firstname: user.firstname,
					lastname: user.lastname,
				},
				process.env.PRIVATE_KEY,
				{
					expiresIn: 86400,
				}
			)
			await Token.create({
				token,
				user: mongoose.Types.ObjectId(user._id),
			})
			let userObj = JSON.parse(JSON.stringify(user))
			delete userObj["password"]
			res.json({
				success: true,
				token: token,
				user: userObj,
			})
		})
		.catch((err) => {
			next(new Error("User not created: " + err))
		})
	// res.status(201).send();
})

router.post("/tokens", (req, res, next) => {
	if (!req.body.email || !req.body.password) {
		return next(new Error("Missing parameters"))
	}

	User.findOne({
		email: req.body.email,
	})
		.then(async (user) => {
			if (!user) {
				return next(new Error("User does not exist"))
			} else {
				if (!Bcrypt.compareSync(req.body.password, user.password)) {
					return next("Incorrect password")
				} else {
					let tokenId = new mongoose.Types.ObjectId()
					const token = jwt.sign(
						{
							id: tokenId,
							user: user._id,
							email: user.email,
							firstname: user.firstname,
							lastname: user.lastname,
						},
						process.env.PRIVATE_KEY,
						{
							expiresIn: 86400,
						}
					)
					await Token.create({
						_id: tokenId,
						token,
						user: mongoose.Types.ObjectId(user._id),
					})
					let userObj = JSON.parse(JSON.stringify(user))
					delete userObj["password"]
					res.json({
						success: true,
						token: token,
						user: userObj,
					})
				}
			}
		})
		.catch((err) => {
			return next(new Error("Failed to find user: " + err))
		})
	// res.status(201).send();
})

router.delete("/tokens", (req, res, next) => {
	Token.findByIdAndRemove(req.tokenData.id)
		.then(() => {
			return res.send({
				success: true,
				message: "token destroyed",
			})
		})
		.catch((err) => next(err))
	return res.send({ success: true })
})

module.exports = router
