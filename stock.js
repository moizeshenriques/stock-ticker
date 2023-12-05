const fs = require('fs');
const readline = require('readline');
const { MongoClient } = require('mongodb');

async function initializeDatabase(mongoUri) {
    const client = new MongoClient(mongoUri, { useUnifiedTopology: true });
    await client.connect();
    return client.db().collection('companies'); 
  }

async function insertDataToDatabase(db, data) {
  const companiesCollection = db.collection('Companies');
  await companiesCollection.insertMany(data);
}

async function readAndInsertData(mongoUri) {
    const client = new MongoClient(mongoUri, { useUnifiedTopology: true });
  
    try {
      await client.connect();
      const db = client.db();
  
      const data = [];
  
      const rl = readline.createInterface({
        input: fs.createReadStream('companies.csv'),
        crlfDelay: Infinity,
      });
  
      for await (const line of rl) {
        const [companyName, stockTicker, latestPrice] = line.split(',');
  
        // Convert latestPrice to a number
        const parsedPrice = parseFloat(latestPrice);
  
        // Check if the extracted values are valid
        if (companyName && stockTicker && !isNaN(parsedPrice)) {
          // Create a new object with the extracted values
          const entry = {
            companyName: companyName.trim(),
            stockTicker: stockTicker.trim(),
            latestPrice: parsedPrice,
          };
          data.push(entry);
        } else {
          console.warn('Skipping invalid data:', line);
        }
      }
  
      // Insert data into MongoDB
      await insertDataToDatabase(db, data);
  
      // Display inserted data in the console
      console.log('Data Inserted:', data);
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    } finally {
      // Close the MongoDB connection
      await client.close();
    }
  }
  

module.exports = { initializeDatabase, insertDataToDatabase, readAndInsertData };