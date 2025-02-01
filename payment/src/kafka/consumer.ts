import { orderStatus } from '../helper/order-status';
import Order, { IOrder } from '../models/order';
import { Kafka } from 'kafkajs';

// Kafka Consumer Configuration
const kafka = new Kafka({
    clientId: 'payment-microservice',
    brokers: [process.env.KAFKA_BROKER!],
});

const consumer = kafka.consumer({ groupId: 'payment-microservice-group' });

// Initialize Consumer
export const startConsumer = async () => {
    await consumer.connect();
    console.log('Consumer connected to Kafka');

    await consumer.subscribe({ topic: 'order-creation', fromBeginning: true });
    await consumer.subscribe({ topic: 'order-cancellation', fromBeginning: true });
    await consumer.subscribe({ topic: 'order-expired', fromBeginning: true });

    // Handle messages from Kafka
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (topic === "order-creation") {
                const value = JSON.parse(message.value?.toString()!);

                try {
                    const createdOrder = new Order(value);
                    await createdOrder.save();
                } catch (error) {
                    console.log("error while saving the ticket to db", error)
                }
            }
            else if (topic === "order-cancellation") {
                const value = JSON.parse(message.value?.toString()!)

                try {
                    const existingOrder = await Order.findById(value._id);
                    // If ticket not found
                    if (!existingOrder) {
                        return;
                    }

                    await Order.findByIdAndUpdate(existingOrder._id, { status: orderStatus.cancelled });
                } catch (error) {
                    console.error("Error while changing e on order-cancellation consumer", error)
                }
            }
            else if (topic === "order-expired") {
                const value = JSON.parse(message.value?.toString()!);

                try {
                    const existingOrder = await Order.findById(value._id);
                    // If ticket not found
                    if (!existingOrder) {
                        return;
                    }

                    await Order.findByIdAndUpdate(existingOrder._id, { status: orderStatus.expired });
                } catch (error) {
                    console.error("Error while changing e on order-cancellation consumer", error)
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
