const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
	{
		email: {
			unique: true,
			trim: true,
			type: String,
			required: true,
			validator: function (v) {
				return /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v)
			},
		},
		firstname: {
			type: String,
			required: true,
		},
		lastname: {
			type: String,
			required: true,
		},
		phone: {
			type: Number,
			required: true,
			trim: true,
			minlength: 10,
			maxlength: 10,
			unique: true,
		},
		dob: {
			type: Date,
			required: true,
		},
		gender: {
			type: String,
			required: true,
			enum: ["male", "female", "non binary", "others"],
		},
		password: {
			type: String,
			required: true,
		},
		permissions: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "Permission",
				required: true,
			},
		],
		roles: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "Role",
				required: true,
			},
		],
		groups: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "Group",
				required: true,
			},
		],
	},
	{
		timestamps: true,
		collection: "users",
		autoIndex: true,
	}
)

// UserSchema.plugin(notFound)

// UserSchema.path("email").validate(function (email) {
// 	var emailRegex = //
// 	return emailRegex.test(email) // Assuming email has a text attribute
// }, "The e-mail field cannot be empty.")

//UserSchema.method("transform", function () {
//	var obj = this.toObject()

//	//Rename fields
//	obj.id = obj._id
//	delete obj._id
//	delete obj.__v
//	delete obj.createdAt
//	delete obj.updatedAt

//	return obj
//})

module.exports = mongoose.model("User", UserSchema)
