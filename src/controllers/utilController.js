const { Lov } = require("../models");
const { errorHandler, withTransaction } = require("../util");
const { HttpError } = require("../error");

const getLov = errorHandler(async (req, res) => {
	const { category } = req.params;
	if (!category) throw new HttpError(400, "Error : Pilih Kategori");

	const lov_data = await Lov.findAll({
		where: {
			category: category,
		},
	});

	if (!lov_data[0]) throw new HttpError(400, "Data LoV tidak ditemukan");

	return { lov_data };
});

module.exports = { getLov };
