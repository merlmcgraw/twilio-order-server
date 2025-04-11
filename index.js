require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

app.post('/order', async (req, res) => {
  const { name, textNumber, orderSummary } = req.body;
  try {
    await client.messages.create({
      body: `New Order from ${name}:\n${orderSummary}`,
      from: process.env.TWILIO_NUMBER, // Your Twilio phone number
      to: '+1' + textNumber.replace(/\D/g, ''),
    });
    res.json({ result: 'success' });
  } catch (error) {
    console.error(error);
    res.json({ result: 'error', error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Twilio Order Server is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
