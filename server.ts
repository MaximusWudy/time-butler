
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// In-memory data store (for now)
const userLogs: { [userId: string]: any[] } = {};

app.post('/api/logs', (req, res) => {
  const { userId, log } = req.body;
  if (!userId || !log) {
    return res.status(400).send('userId and log are required');
  }
  if (!userLogs[userId]) {
    userLogs[userId] = [];
  }
  userLogs[userId].push(log);
  res.status(201).send(log);
});

app.get('/api/logs/:userId', (req, res) => {
  const { userId } = req.params;
  const logs = userLogs[userId] || [];
  res.send(logs);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
