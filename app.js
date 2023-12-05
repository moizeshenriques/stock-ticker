const express = require('express');
const { readAndInsertData } = require('./stock');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb+srv://moizesalmeida:MoizesCS20@cluster0.zlniyzy.mongodb.net/';

// Run the web app
readAndInsertData(MONGODB_URI);

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
