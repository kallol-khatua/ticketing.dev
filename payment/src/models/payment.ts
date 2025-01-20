import mongoose, { Schema, Document, Model } from 'mongoose';

interface IPayment extends Document {
    amount: number,
    currency: string,
    rzp_order_id: string,
    rzp_payment_id: string,
    order_id: Schema.Types.ObjectId,
    status: string,
    createdAt?: Date;
    updatedAt?: Date;
}

const paymentSchema: Schema<IPayment> = new Schema<IPayment>({
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    rzp_order_id: {
        type: String,
        required: true
    },
    rzp_payment_id: {
        type: String
    },
    order_id: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "success", "failed"],
        default: "pending"
    }
}, { timestamps: true });

// Create the model
const Payment: Model<IPayment> = mongoose.model<IPayment>('Payment', paymentSchema);

export default Payment;
export { IPayment };