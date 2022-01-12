module.exports = function notFound(schema) {
	schema.post("findOne", function (res, next) {
		if (!res) {
			return next(new Error("Not found!"))
		}
		return next()
	})
}
