const jwt = require("jsonwebtoken")
const Token = require("../db/models/token")
// const User = require("../db/models/user")
const permissionsMap = require("./permissions-map")
const getAggregatePermissions = require("./getAggregatePermissions")

// function ValidateJWT(token) {}

// util
function methodConverter(method) {
	if (method === "GET") return "read"
	else if (method === "PUT" || method === "POST") return "write"
	else if (method === "DELETE") return "delete"
	else ""
}

/* eslint-disable no-unused-vars */
function Authz(req, res, next) {
	/* eslint-enable no-unused-vars */
	// Gather the jwt access token from the request header
	const authHeader = req.headers["authorization"]
	const token = authHeader ? authHeader.split(" ")[1] || authHeader : null
	// const token = authHeader && authHeader.split(" ")[1]
	// const token = authHeader
	if (token == null) {
		return next(new Error("Token missing"))
	}
	jwt.verify(token, process.env.PRIVATE_KEY, (err, tokenData) => {
		if (err) return next(new Error("Invalid token: " + err))
		req.tokenData = tokenData
		Token.findById(tokenData.id)
			.then(() => {
				// return next() // pass the execution off to whatever request the client intended

				// Check permissions
				let suffix = permissionsMap[req.originalUrl]
				console.log(suffix)
				if (typeof suffix === "undefined") {
					return next()
				} else if (suffix === "ignore") return next()
				let permissionRequired = `${methodConverter(req.method)}_${
					permissionsMap[req.originalUrl]
				}`
				getAggregatePermissions(tokenData.user)
					.then((permissions) => {
						if (permissions.indexOf(permissionRequired) === -1) {
							res.statusCode = 403
							return next(new Error("Access denied: "))
						} else {
							return next()
						}
					})
					.catch((err) => {
						console.error(err)
					})
			})
			.catch((err) => next(new Error("Token not found: " + err)))
	})
}

module.exports = {
	Authz,
}
