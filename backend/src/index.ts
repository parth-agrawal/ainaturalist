import express from 'express';
import cors from 'cors';
import { postChat, postRegister, twilioWebhook } from "./controller";

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
}));

// Routes
app.get("/", (req, res) => res.send("Hello Express"));
app.post('/chat', postChat);
app.post('/register', postRegister)
app.post('/twilio/webhook', twilioWebhook);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
