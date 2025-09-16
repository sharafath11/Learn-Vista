// utils/queue.utils.ts
import amqp from "amqplib";

let channel: amqp.Channel;

export async function initQueue() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
  channel = await connection.createChannel();
  console.log("✅ RabbitMQ Connected");
}

export async function sendJob(queueName: string, job: any) {
  if (!channel) throw new Error("RabbitMQ not initialized");
  await channel.assertQueue(queueName, { durable: true });

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(job)), {
    persistent: true,
  });
  console.log(`📩 Job sent to ${queueName}:`, job.jobType || "unknown");
}

export async function consumeJobs(queueName: string, handler: (job: any) => Promise<void>) {
  if (!channel) throw new Error("RabbitMQ not initialized");
  await channel.assertQueue(queueName, { durable: true });

  channel.consume(queueName, async (msg) => {
    if (msg) {
      try {
        const job = JSON.parse(msg.content.toString());
        await handler(job);
        channel.ack(msg);
      } catch (err) {
        console.error(`❌ Job failed in ${queueName}:`, err);
        channel.nack(msg, false, false); // move to DLQ
      }
    }
  });
}
