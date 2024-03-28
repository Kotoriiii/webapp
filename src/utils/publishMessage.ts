import { PubSub } from '@google-cloud/pubsub';

type TData = {
  id: string;
  email: string;
  verifyCode: string;
};

export async function publishMessage(topicName: string, msg: string, data: TData) {
  const pubsub = new PubSub({ projectId: 'firm-reason-411722' });
  const topic = pubsub.topic(topicName);
  const message = {
    message: msg,
    data: data
  };
  try {
    const messageId = await topic.publishMessage({ json: message });
    console.log(`Message ${messageId} published.`);
  } catch (error) {
    console.error(`Received error while publishing: ${(error as any).message}`);
  }
}
