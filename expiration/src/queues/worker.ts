import { sendMessageToKafka } from "../kafka/producer";
import { Job, Worker } from "bullmq"

// Initialize the worker
export const startWorker = async () => {
    const queueName = "orderExpirationQueue"
    const expirationQueueWorker = new Worker(queueName, async (job: Job) => {
        // publish order expiration event to kafka topic
        const orderId: string = job.data.orderDetail._id;
        const orderDetail: Object = job.data.orderDetail;
        await sendMessageToKafka(orderId, JSON.stringify(orderDetail));
    }, {
        connection: {
            host: process.env.REDIS_HOST!,
            port: Number(process.env.REDIS_PORT!)
        },
    }
    );
}