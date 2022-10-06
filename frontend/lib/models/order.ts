import { model, models, Schema } from 'mongoose';

const OrderSchema = new Schema({
    time: Date,
    side: String,
    size: Number,
    filled: Number,
    price: Number,
    fee: Number,
    status: String,
});

const Order = models.Order || model('Order', OrderSchema);

export default Order;
