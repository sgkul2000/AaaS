const mongoose = require("mongoose")

const TokenSchema = new mongoose.Schema(
	{
		token: {
			unique: true,
			trim: true,
			type: String,
			required: true,
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "user",
			required: true,
		},
	},
	{
		timestamps: true,
		collection: "tokens",
		autoIndex: true,
	}
)

module.exports = mongoose.model("Token", TokenSchema)
