const { db } = require("../config/database");

function errorHandler(fn) {
	return async function (req, res, next) {
		try {
			const result = await fn(req, res);
			res.json(result);
		} catch (error) {
			next(error);
		}
	};
}

function withTransaction(fn) {
	return async function (req, res, next) {
		const transaction = await db.transaction();
		try {
			const result = await fn(req, res, transaction);
			await transaction.commit();
			res.json(result);
		} catch (error) {
			if (transaction) {
				await transaction.rollback();
			}
			next(error);
		}
	};
}

module.exports = { errorHandler, withTransaction };
