import mongoose, { Schema, Document, Model } from 'mongoose';

interface IOrder extends Document {
    _id: Schema.Types.ObjectId,
    user_id: Schema.Types.ObjectId,
    ticket_id: Schema.Types.ObjectId,
    ticket_price: number,
    status: string,
    createdAt?: Date;
    updatedAt?: Date;
}

const orderSchema: Schema<IOrder> = new Schema<IOrder>({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    ticket_id: {
        type: Schema.Types.ObjectId,
        ref: "Ticket",
        required: true
    },
    ticket_price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Create the model
const Order: Model<IOrder> = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
export { IOrder };
