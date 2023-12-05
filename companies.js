const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

const MONGODB_URI = 'mongodb+srv://moizesalmeida:MoizesCS20@cluster0.zlniyzy.mongodb.net/';

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/lookup', async (req, res) => {
    const { searchInput, searchType } = req.body;

    try {
        const client = new MongoClient(MONGODB_URI, { useUnifiedTopology: true });
        await client.connect();
        const db = client.db();

        let query;
        if (searchType === 'ticker') {
            query = { stockTicker: searchInput };
        } else {
            query = { companyName: { $regex: new RegExp(searchInput, 'i') } };
        }

        const companies = await db.collection('Companies').find(query).toArray();

        const formattedResult = companies.map(item => `${item.companyName} (${item.stockTicker}): $${item.latestPrice}`).join('\n');
        res.send(`<pre>${formattedResult}</pre>`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
