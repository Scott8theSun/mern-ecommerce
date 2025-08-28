const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema(
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      name: { type: String, required: true, trim: true }, // snapshot of product name
      image: { type: String, trim: true },                // snapshot of product image
      qty: { type: Number, required: true, min: 1 },
      priceCents: { type: Number, required: true, min: 0 }, // unit price at time of order
    },
    { _id: false }
  );

const AddressSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true, trim: true },
        street:   { type: String, required: true, trim: true },
        city:     { type: String, required: true, trim: true },
        state:    { type: String, trim: true },
        postalCode: { type: String, required: true, trim: true },
        country:  { type: String, required: true, trim: true },
        phone:    { type: String, trim: true },
    },
    { _id: false }
);

const OrderSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
      },
  
      orderItems: {
        type: [OrderItemSchema],
        validate: [(v) => Array.isArray(v) && v.length > 0, 'Order must have at least one item'],
        required: true,
      },
  
      shippingAddress: {
        type: AddressSchema,
        required: true,
      },
  
      paymentMethod: {
        type: String,
        enum: ['card', 'stripe', 'paypal', 'cod', 'manual'],
        required: true,
      },
  
      // Stripe / payment snapshots
      paymentIntentId: { type: String, index: true }, // e.g., pi_123
      paymentStatus: { type: String, enum: ['pending', 'succeeded', 'failed', 'canceled'], default: 'pending' },
      paidAt: { type: Date },
  
      // Price breakdown (all in cents)
      itemsPriceCents:   { type: Number, required: true, min: 0, default: 0 },
      shippingPriceCents:{ type: Number, required: true, min: 0, default: 0 },
      taxPriceCents:     { type: Number, required: true, min: 0, default: 0 },
      totalPriceCents:   { type: Number, required: true, min: 0, default: 0 },
  
      // Delivery
      isPaid: { type: Boolean, default: false },
      isDelivered: { type: Boolean, default: false },
      deliveredAt: { type: Date },
    },
    {timestamps: true}
);

module.exports = mongoose.model('Order', OrderSchema);