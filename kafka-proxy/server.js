/* eslint-disable no-undef */
import cors from 'cors';
import express, { json } from 'express';
import { Kafka, Partitioners } from 'kafkajs';

const app = express();

const kafka = new Kafka({
  brokers: [process.env.KAFKA_URL]
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

// async function runConsumers() {
//   const consumer = kafka.consumer({ groupId: 'mesw-courses' })

//   await consumer.connect()
//   await consumer.subscribe({ topics: ['course', 'faculty', 'degree', 'course'], fromBeginning: false })

//   await consumer.run({
//     eachMessage: async ({ partition, topic, message }) => {
//       console.log({
//         partition,
//         topic,
//         key: message.key.toString(),
//         value: message.value.toString(),
//       })
//     },
//   })
// }

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
  
  kafkaHandler.runConsumers(['course', 'faculty', 'degree', 'course']);

  console.log('Server listening on http://127.0.0.1:4000/');
})