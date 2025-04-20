const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

app.post('/ask', async (req, res) => {
  const { message } = req.body;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }]
    })
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || 'שגיאה בתגובה';
  res.json({ reply });
});

app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = req.file.path;
  // שלח במייל או לשרת שלך כאן
  res.send('קובץ התקבל בהצלחה');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));