const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide a valid email address'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  usn: {
    type: String,
    required: [true, 'Please provide a valid usn'],
    lowercase: true,
    unique: true,
  },
  branch: {
    type: String,
    required: [true, 'Please provide a branch'],
    lowercase: true,
    enum: {
      values: ['cse', 'ece', 'ise'],
      message: 'The type should cse, ece or ise',
    },
  },
  contact: {
    type: String,
    required: [true, 'Please provide a valid contact'],
    validate: [validator.isMobilePhone, 'Please provide a valid mobile phone'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
//   if (this.passwordChangedAt) {
//     const changedTimestamp = parseInt(
//       this.passwordChangedAt.getTime() / 1000,
//       10
//     );

//     return JWTTimestamp < changedTimestamp;
//   }

//   return false;
// };

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    console.log('JWT Timestamp:', JWTTimestamp);
    console.log('Password Changed Timestamp:', changedTimestamp);

    return JWTTimestamp < changedTimestamp;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
