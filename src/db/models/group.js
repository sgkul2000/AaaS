const mongoose = require("mongoose")

const GroupSchema = new mongoose.Schema(
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
		roles: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "Role",
			},
		],
	},
	{
		timestamps: true,
		collection: "groups",
		autoIndex: true,
	}
)

module.exports = mongoose.model("Group", GroupSchema)
