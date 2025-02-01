import Ticket from '../models/ticket';
import { Kafka } from 'kafkajs';

// Kafka Consumer Configuration
const kafka = new Kafka({
    clientId: 'ticket-microservice',
    brokers: [process.env.KAFKA_BROKER!],
});

const consumer = kafka.consumer({ groupId: 'ticket-microservice-group' });

// Initialize Consumer
export const startConsumer = async () => {
    await consumer.connect();
    console.log('Consumer connected to Kafka');

    await consumer.subscribe({ topic: 'order-creation', fromBeginning: true });
    await consumer.subscribe({ topic: 'order-cancellation', fromBeginning: true });
    await consumer.subscribe({ topic: 'payment-failed', fromBeginning: true });
    await consumer.subscribe({ topic: 'order-expired', fromBeginning: true });

    // Handle messages from Kafka
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (topic === "order-creation") {
                const value = JSON.parse(message.value?.toString()!);

                try {
                    const existingTicket = await Ticket.findById(value.ticket_id);
                    // If ticket not found
                    if (!existingTicket) {
                        return;
                    }
                    existingTicket.order_id = value._id;
                    await existingTicket.save();
                } catch (error) {
                    console.log("error while saving the ticket to db", error)
                }
            } else if (topic === "order-cancellation") {
                const value = JSON.parse(message.value?.toString()!)

                try {
                    const existingTicket = await Ticket.findById(value.ticket_id);
                    // If ticket not found
                    if (!existingTicket) {
                        return;
                    }

                    await Ticket.findByIdAndUpdate(existingTicket._id, { order_id: null });
                } catch (error) {
                    console.error("Error while removing order id from a ticket on order-cancellation consumer", error)
                }
            } else if (topic === "payment-failed") {
                const value = JSON.parse(message.value?.toString()!);

                try {
                    const existingTicket = await Ticket.findById(value.ticket_id);
                    // If ticket not found
                    if (!existingTicket) {
                        return;
                    }

                    await Ticket.findByIdAndUpdate(existingTicket._id, { order_id: null });
                } catch (error) {
                    console.error("Error while removing order id from a ticket on payment-failed consumer on ticket-microservice", error)
                }
            } else if (topic === "order-expired") {
                const value = JSON.parse(message.value?.toString()!)

                try {
                    const existingTicket = await Ticket.findById(value.ticket_id);
                    // If ticket not found
                    if (!existingTicket) {
                        return;
                    }

                    await Ticket.findByIdAndUpdate(existingTicket._id, { order_id: null });
                } catch (error) {
                    console.error("Error while removing order id from a ticket on order-cancellation consumer", error)
                }
            }
            else {
                console.log("Unknown topic");
            }
        },
    });
};

// Stop Consumer
export const stopConsumer = async () => {
    await consumer.disconnect();
    console.log('Consumer disconnected from Kafka');
};
