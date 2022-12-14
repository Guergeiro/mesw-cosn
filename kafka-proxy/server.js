/* eslint-disable no-undef */
import cors from "cors";
import express, { json } from "express";
import { Kafka, Partitioners } from "kafkajs";
import fetch from "node-fetch";

const app = express();

const kafka = new Kafka({
  brokers: [process.env.KAFKA_URL],
  retry: {
    retries: 10,
  },
});

app.use(cors());
app.use(json());

app.post("/topics", async (req, res) => {
  const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
    allowAutoTopicCreation: true,
  });
  const body = req.body;

  try {
    await producer.connect();
    await producer.send({
      topic: body.topic,
      messages: [{ key: body.key, value: body.message }],
    });

    await producer.disconnect();
    return res.status(204).send(null);
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.get("/health", (_, res) => {
  res.status(200).send("OK");
});

class KafkaHandler {
  constructor(kafka) {
    this.kafka = kafka;
  }

  async runConsumers(topics) {
    const consumer = this.kafka.consumer({ groupId: "mesw-courses" });

    await consumer.connect();
    await consumer.subscribe({ topics, fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ partition, topic, message }) => {
        if (topic === "faculty") {
          const parsed = JSON.parse(message.value);
          const key = Object.keys(parsed)[0];

          await fetch(`${process.env.DEGREES_URL}/faculties`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: parsed[key],
              operation: key,
            }),
          });
        }

        if (topic === "degree") {
          await fetch(`${process.env.COURSES_URL}/degrees`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: message.value.toString(),
              operation: message.key.toString(),
            }),
          });
        }

        console.log({
          partition,
          topic,
          value: message.value.toString(),
        });
      },
    });
  }
}

const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  const kafkaHandler = new KafkaHandler(kafka);

  kafkaHandler.runConsumers(["course", "faculty", "degree", "user"]);

  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
