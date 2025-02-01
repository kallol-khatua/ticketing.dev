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
export const sendMessageToKafka = async (key: string, value: string): Promise<void> => {
    try {
        await producer.send({
            topic: "order-creation",
            messages: [
                { key, value }
            ],
        });
    } catch (error) {
        console.error('Error sending message to Kafka:', error);
    }
};

// Publish order cancellation event to kafka
export const publisherOrderCancellationEvent = async (key: string, value: string): Promise<void> => {
    try {
        await producer.send({
            topic: "order-cancellation",
            messages: [
                { key, value }
            ]
        })
    } catch (error) {
        console.error("Error while publishing order cancellation event", error);
    }
}

export const publishPaymentFailedEvent = async (key: string, value: string): Promise<void> => {
    try {
        await producer.send({
            topic: "payment-failed",
            messages: [
                { key, value }
            ]
        })
    } catch (error) {
        console.error("Error while publishing payment failed event", error);
    }
}

export const publishOrderExpiredEvent = async (key: string, value: string): Promise<void> => {
    try {
        await producer.send({
            topic: "order-expired",
            messages: [
                { key, value }
            ]
        })
    } catch (error) {
        console.error("Error while publishing order expired event", error);
    }
}

export const stopProducer = async (): Promise<void> => {
    await producer.disconnect();
    console.log('Producer disconnected from Kafka');
};
