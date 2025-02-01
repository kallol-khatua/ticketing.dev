import { addJobWithDelay } from "../queues/queue";
import { Kafka } from 'kafkajs';

// Kafka Consumer Configuration
const kafka = new Kafka({
    clientId: 'expiration-microservice',
    brokers: [process.env.KAFKA_BROKER!],
});

const consumer = kafka.consumer({ groupId: 'expiration-microservice-group' });

// Initialize Consumer
export const startConsumer = async () => {
    await consumer.connect();
    console.log('Consumer connected to Kafka');

    await consumer.subscribe({ topic: 'order-creation', fromBeginning: true });

    // Handle messages from Kafka
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (topic === "order-creation") {
                const key = message.key?.toString()!;
                const value = JSON.parse(message.value?.toString()!);

                try {
                    await addJobWithDelay(key, value);
                } catch (error) {
                    console.log("error while adding order to expiration delay queue", error)
                }
            } else {
                console.log("Unknown topic: ", topic);
            }
        },
    });
};

// Stop Consumer
export const stopConsumer = async () => {
    await consumer.disconnect();
    console.log('Consumer disconnected from Kafka');
};
