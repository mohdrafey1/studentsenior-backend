const axios = require('axios');
const phonepeConfig = require('../../config/phonepe');
const {
    generateBase64Payload,
    generateChecksum,
    createPaymentPayload,
} = require('../../utils/phonepe');
const Payment = require('../../models/Payment');
const PaidCourse = require('../../models/courses/PaidCourse');

//  Handle Payment Initiation (User purchases a course, note, or PYQ)

exports.handlePaymentInitiation = async (req, res) => {
    try {
        const { amount, purchaseItemId, typeOfPurchase } = req.body;
        const userId = req.user.id;

        // Validate purchase type
        if (
            !['Pyq purchase', 'note purchase', 'course purchase'].includes(
                typeOfPurchase
            )
        ) {
            return res
                .status(400)
                .json({ success: false, message: 'Invalid purchase type' });
        }

        // Generate a unique transaction ID
        const merchantTransactionId = `TXN_${Date.now()}`;

        // Store initial payment record in DB
        const payment = new Payment({
            user: userId,
            typeOfPurchase,
            purchaseItemId,
            paymentId: merchantTransactionId,
            amount,
            status: 'pending',
            currency: 'INR',
            provider: 'PhonePe',
        });

        await payment.save();

        // Prepare PhonePe payment payload
        const payload = createPaymentPayload(
            amount,
            merchantTransactionId,
            userId
        );
        const base64Payload = generateBase64Payload(payload);

        const xVerify = generateChecksum(base64Payload, '/pg/v1/pay');

        // Send request to PhonePe API
        const response = await axios.post(
            `${phonepeConfig.baseUrl}/pg/v1/pay`,
            { request: base64Payload },
            {
                headers: {
                    'X-VERIFY': xVerify,
                    'Content-Type': 'application/json',
                },
            }
        );

        const redirectUrl =
            response.data.data.instrumentResponse.redirectInfo.url;

        // Update payment record with link
        await Payment.findOneAndUpdate(
            { paymentId: merchantTransactionId },
            { paymentLink: redirectUrl }
        );

        res.status(200).json({ success: true, redirectUrl });
    } catch (error) {
        console.error('Payment initiation failed:', error);
        res.status(500).json({
            success: false,
            message: 'Payment initiation failed',
            error: error.message,
        });
    }
};

//  Handle Payment Validation (After user completes payment)

exports.handlePaymentValidation = async (req, res) => {
    try {
        const { merchantTransactionId } = req.params;

        const statusEndpoint = `/pg/v1/status/${phonepeConfig.merchantId}/${merchantTransactionId}`;
        const xVerify = generateChecksum('', statusEndpoint);

        const response = await axios.get(
            `${phonepeConfig.baseUrl}${statusEndpoint}`,
            {
                headers: {
                    'X-VERIFY': xVerify,
                    'X-MERCHANT-ID': phonepeConfig.merchantId,
                    'Content-Type': 'application/json',
                },
            }
        );

        // Determine final payment status
        const paymentStatus =
            response.data.code === 'PAYMENT_SUCCESS' ? 'paid' : 'failed';

        // Update the payment record in DB
        await Payment.findOneAndUpdate(
            { paymentId: merchantTransactionId },
            { status: paymentStatus }
        );

        // Get updated payment details
        const payment = await Payment.findOne({
            paymentId: merchantTransactionId,
        })
            .populate('user', 'name email')
            .populate('purchaseItemId');

        if (paymentStatus === 'paid') {
            console.log('Payment successful:', payment);
            const user = payment.user;
            const purchasedItem = payment.purchaseItemId;
            const purchaseType = payment.typeOfPurchase;

            if (purchaseType === 'course purchase') {
                const course = await PaidCourse.findById(purchasedItem._id);

                if (!course) {
                    return res
                        .status(404)
                        .json({ success: false, message: 'Course not found' });
                }

                // 🔹 Enroll user in course

                if (
                    user &&
                    user._id &&
                    !course.enrolledStudents.some((e) =>
                        e.userId?.equals(user._id)
                    )
                ) {
                    course.enrolledStudents.push({
                        userId: user._id,
                        purchasedAt: new Date(),
                    });
                }

                // 🔹 Save updates
                await course.save();
            }
        }

        const redirectUrl = `${process.env.FRONTEND_BASE_URL}/payment-complete?transactionId=${merchantTransactionId}&status=${paymentStatus}`;

        res.redirect(redirectUrl);
    } catch (error) {
        console.error('Payment validation failed:', error);
        res.status(500).json({
            success: false,
            message: 'Payment validation failed',
            error: error.message,
        });
    }
};

//   3️⃣ Get All Payments (Admin Access)
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .sort({ createdAt: -1 })
            .populate('client', 'username email');

        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching payments',
            error: error.message,
        });
    }
};

// Get Payment by Transaction ID

exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findOne({
            paymentId: req.params.id,
        }).populate('user', 'name email');

        if (!payment) {
            return res
                .status(404)
                .json({ success: false, message: 'Payment not found' });
        }

        res.status(200).json({ success: true, data: payment });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching payment',
            error: error.message,
        });
    }
};

// Get User's Own Purchases

exports.getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.user.id }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user payments',
            error: error.message,
        });
    }
};
