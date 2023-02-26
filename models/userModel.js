const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    minlength: [2, 'A name must be greater then 2 character'],
    maxlength: [20, 'A name must be less then 20 character'],
  },

  email: {
    type: String,
    unique: [true, 'email is already used, please enter new email'],
    required: [true, 'A user must have an email'],
    validate: {
      validator: function (v) {
        return /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },

  phone: {
    type: Number,
    unique: [true, 'phone n0. is already used, please enter new number'],
    required: [true, 'A user must have a name'],
    validate: {
      validator: function (val) {
        // eslint-disable-next-line no-useless-escape
        return /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/.test(val);
      },
      message: (props) =>
        `${props.value} is not a valid phone number! Please enter valid number`,
    },
  },

  password: {
    type: String,
    required: [true, 'password required'],
    minlength: [2, 'A password must be greater then 5 character'],
    maxlength: [20, 'A password must be less then 20 character'],
  },

  confirmPassword: {
    type: String,
    required: [true, 'Confirm your password'],
    minlength: [2, 'A password must be greater then 2 character'],
    maxlength: [20, 'A password must be less then 20 character'],
    validate: {
      validator: function (password) {
        return this.password === password;
      },
      message: 'Password is Not matched',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    const checker = changedTimeStamp < JWTTimeStamp;
    return checker;
  }
  // false means not changed
  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
