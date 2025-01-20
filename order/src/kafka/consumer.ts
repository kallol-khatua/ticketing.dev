import { orderStatus } from '../helper/order-status';
import Order, { IOrder } from '../models/order';
import Ticket from '../models/ticket';
import { Kafka } from 'kafkajs';
import { publishPaymentFailedEvent } from './producer';

// Kafka Consumer Configuration
const kafka = new Kafka({
    clientId: 'order-microservice',
    brokers: [process.env.KAFKA_BROKER!],
});

const consumer = kafka.consumer({ groupId: 'order-microservice-group' }); // Group ID for message consumption

// Initialize Consumer
export const startConsumer = async () => {
    await consumer.connect();
    console.log('Consumer connected to Kafka');

    await consumer.subscribe({ topic: 'ticket-creation', fromBeginning: true });
    await consumer.subscribe({ topic: 'payment-verification', fromBeginning: true });

    // Handle messages from Kafka
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (topic === "ticket-creation") {
                const key = message.key?.toString()!;
                const value = JSON.parse(message.value?.toString()!);

                try {
                    const newTicket = new Ticket(value);
                    const savedTicket = await newTicket.save();
                } catch (error) {
                    console.log("error while saving the ticket to db", error)
                }
            } else if (topic === "payment-verification") {
                const value: IOrder = JSON.parse(message.value?.toString()!);

                try {
                    const existingOrder = await Order.findById(value._id);
                    if (!existingOrder) {
                        return;
                    }

                    if (existingOrder.status != orderStatus.awaitingPayment) {
                        return;
                    }

                    if (value.status === orderStatus.completed) {
                        // If payment is success fully done then only change order status to completed
                        await Order.findByIdAndUpdate(existingOrder._id, { status: orderStatus.completed });
                    } else if (value.status === orderStatus.paymentFailed) {
                        // If payment if failed then change order status to payment failed
                        await Order.findByIdAndUpdate(existingOrder._id, { status: orderStatus.paymentFailed });

                        // and remove order id from the ticket
                        await Ticket.findByIdAndUpdate(existingOrder.ticket_id, { order_id: null })

                        // also emit the event to kafka
                        // so that in ticket microservice, order id could be removed from the ticket
                        await publishPaymentFailedEvent(String(existingOrder._id), JSON.stringify(existingOrder));
                    }
                } catch (error) {
                    console.error("Error at payment-verification kafka consumer at order-microservice", error);
                }
            } else {
                console.log("Unknown topic", topic);
            }
        },
    });
};

// Stop Consumer
export const stopConsumer = async () => {
    await consumer.disconnect();
    console.log('Consumer disconnected from Kafka');
};
