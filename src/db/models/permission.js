const mongoose = require("mongoose")

const PermissionSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
	},
	{
		timestamps: true,
		collection: "permissions",
		autoIndex: true,
	}
)

module.exports = mongoose.model("Permission", PermissionSchema)
