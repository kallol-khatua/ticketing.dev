import { Queue } from 'bullmq';

const queueName = "orderExpirationQueue"
const expirationQueue = new Queue(queueName, {
    connection: {
        host: process.env.REDIS_HOST!,
        port: Number(process.env.REDIS_PORT!)
    },
});

// Function to add a job with a delay
export const addJobWithDelay = async (orderId: String, orderDetail: Object) => {
    try {
        await expirationQueue.add(
            `orderId: ${orderId}`,
            { orderDetail },
            {
                delay: Number(process.env.JOB_DELAY!),
            }
        );
    } catch (error) {
        console.error('Error while adding expiration job to bullMq Queue', error);
    }
};