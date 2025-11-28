const razorPay = require("razorpay");
require("dotenv").config();


const CreateRazorPayInstance = () => {
  return new razorPay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

module.exports = CreateRazorPayInstance;
