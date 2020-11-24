const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  active: {
    type: Boolean,
    default: false
	},
	hash: {
		type: String,
		required: true
	},
	salt: {
		type: String,
		required: true
	}
}, {
  timestamps: true
});

UserSchema.set('toJSON', {
  transform: function (doc, ret, options) {
		delete ret.hash;
		delete ret.salt;
    return ret;
  }
})

UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = getHash(password, this.salt);
};

UserSchema.methods.validPassword = function(password) {
  var hash = getHash(password, this.salt)
  return this.hash === hash;
};

function getHash(password, salt) {
	return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

module.exports = mongoose.model('User', UserSchema)
