import mongoose, { Schema, Document, Model } from 'mongoose';

interface ITicket extends Document {
    _id: Schema.Types.ObjectId,
    title: string,
    description: string,
    user_id: Schema.Types.ObjectId,
    price: number,
    order_id: Schema.Types.ObjectId,
    createdAt?: Date;
    updatedAt?: Date;
}

const ticketSchema: Schema<ITicket> = new Schema<ITicket>({
    _id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    order_id: {
        type: Schema.Types.ObjectId,
        ref: "Order"
    }
}, { timestamps: true });

// Create the model
const Ticket: Model<ITicket> = mongoose.model<ITicket>('Ticket', ticketSchema);

export default Ticket;
export { ITicket };
