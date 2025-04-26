const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const orderModal = require("../../modal/orderModal");

// ✅ Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "dev02930@gmail.com",
    pass: "eapvrmaolhzflfnq",
  },
});

// ✅ Invoice Template Function
// const generateInvoiceTemplate = (order) => {
//   let orderItems = order.productCart
//     .map(
//       (item) =>
//         `
//     <tr>
//         <td>${item.product.productName}</td>
//         <td>${item.size.sizeName}</td>
//         <td>${item.color.colorName}</td>
//         <td>${item.quantity}</td>
//         <td>₹${item.product.productPrice}</td>
//     </tr>`
//     )
//     .join("");

//   return `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Order Invoice</title>
//         <style>
//             body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
//             .container { max-width: 600px; margin: 20px auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); }
//             .header { text-align: center; background: #007bff; color: white; padding: 10px; border-radius: 10px 10px 0 0; }
//             .order-details { margin: 20px 0; }
//             .order-table { width: 100%; border-collapse: collapse; }
//             .order-table th, .order-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
//             .order-table th { background: #007bff; color: white; }
//             .footer { text-align: center; padding: 10px; font-size: 14px; color: #555; }
//             .footer a { color: #007bff; text-decoration: none; }
//         </style>
//     </head>
//     <body>
//     <div class="container">
//         <div class="header">
//             <h2>Invoice for Order #${order.orderId}</h2>
//         </div>
//         <p>Hi ${order.user.firstName},</p>
//         <p>Thank you for shopping with us! Here are the details of your order:</p>
//         <div class="order-details">
//             <h3>Order Summary</h3>
//             <table class="order-table">
//                 <tr>
//                     <th>Product</th>
//                     <th>Size</th>
//                     <th>Color</th>
//                     <th>Quantity</th>
//                     <th>Price</th>
//                 </tr>
//                 ${orderItems}
//             </table>
//         </div>
//         <h3>Total Amount: ₹${order.orderAmount}</h3>
//         <p><strong>Shipping To:</strong></p>
//         <p>${order.shippingAddress.userAddress}, ${order.shippingAddress.cityName}, ${order.shippingAddress.stateName}, ${order.shippingAddress.countryName}, ${order.shippingAddress.zipCode}</p>
//         <p>If you have any questions, feel free to <a href="mailto:support@yourstore.com">contact us</a>.</p>
//         <div class="footer">
//             <p>Thank you for choosing <strong>Your Store</strong>!</p>
//         </div>
//     </div>
//     </body>
//     </html>
//   `;
// };
// const generateInvoiceTemplate = (order) => {
//   // Format date
//   const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   // Calculate subtotal, tax, and shipping (adjust these based on your order structure)
//   const subtotal = order.orderAmount;
//   const shipping = order.shippingFee || 0;
//   const tax = order.taxAmount || 0;
//   const total = subtotal + shipping + tax;

//   // Generate order items table
//   let orderItems = order.productCart
//     .map(
//       (item) => `
//     <tr>
//       <td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0;">
//         <div style="display: flex; align-items: center;">
//           <div style="margin-right: 15px; width: 60px; height: 60px; background-color: #f5f5f5; display: flex; align-items: center; justify-content: center;">
//             ${
//               item.product.productImage
//                 ? `<img src="${item.product.productImage}" alt="${item.product.productName}" style="max-width: 100%; max-height: 100%;">`
//                 : `<span style="color: #999;">No Image</span>`
//             }
//           </div>
//           <div>
//             <div style="font-weight: 600; margin-bottom: 5px;">${
//               item.product.productName
//             }</div>
//             <div style="font-size: 13px; color: #666;">
//               <span style="margin-right: 10px;">Size: ${
//                 item.size.sizeName
//               }</span>
//               <span style="display: inline-block; width: 12px; height: 12px; background-color: ${
//                 item.color.colorCode
//               }; border-radius: 2px; vertical-align: middle; margin-right: 5px;"></span>
//               ${item.color.colorName}
//             </div>
//           </div>
//         </div>
//       </td>
//       <td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; text-align: center;">${
//         item.quantity
//       }</td>
//       <td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; text-align: right;">₹${item.product.productPrice.toFixed(
//         2
//       )}</td>
//       <td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; text-align: right;">₹${(
//         item.product.productPrice * item.quantity
//       ).toFixed(2)}</td>
//     </tr>`
//     )
//     .join("");

//   return `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Order Invoice #${order.orderId}</title>
//       <style>
//         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
//         body { font-family: 'Poppins', Arial, sans-serif; background-color: #f7fafc; margin: 0; padding: 0; color: #4a5568; }
//         .container { max-width: 650px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
//         .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
//         .logo { font-size: 24px; font-weight: 700; margin-bottom: 10px; }
//         .order-number { font-size: 18px; opacity: 0.9; }
//         .content { padding: 30px; }
//         .greeting { margin-bottom: 25px; }
//         .section-title { font-size: 18px; font-weight: 600; color: #2d3748; margin: 25px 0 15px 0; border-bottom: 2px solid #edf2f7; padding-bottom: 8px; }
//         .order-table { width: 100%; border-collapse: collapse; }
//         .order-table th { background-color: #f8fafc; text-align: left; padding: 12px 15px; font-weight: 500; color: #4a5568; border-bottom: 1px solid #e2e8f0; }
//         .order-summary { background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-top: 25px; }
//         .summary-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
//         .summary-row.total { font-weight: 600; font-size: 16px; border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 15px; }
//         .shipping-address { background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-top: 20px; }
//         .footer { text-align: center; padding: 20px; background-color: #edf2f7; font-size: 14px; color: #718096; }
//         .status-badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: 500; }
//         .status-pending { background-color: #feebc8; color: #9c4221; }
//         .status-shipped { background-color: #bee3f8; color: #2b6cb0; }
//         .status-delivered { background-color: #c6f6d5; color: #276749; }
//         .status-cancelled { background-color: #fed7d7; color: #9b2c2c; }
//         .btn { display: inline-block; padding: 12px 24px; background-color: #667eea; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; margin-top: 15px; }
//         .track-order { margin-top: 25px; text-align: center; }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="header">
//           <div class="logo">Your Store</div>
//           <div class="order-number">Order #${order.orderId}</div>
//         </div>

//         <div class="content">
//           <div class="greeting">
//             <p>Hello ${order.user.firstName},</p>
//             <p>Thank you for your order! We're getting it ready to be shipped. Here's your order confirmation:</p>
//           </div>

//           <div class="order-status">
//             <span class="status-badge status-${order.orderStatus.toLowerCase()}">${
//     order.orderStatus
//   }</span>
//             <p style="margin-top: 8px; font-size: 14px;">Order placed on ${orderDate}</p>
//           </div>

//           <h3 class="section-title">Order Details</h3>
//           <table class="order-table">
//             <thead>
//               <tr>
//                 <th>Product</th>
//                 <th style="text-align: center;">Qty</th>
//                 <th style="text-align: right;">Unit Price</th>
//                 <th style="text-align: right;">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${orderItems}
//             </tbody>
//           </table>

//           <div class="order-summary">
//             <h3 class="section-title" style="border-bottom: none; padding-bottom: 0; margin-top: 0;">Order Summary</h3>
//             <div class="summary-row">
//               <span>Subtotal</span>
//               <span>₹${subtotal.toFixed(2)}</span>
//             </div>
//             <div class="summary-row">
//               <span>Shipping</span>
//               <span>₹${shipping.toFixed(2)}</span>
//             </div>
//             <div class="summary-row">
//               <span>Tax</span>
//               <span>₹${tax.toFixed(2)}</span>
//             </div>
//             <div class="summary-row total">
//               <span>Total</span>
//               <span>₹${total.toFixed(2)}</span>
//             </div>
//           </div>

//           <div class="shipping-address">
//             <h3 class="section-title" style="border-bottom: none; padding-bottom: 0; margin-top: 0;">Shipping Address</h3>
//             <p>
//               <strong>${order.shippingAddress.firstName} ${
//     order.shippingAddress.lastName
//   }</strong><br>
//               ${order.shippingAddress.userAddress}<br>
//               ${
//                 order.shippingAddress.userSubAddress
//                   ? order.shippingAddress.userSubAddress + "<br>"
//                   : ""
//               }
//               ${order.shippingAddress.cityName}, ${
//     order.shippingAddress.stateName
//   }<br>
//               ${order.shippingAddress.countryName}, ${
//     order.shippingAddress.zipCode
//   }<br>
//               <strong>Phone:</strong> ${order.shippingAddress.userPhone}
//             </p>
//           </div>

//           <div class="payment-method" style="margin-top: 20px;">
//             <h3 class="section-title" style="border-bottom: none; padding-bottom: 0; margin-top: 0;">Payment Method</h3>
//             <p>
//               ${
//                 order.paymentType === "1"
//                   ? "Cash on Delivery"
//                   : "Online Payment"
//               }<br>
//               <strong>Status:</strong> ${
//                 order.paymentStatus === "1"
//                   ? "Pending"
//                   : order.paymentStatus === "2"
//                   ? "Confirmed"
//                   : "Cancelled"
//               }
//             </p>
//           </div>

//           ${
//             order.orderStatus.toLowerCase() === "shipped"
//               ? `
//           <div class="track-order">
//             <p>Your order has been shipped!</p>
//             <a href="#" class="btn">Track Your Order</a>
//           </div>
//           `
//               : ""
//           }
//         </div>

//         <div class="footer">
//           <p>If you have any questions, please contact us at <a href="mailto:support@yourstore.com" style="color: #667eea; text-decoration: none;">support@yourstore.com</a></p>
//           <p>© ${new Date().getFullYear()} Your Store. All rights reserved.</p>
//         </div>
//       </div>
//     </body>
//     </html>
//   `;
// };
// const generateInvoiceTemplate = (order) => {
//   const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   return `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <style>
//         body {
//           font-family: Arial, sans-serif;
//           line-height: 1.6;
//           color: #333;
//           max-width: 600px;
//           margin: 0 auto;
//           padding: 20px;
//         }
//         .header {
//           text-align: center;
//           margin-bottom: 30px;
//         }
//         .order-number {
//           font-size: 18px;
//           font-weight: bold;
//           margin: 10px 0;
//         }
//         .status {
//           display: inline-block;
//           padding: 5px 10px;
//           background: #f0f0f0;
//           border-radius: 4px;
//           margin: 5px 0;
//         }
//         table {
//           width: 100%;
//           border-collapse: collapse;
//           margin: 20px 0;
//         }
//         th, td {
//           padding: 12px 15px;
//           text-align: left;
//           border-bottom: 1px solid #ddd;
//         }
//         .section-title {
//           font-size: 18px;
//           margin: 25px 0 15px 0;
//           font-weight: bold;
//         }
//         .address {
//           background: #f9f9f9;
//           padding: 15px;
//           border-radius: 4px;
//           margin: 15px 0;
//         }
//         .footer {
//           margin-top: 30px;
//           font-size: 14px;
//           color: #777;
//           text-align: center;
//         }
//         .product-name {
//           font-weight: bold;
//           margin-bottom: 5px;
//         }
//         .product-details {
//           font-size: 14px;
//           color: #666;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="header">
//         <h1>Your Store</h1>
//         <div class="order-number">Order #${order.orderId}</div>
//       </div>

//       <p>Hello ${order.user.firstName},</p>
//       <p>Thank you for your order! We're getting it ready to be shipped. Here's your order confirmation:</p>

//       <div class="status">${order.orderStatus}</div>
//       <p>Order placed on ${orderDate}</p>

//       <h2 class="section-title">Order Details</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Product</th>
//             <th>Qty</th>
//             <th>Unit Price</th>
//             <th>Total</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${order.productCart
//             .map(
//               (item) => `
//             <tr>
//               <td>
//                 <div class="product-name">${item.product.productName}</div>
//                 <div class="product-details">
//                   Size: ${item.size.sizeName}<br>
//                   Color: ${item.color.colorName}
//                 </div>
//               </td>
//               <td>${item.quantity}</td>
//               <td>₹${item.product.productPrice.toFixed(2)}</td>
//               <td>₹${(item.product.productPrice * item.quantity).toFixed(
//                 2
//               )}</td>
//             </tr>
//           `
//             )
//             .join("")}
//         </tbody>
//       </table>

//       <h2 class="section-title">Order Summary</h2>
//       <p>Subtotal ₹${order.orderAmount.toFixed(2)}</p>
//       <p>Shipping ₹0.00</p>
//       <p>Tax ₹0.00</p>
//       <p><strong>Total ₹${order.orderAmount.toFixed(2)}</strong></p>

//       <h2 class="section-title">Shipping Address</h2>
//       <div class="address">
//         ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
//         ${order.shippingAddress.userAddress}<br>
//         ${order.shippingAddress.userSubAddress || ""}<br>
//         ${order.shippingAddress.cityName}, ${
//     order.shippingAddress.stateName
//   }<br>
//         ${order.shippingAddress.countryName}, ${
//     order.shippingAddress.zipCode
//   }<br>
//         Phone: ${order.shippingAddress.userPhone}
//       </div>

//       <h2 class="section-title">Payment Method</h2>
//       <p>${
//         order.paymentType === "1" ? "Cash on Delivery" : "Online Payment"
//       }</p>
//       <p>Status: ${
//         order.paymentStatus === "1"
//           ? "Pending"
//           : order.paymentStatus === "2"
//           ? "Confirmed"
//           : "Cancelled"
//       }</p>

//       <div class="footer">
//         <p>If you have any questions, please contact us at support@yourstore.com</p>
//         <p>© ${new Date().getFullYear()} Your Store. All rights reserved.</p>
//       </div>
//     </body>
//     </html>
//   `;
// };
const generateInvoiceTemplate = (order) => {
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Color variables
  const primaryColor = "#4f46e5"; // Indigo
  const secondaryColor = "#10b981"; // Emerald
  const accentColor = "#f59e0b"; // Amber
  const bgColor = "#f8fafc"; // Light slate

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          line-height: 1.6;
          color: #334155;
          background-color: ${bgColor};
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, ${primaryColor} 0%, #7c3aed 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .logo {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 5px;
        }
        .order-number {
          font-size: 18px;
          opacity: 0.9;
        }
        .content {
          padding: 30px;
        }
        .greeting {
          margin-bottom: 25px;
        }
        .status-badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          background-color: ${
            order.orderStatus === "Delivered" ? secondaryColor : accentColor
          };
          color: white;
          margin: 10px 0;
        }
        .order-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          margin: 25px 0;
        }
        .order-table th {
          background-color: ${bgColor};
          text-align: left;
          padding: 12px 16px;
          font-weight: 600;
        }
        .order-table td {
          padding: 16px;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: top;
        }
        .product-name {
          font-weight: 600;
          margin-bottom: 4px;
        }
        .product-variant {
          font-size: 14px;
          color: #64748b;
        }
        .color-swatch {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 6px;
          vertical-align: middle;
        }
        .summary-card {
          background-color: ${bgColor};
          border-radius: 8px;
          padding: 20px;
          margin: 25px 0;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .total-row {
          font-weight: 700;
          font-size: 16px;
          border-top: 1px solid #e2e8f0;
          padding-top: 12px;
          margin-top: 12px;
        }
        .address-card {
          background-color: ${bgColor};
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
          margin: 30px 0 15px 0;
        }
        .footer {
          text-align: center;
          padding: 20px;
          background-color: ${bgColor};
          font-size: 14px;
          color: #64748b;
        }
        .footer a {
          color: ${primaryColor};
          text-decoration: none;
        }
        .divider {
          height: 1px;
          background-color: #e2e8f0;
          margin: 25px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Your Store</div>
          <div class="order-number">Order #${order.orderId}</div>
        </div>
        
        <div class="content">
          <div class="greeting">
            <p>Hello ${order.user.firstName},</p>
            <p>Thank you for your order! Here's your confirmation:</p>
          </div>
          
          <div class="status-badge">${order.orderStatus}</div>
          <p>Order placed on ${orderDate}</p>
          
          <div class="divider"></div>
          
          <h2 class="section-title">Order Details</h2>
          <table class="order-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.productCart
                .map(
                  (item) => `
                <tr>
                  <td>
                    <div class="product-name">${item.product.productName}</div>
                    <div class="product-variant">
                      Size: ${item.size.sizeName} • 
                      <span class="color-swatch" style="background-color: ${
                        item.color.colorCode
                      };"></span>
                      ${item.color.colorName}
                    </div>
                  </td>
                  <td>${item.quantity}</td>
                  <td>₹${item.product.productPrice.toFixed(2)}</td>
                  <td>₹${(item.product.productPrice * item.quantity).toFixed(
                    2
                  )}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          
          <div class="summary-card">
            <h3 class="section-title" style="margin-top: 0;">Order Summary</h3>
            <div class="summary-row">
              <span>Subtotal</span>
              <span>₹${order.orderAmount.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Shipping</span>
              <span>₹0.00</span>
            </div>
            <div class="summary-row">
              <span>Tax</span>
              <span>₹0.00</span>
            </div>
            <div class="summary-row total-row">
              <span>Total</span>
              <span>₹${order.orderAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="address-card">
            <h3 class="section-title" style="margin-top: 0;">Shipping Address</h3>
            <p>
              <strong>${order.shippingAddress.firstName} ${
    order.shippingAddress.lastName
  }</strong><br>
              ${order.shippingAddress.userAddress}<br>
              ${order.shippingAddress.userSubAddress || ""}<br>
              ${order.shippingAddress.cityName}, ${
    order.shippingAddress.stateName
  }<br>
              ${order.shippingAddress.countryName}, ${
    order.shippingAddress.zipCode
  }<br>
              <strong>Phone:</strong> ${order.shippingAddress.userPhone}
            </p>
          </div>
          
          <div class="payment-info">
            <h3 class="section-title">Payment Method</h3>
            <p><strong>${
              order.paymentType === "1" ? "Cash on Delivery" : "Online Payment"
            }</strong></p>
            <p>Status: <span style="color: ${
              order.paymentStatus === "2" ? secondaryColor : "#ef4444"
            }">
              ${
                order.paymentStatus === "1"
                  ? "Pending"
                  : order.paymentStatus === "2"
                  ? "Confirmed"
                  : "Cancelled"
              }
            </span></p>
          </div>
        </div>
        
        <div class="footer">
          <p>If you have any questions, contact us at <a href="mailto:support@yourstore.com">support@yourstore.com</a></p>
          <p>© ${new Date().getFullYear()} Your Store. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
// ✅ Send Invoice Email Function
const sendInvoiceEmail = async (req, res) => {
  try {
    console.log("Received Payload:", req.body);
    const { _id, Email } = req.body;

    const order = await orderModal
      .findOne({ _id })
      .populate("user")
      .populate("productCart.product");

    if (!order) {
      console.log("❌ Order not found for ID:", _id);
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Generate Invoice Template
    const emailHtml = generateInvoiceTemplate(order);

    // Send Email
    await transporter.sendMail({
      from: "your-email@example.com",
      to: Email,
      subject: "Your Invoice from Your Store",
      html: emailHtml,
    });

    console.log("✅ Email sent successfully!");
    res.json({ success: true, message: "Invoice email sent" });
  } catch (error) {
    console.error("❌ Error in send-invoice route:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { sendInvoiceEmail };
