const User = require("../db/models/user")
const mongoose = require("mongoose")

function getAggregatePermissions(userId) {
	return new Promise((resolve, reject) => {
		User.aggregate([
			{ $match: { _id: mongoose.Types.ObjectId(userId) } },
			{
				$lookup: {
					from: "groups",
					localField: "groups",
					foreignField: "_id",
					as: "groupObjs",
				},
			},
			{ $unwind: { path: "$groupObjs", preserveNullAndEmptyArrays: true } },
			{
				$addFields: {
					roles: {
						$concatArrays: [
							{ $ifNull: ["$roles", []] },
							{ $ifNull: ["$groupObjs.roles", []] },
						],
					},
				},
			},
			{
				$addFields: {
					permissions: {
						$concatArrays: [
							{ $ifNull: ["$permissions", []] },
							{ $ifNull: ["$groupObjs.permissions", []] },
						],
					},
				},
			},
			{
				$lookup: {
					from: "roles",
					localField: "roles",
					foreignField: "_id",
					as: "roleObjs",
				},
			},
			{ $unwind: { path: "$roleObjs", preserveNullAndEmptyArrays: true } },
			{
				$addFields: {
					permissions: {
						$concatArrays: [
							{ $ifNull: ["$permissions", []] },
							{ $ifNull: ["$roleObjs.permissions", []] },
						],
					},
				},
			},
			{ $unwind: { path: "$permissions", preserveNullAndEmptyArrays: true } },
			{ $group: { _id: "$_id", permissions: { $addToSet: "$permissions" } } },
			{
				$lookup: {
					from: "permissions",
					localField: "permissions",
					foreignField: "_id",
					as: "permissionObjs",
				},
			},
			{ $project: { "permissionObjs.name": 1 } },
			{ $unwind: "$permissionObjs" },
			{ $group: { _id: "$permissionObjs.name" } },
		])
			.then((docs) => {
				resolve(docs.map((x) => x._id))
			})
			.catch((err) => {
				reject(err)
			})
	})
}

module.exports = getAggregatePermissions
