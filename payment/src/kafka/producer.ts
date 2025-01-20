import { Kafka } from 'kafkajs';

// Kafka Producer Configuration
const kafka = new Kafka({
    clientId: 'order-microservice',
    brokers: [process.env.KAFKA_BROKER!],
});

// const producer = kafka.producer({
//     allowAutoTopicCreation: false,
// });

const producer = kafka.producer();

// Initialize Producer
export const startProducer = async (): Promise<void> => {
    await producer.connect();
    console.log('Producer connected to Kafka');
};

// Send a message to Kafka topic
export const sendPaymentVerificationMessageToKafka = async (key: string, value: string): Promise<void> => {
    try {
        await producer.send({
            topic: "payment-verification",
            messages: [
                { key, value }
            ],
        });
    } catch (error) {
        console.error('Error sending message to Kafka:', error);
    }
};

export const stopProducer = async (): Promise<void> => {
    await producer.disconnect();
    console.log('Producer disconnected from Kafka');
};
