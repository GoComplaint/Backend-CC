const jwt = require("jsonwebtoken");
const { User, RefreshToken } = require("../models");
const bcrypt = require("bcrypt");
const { errorHandler, withTransaction } = require("../util");
const { HttpError } = require("../error");

const register = withTransaction(async (req, res, transaction) => {
	const { username, email, password, confPassword } = req.body;
	if (password !== confPassword)
		throw new HttpError(400, "Password and Confirmation Password is not equal");

	// Email Validation
	const findEmail = await User.findOne({
		where: {
			email: email,
		},
	});
	if (findEmail.length !== null) throw new HttpError(400, "Email already registered");

	const salt = await bcrypt.genSalt();
	const hashPassword = await bcrypt.hash(password, salt);

	const userDoc = await User.create(
		{
			username: username,
			email: email,
			password: hashPassword,
		},
		{ transaction }
	);

	const refreshTokenDoc = await RefreshToken.create(
		{
			user_id: userDoc.id,
		},
		{ transaction }
	);

	const refreshToken = createRefreshToken(userDoc.id, refreshTokenDoc.id);
	const accessToken = createAccessToken(userDoc.id);

	return {
		id: userDoc.id,
		accessToken,
		refreshToken,
	};
});

const login = withTransaction(async (req, res, transaction) => {
	const { email, password } = req.body;
	const userDoc = await User.findOne({
		where: {
			email: email,
		},
	});

	if (!userDoc) throw new HttpError(401, "Email not found");

	await verifyPassword(userDoc.password, password);

	const refreshTokenDoc = await RefreshToken.create(
		{
			user_id: userDoc.id,
		},
		{ transaction }
	);

	const refreshToken = createRefreshToken(userDoc.id, refreshTokenDoc.id);
	const accessToken = createAccessToken(userDoc.id);

	return {
		id: userDoc.id,
		accessToken,
		refreshToken,
	};
});

const newRefreshToken = withTransaction(async (req, res, transaction) => {
	const currentRefreshToken = await validateRefreshToken(req.body.refreshToken);

	await RefreshToken.destroy(
		{
			where: {
				id: currentRefreshToken.tokenId,
			},
		},
		{ transaction }
	);

	const refreshTokenDoc = await RefreshToken.create(
		{
			user_id: currentRefreshToken.userId,
		},
		{ transaction }
	);

	const refreshToken = createRefreshToken(
		currentRefreshToken.userId,
		refreshTokenDoc.id
	);
	const accessToken = createAccessToken(currentRefreshToken.userId);

	return {
		id: currentRefreshToken.userId,
		accessToken,
		refreshToken,
	};
});

const newAccessToken = errorHandler(async (req, res) => {
	const refreshToken = await validateRefreshToken(req.body.refreshToken);
	const accessToken = createAccessToken(refreshToken.userId);

	return {
		id: refreshToken.userId,
		accessToken,
		refreshToken: req.body.refreshToken,
	};
});

const logout = errorHandler(async (req, res) => {
	const refreshToken = await validateRefreshToken(req.body.refreshToken);

	await RefreshToken.destroy({
		where: {
			id: refreshToken.tokenId,
		},
	});

	return { success: true };
});

const logoutAll = errorHandler(async (req, res) => {
	const refreshToken = await validateRefreshToken(req.body.refreshToken);

	await RefreshToken.destroy({
		where: {
			user_id: refreshToken.userId,
		},
	});

	return { success: true };
});

function createAccessToken(userId) {
	return jwt.sign(
		{
			userId: userId,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: "30d",
		}
	);
}

function createRefreshToken(userId, refreshTokenId) {
	return jwt.sign(
		{
			userId: userId,
			tokenId: refreshTokenId,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: "30d",
		}
	);
}

const verifyPassword = async (hashPassword, rawPassword) => {
	const match = await bcrypt.compare(rawPassword, hashPassword);
	if (!match) throw new HttpError(401, "Wrong Password");
};

const validateRefreshToken = (token) => {
	const decodeToken = () => {
		try {
			return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
		} catch (error) {
			throw new HttpError(401, "Unauthorized");
		}
	};

	const decodedToken = decodeToken();
	const tokenExist = RefreshToken.findAll({
		where: {
			id: decodedToken.tokenId,
		},
	});

	if (!tokenExist) throw new HttpError(401, "Unauthorized");

	return decodedToken;
};

module.exports = {
	register,
	login,
	newRefreshToken,
	newAccessToken,
	logout,
	logoutAll,
};
