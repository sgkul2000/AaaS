const mongoose = require("mongoose")

const RoleSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		permissions: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "permission",
				required: true,
			},
		],
	},
	{
		timestamps: true,
		collection: "roles",
		autoIndex: true,
	}
)

module.exports = mongoose.model("Role", RoleSchema)
