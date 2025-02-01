import mongoose, { Schema, Document, Model } from 'mongoose';

interface ITicket extends Document {
    _id: Schema.Types.ObjectId,
    title: string,
    description: string,
    location: string,
    date: string,
    time: string,
    image: {
        url: string
    },
    user_id: Schema.Types.ObjectId,
    price: number,
    order_id: Schema.Types.ObjectId,
    createdAt?: Date;
    updatedAt?: Date;
}

const ticketSchema: Schema<ITicket> = new Schema<ITicket>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    image: {
        url: {
            type: String,
            required: true
        }
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
        default: null
    }
}, { timestamps: true });

// Create the model
const Ticket: Model<ITicket> = mongoose.model<ITicket>('Ticket', ticketSchema);

export default Ticket;
export { ITicket };
