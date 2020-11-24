const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user.model');
const auth = require('../auth/auth');

router.post('/login-local', async (req, res, next) => {
	try {
		if (!req.body.email || !req.body.password) {
			res.status(400).json({
				message: 'Invalid request body'
			})
			return;
		}

		req.body.email = req.body.email.toString().trim().toLowerCase();
		req.body.password = req.body.password.toString().trim();


		passport.authenticate('local', (err, user, info) => {
			if (err) {
				res.status(401).json(err);
				return;
			}
			if (!user) {
				res.status(401).json(info)
				return;
			}
			const token = auth.generateToken(user);
			res.status(200).json({
				token: token
			});
		})(req, res, next)

	} catch (error) {
		res.status(500).json(error);
	}
})

router.get('/login-google', passport.authenticate(
	"google", {
		scope: ["profile", "email"]
	})
);

router.get('/google/redirect', async (req, res, next) => {
	try {
		
		passport.authenticate('google', (err, user, info) => {
			if (err) {
				res.status(401).json(err);
				return;
			}
			if (!user) {
				res.status(401).json(info)
				return;
			}
			const token = auth.generateToken(user);
			res.status(200).json({
				token: token
			});
		})(req, res, next)

	} catch (error) {
		res.status(500).json(error);
	}
})

module.exports = router;
