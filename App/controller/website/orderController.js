const orderModal = require("../../modal/orderModal");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { PRODUCT_STATIC_PATH } = require("../../config/staticPaths.js");

let instance = new Razorpay({
  key_id: "rzp_test_cG92Bks4ytEZmv",
  key_secret: "g6KmDblXg4msw5rFdZzg9Bmy",
});

let saveOrder = async (req, res) => {
  if (req.body.paymentType == 1) {
    let saveOrder = await orderModal(req.body);
    let data = await saveOrder.save();
    res.status(200).json({
      status: 1,
      data: data,
      message: "Order Placed.",
    });
  } else if (req.body.paymentType == 2) {
    let saveOrder = await orderModal(req.body);
    let data = await saveOrder.save(); //Insert
    console.log(data);
    // Razorpay Order Creating Start
    let orderData = {
      amount: Math.floor(req.body.orderAmount) * 100,
      currency: "INR",
      receipt: `order_rcptid_${data._id}`,
    };
    try {
      instance.orders.create(orderData, async function (err, order) {
        if (err) {
          console.log(err);
          return res.status(400).json({
            status: 0,
            message: "Unable to create Razorpay order",
            error: err,
          });
        }

        let orderID = order.id;
        let updateRazorpayOrderId = await orderModal.updateOne(
          // Update
          { _id: data._id },
          { $set: { razorpayOrderId: orderID } }
        );

        // Send a more consistent response
        res.status(200).json({
          status: 1,
          message: "Razorpay order created",
          data: data,
          id: order.id,
          amount: order.amount,
          currency: order.currency,
        });
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: 0,
        message: "Unable to create order",
        error: error.message,
      });
    }
  }
};

// let razorpayVerifyOrder = async (req, res) => {
//   try {
//     console.log("Verification request body:", req.body);

//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//       req.body;

//     // Check if the order exists in the database
//     const orderExists = await orderModal.findOne({
//       razorpayOrderId: razorpay_order_id,
//     });
//     if (!orderExists) {
//       return res.status(404).json({
//         status: 0,
//         message: "Order not found with provided Razorpay Order ID",
//       });
//     }

//     // Use Razorpay's instance to verify the signature
//     const generated_signature = crypto
//       .createHmac("sha256", "yvogXUWbQBb9Fc35v9SV4loV")
//       .update(razorpay_order_id + "|" + razorpay_payment_id)
//       .digest("hex");

//     // Log both signatures for debugging
//     console.log("Generated signature:", generated_signature);
//     console.log("Razorpay signature:", razorpay_signature);

//     if (generated_signature === razorpay_signature) {
//       // Payment is successful
//       let updateData = await orderModal.updateOne(
//         { razorpayOrderId: razorpay_order_id },
//         {
//           $set: {
//             razorpayPaymentId: razorpay_payment_id,
//             paymentStatus: 2,
//             orderStatus: "Shipped",
//           },
//         }
//       );

//       res.status(200).json({
//         status: 1,
//         message: "Order Placed Successfully.",
//         data: updateData,
//       });
//     } else {
//       // Payment verification failed
//       res.status(400).json({
//         status: 0,
//         message: "Payment verification failed.",
//       });
//     }
//   } catch (error) {
//     console.error("Error in razorpayVerifyOrder:", error);
//     res.status(500).json({
//       status: 0,
//       message: "Server error during verification",
//       error: error.message,
//     });
//   }
// };
let razorpayVerifyOrder = async (req, res) => {
  try {
    console.log("Verification request body:", req.body);

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Check if the order exists in the database
    const orderExists = await orderModal.findOne({
      razorpayOrderId: razorpay_order_id,
    });
    if (!orderExists) {
      return res.status(404).json({
        status: 0,
        message: "Order not found with provided Razorpay Order ID",
      });
    }

    // Use Razorpay's instance to verify the signature
    const secretKey = "g6KmDblXg4msw5rFdZzg9Bmy"; // Use environment variable for the secret key
    const generated_signature = crypto
      .createHmac("sha256", secretKey)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    // Log both signatures for debugging
    console.log("Generated signature:", generated_signature);
    console.log("Razorpay signature:", razorpay_signature);

    if (generated_signature === razorpay_signature) {
      // Payment is successful
      let updateData = await orderModal.updateOne(
        { razorpayOrderId: razorpay_order_id },
        {
          $set: {
            razorpayPaymentId: razorpay_payment_id,
            paymentStatus: 2, // 2 means "Paid"
            orderStatus: "Shipped",
          },
        }
      );

      res.status(200).json({
        status: 1,
        message: "Order Placed Successfully.",
        data: updateData,
      });
    } else {
      // Payment verification failed
      res.status(400).json({
        status: 0,
        message: "Payment verification failed.",
      });
    }
  } catch (error) {
    console.error("Error in razorpayVerifyOrder:", error);
    res.status(500).json({
      status: 0,
      message: "Server error during verification",
      error: error.message,
    });
  }
};
let viewOrder = async (req, res) => {
  try {
    let userId = req.params.id;
    let orderData = await orderModal.find({ user: userId });
    res.status(200).json({
      status: 1,
      data: orderData,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      error: error.message,
    });
  }
};

let viewOrderDetail = async (req, res) => {
  try {
    let orderID = req.params.id;
    let orderData = await orderModal.findOne({ _id: orderID });
    if (orderData) {
      res.status(200).json({
        status: 1,
        path: PRODUCT_STATIC_PATH,
        data: orderData,
      });
    } else {
      res.status(200).json({
        status: 0,
        message: "Order not found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Server error occurred.",
    });
  }
};

let cancelOrder = async (req, res) => {
  try {
    let { reason, comment, order, user } = req.body;
    if (order) {
      let cancelOrderData = await orderModal.updateOne(
        { _id: order, user: user },
        { $set: { paymentStatus: 3, orderStatus: "Cancelled" } }
      );
      res.status(200).json({
        status: 1,
        message: "Order Cancelled.",
        data: cancelOrderData,
      });
    } else {
      res.status(200).json({
        status: 0,
        message: "Unable to cancel order.",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 0,
      error: error.message,
    });
  }
};

module.exports = {
  saveOrder,
  viewOrder,
  viewOrderDetail,
  razorpayVerifyOrder,
  cancelOrder,
};
