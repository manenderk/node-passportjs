const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

class Auth {
	constructor() {
		this.privateKey = fs.readFileSync(path.resolve(__dirname, 'private.key'), 'utf-8');
		this.publicKey = fs.readFileSync(path.resolve(__dirname, 'public.key'), 'utf-8');
		this.issuer = 'myApp';
		this.expiresIn = '8h';
		this.algorithm = 'RS256';
		this.verifiedRequestUserProperty = 'authUser';
	}

	getSignInOptions(email = '') {
		const signInOptions = {
			issuer: this.issuer,
			expiresIn: this.expiresIn,
			algorithm: this.algorithm
		};

		if (email) {
			signInOptions.subject = email;
		}

		return signInOptions;
	}

	getVerifyOptions() {
		const verifyOptions = {
			secret: this.publicKey,
			requestProperty: this.verifiedRequestUserProperty,
			issuer:  this.issuer,
			expiresIn:  this.expiresIn,
			algorithms:  [this.algorithm],
		}
		return verifyOptions;
	}

	generateToken(user) {
		var payload = {
			_id: user._id,
			email: user.email,
			name: user.name
		};
		var signInOptions = this.getSignInOptions(user.email);

		return jwt.sign(payload, this.privateKey, signInOptions);
	}

}

module.exports = new Auth();