const express = require("express")

const auth = require("./auth")
const users = require("./users")
const permission = require("./permissions")
const role = require("./roles")
const group = require("./groups")
const authMiddleware = require("../middlewares/auth")

const router = express.Router()

router.use(authMiddleware.Authz)

router.use("/", auth)
router.use("/", users)
router.use("/", permission)
router.use("/", role)
router.use("/", group)

router.get("/", (req, res) => {
	res.json({
		message: "API - 👋🌎🌍🌏",
	})
})

module.exports = router
