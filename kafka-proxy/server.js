/* eslint-disable no-undef */
import cors from 'cors';
import express, { json } from 'express';
import { Kafka, Partitioners } from 'kafkajs';
import fetch from 'node-fetch';

const app = express();

const kafka = new Kafka({
  brokers: [process.env.KAFKA_URL],
  retry: {
    retries: 10
  }
});

app.use(cors());
app.use(json())

app.post('/topics', async (req, res) => {
  const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner, allowAutoTopicCreation: true })
  const body = req.body;

  try {

    await producer.connect()
    await producer.send({
      topic: body.topic,
      messages: [
        { key: body.key, value: body.message },
      ]
    });
    
    await producer.disconnect();
    return res.status(204).send(null);

  } catch(err) {
    return res.status(500).send(err);
  }
});

class KafkaHandler {
  constructor(kafka) {
    this.kafka = kafka;
  }

  async runConsumers(topics) {
    const consumer = this.kafka.consumer({ groupId: 'mesw-courses' })

    await consumer.connect()
    await consumer.subscribe({ topics, fromBeginning: false })

    await consumer.run({
      eachMessage: async ({ partition, topic, message }) => {

        const body = {
          id: message.value.toString(),
          operation: message.key.toString(),
        }

        if(topic === 'faculty') {
          await fetch(`http://${process.env.DEGREES_URL}/${topic}s`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
        }

        if(topic === 'degree') {
          await fetch(`http://${process.env.COURSES_URL}/${topic}s`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
        }

        console.log({
          partition,
          topic,
          key: message.key.toString(),
          value: message.value.toString(),
        })
      },
    });
  }
}

app.listen(4000, () => {
  const kafkaHandler = new KafkaHandler(kafka);
  
  kafkaHandler.runConsumers(['course', 'faculty', 'degree', 'user']);

  console.log('Server listening on http://127.0.0.1:4000/');
})