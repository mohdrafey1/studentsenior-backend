const axios = require('axios');
const qs = require('qs');
const Payment = require('../../models/Payment');
const PaidCourse = require('../../models/courses/PaidCourse');
const phonepeConfig = require('../../config/phonepe');

// Environment configuration
const PHONEPE_ENV = process.env.NODE_ENV === 'production' ? 'PROD' : 'UAT';

// Helper function to get auth token
async function getPhonePeAuthToken() {
    const response = await axios.post(
        phonepeConfig.endpoints[PHONEPE_ENV].auth,
        qs.stringify({
            client_id: phonepeConfig.credentials.clientId,
            client_version: phonepeConfig.credentials.clientVersion,
            client_secret: phonepeConfig.credentials.clientSecret,
            grant_type: 'client_credentials',
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );
    return response.data.access_token;
}

// 1. Handle Payment Initiation
module.exports.initiatePayment = async (req, res) => {
    try {
        const { amount, purchaseItemId, typeOfPurchase } = req.body;
        const userId = req.user.id;

        // Validate purchase type
        if (
            !['course_purchase', 'note_purchase', 'pyq_purchase'].includes(
                typeOfPurchase
            )
        ) {
            return res.status(400).json({
                success: false,
                message: 'Invalid purchase type',
            });
        }

        // Generate unique transaction ID
        const merchantOrderId = `TXN_${Date.now()}`;

        // Create payment record
        const payment = new Payment({
            user: userId,
            typeOfPurchase,
            purchaseItemId,
            merchantOrderId,
            amount,
            status: 'pending',
            currency: 'INR',
            provider: 'PhonePe',
        });

        await payment.save();

        // Get auth token
        const accessToken = await getPhonePeAuthToken();

        // Create payment request
        const paymentResponse = await axios.post(
            phonepeConfig.endpoints[PHONEPE_ENV].payment,
            {
                merchantOrderId,
                amount: amount * 100, // Convert to paisa
                expireAfter: 1200, // 20 minutes
                metaInfo: {
                    udf1: userId,
                    udf2: typeOfPurchase,
                    udf3: purchaseItemId.toString(),
                },
                paymentFlow: {
                    type: 'PG_CHECKOUT',
                    merchantUrls: {
                        redirectUrl: `${phonepeConfig.urls.backend}/api/phonepe/verify/${merchantOrderId}`,
                    },
                },
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `O-Bearer ${accessToken}`,
                },
            }
        );

        // Update payment with PhonePe response
        payment.phonePeOrderId = paymentResponse.data.orderId;
        payment.paymentLink = paymentResponse.data.redirectUrl;
        payment.paymentResponse = paymentResponse.data;

        await payment.save();

        res.status(200).json({
            success: true,
            redirectUrl: paymentResponse.data.redirectUrl,
        });
    } catch (error) {
        console.error('Payment initiation failed:', error);
        res.status(500).json({
            success: false,
            message: 'Payment initiation failed',
            error: error.response?.data || error.message,
        });
    }
};

// 2. Handle Payment Verification (Callback)
module.exports.verifyPayment = async (req, res) => {
    try {
        const { merchantOrderId } = req.params;

        // Get auth token
        const accessToken = await getPhonePeAuthToken();

        // Check payment status with PhonePe
        const statusResponse = await axios.get(
            `${phonepeConfig.endpoints[PHONEPE_ENV].status}/${merchantOrderId}/status`,
            {
                headers: {
                    Authorization: `O-Bearer ${accessToken}`,
                },
            }
        );

        const phonePeStatus = statusResponse.data.state;
        const paymentStatus = phonePeStatus === 'COMPLETED' ? 'paid' : 'failed';

        // Update payment record
        const payment = await Payment.findOneAndUpdate(
            { merchantOrderId },
            {
                status: paymentStatus,
                paymentResponse: statusResponse.data,
            },
            { new: true }
        )
            .populate('user')
            .populate('purchaseItemId');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found',
            });
        }

        // Handle successful payment
        if (paymentStatus === 'paid') {
            // console.log('Payment successful:', payment);
            const user = payment.user;
            const purchasedItem = payment.purchaseItemId;
            const purchaseType = payment.typeOfPurchase;

            if (purchaseType === 'course_purchase') {
                const course = await PaidCourse.findById(purchasedItem._id);

                if (!course) {
                    return res
                        .status(404)
                        .json({ success: false, message: 'Course not found' });
                }

                if (
                    course.enrolledStudents?.some(
                        (student) =>
                            student.userId &&
                            student.userId.toString() === userId.toString()
                    )
                ) {
                    return next(
                        errorHandler(
                            400,
                            'You are already enrolled in this course.'
                        )
                    );
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

        // Redirect to frontend with status
        const frontendUrl = `${phonepeConfig.urls.frontend}/payment-complete?status=${paymentStatus}&transactionId=${merchantOrderId}`;
        res.redirect(frontendUrl);
    } catch (error) {
        console.error('Payment verification failed:', {
            message: error.message,
            response: error.response?.data,
            merchantOrderId: req.params?.merchantOrderId,
        });

        const frontendUrl = `${
            phonepeConfig.urls.frontend
        }/payment-complete?status=failed&transactionId=${
            req.params.merchantOrderId || 'unknown'
        }`;
        res.redirect(frontendUrl);
    }
};

module.exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findOne({
            merchantOrderId: req.params.id,
        }).populate('user', 'name email');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found',
            });
        }

        res.status(200).json({
            success: true,
            data: payment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching payment',
            error: error.message,
        });
    }
};
