const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware 
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vtmwivk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    
    const serviceCollection = client.db("CarDoctor").collection("services");
    const teamCollection = client.db("CarDoctor").collection("team");
    const productsCollection = client.db("CarDoctor").collection("products");
    const bookingsCollection = client.db("CarDoctor").collection("bookings");


    app.post('/boooking', async(req, res) =>{
        const booking = req.body;
        console.log(booking);
        const result = await bookingsCollection.insertOne(booking);
        res.send(result);
    })

    app.get('/services', async(req, res) => {
        const cursor = serviceCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/services/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const options = {
            
            // Include only the `title` and `imdb` fields in each returned document
            projection: {  title: 1, price: 1, service_id:1 },
          };
        const result = await serviceCollection.findOne(query, options);
        res.send(result);
       
    })

    app.get('/team', async(req, res) => {
        const cursor = teamCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/products', async(req, res) => {
        const cursor = productsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })


    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Server is Running')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})