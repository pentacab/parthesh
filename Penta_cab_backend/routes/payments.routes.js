const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");

router.post("/api/create-order", paymentController.createOrder);
router.post("/api/verify-payment", paymentController.verifyPayment);
module.exports = router;
