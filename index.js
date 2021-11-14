const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.69qz5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri)
async function run() {
    try {
        await client.connect();
        console.log('Connected')
        const database = client.db('assingment-12')
        const reviewCollection = database.collection('review')
        const servicesCollection = database.collection('services')
        const orderCollection = database.collection('order')

        //get review
        app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find({})
            const review = await cursor.toArray();
            res.send(review)
        })
        //get services
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray();
            res.send(services)
        })


        // Get Orders
        app.get('/orders', async (req, res) => {
            const email = req.query.email
            let query = {}
            if (email) {
                query = { email: email }
            }
            const cursor = orderCollection.find(query)
            const orders = await cursor.toArray()
            res.json(orders)
        })
        // Post Orders
        app.post('/orders', async (req, res) => {
            const order = req.body
            const ans = await orderCollection.insertOne(order)
            res.json(ans)
        })

        // GET Single Service
        // app.get('/review/:id', async (req, res) => {
        //     const id = req.params.id;
        //     console.log('getting specific service', id);
        //     const query = { _id: ObjectId(id) };
        //     const service = await servicesCollection.findOne(query);
        //     res.json(service);
        // })

        // GET SPECIFIC PRODUCT
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id
            console.log('getting id', id)
            const query = { _id: ObjectId(id) }
            const product = await orderCollection.findOne(query)
            res.send(product)
        })
        // //POST review
        app.post('/review', async (req, res) => {
            const review = req.body;
            console.log('hit the api', review)

            const result = await reviewCollection.insertOne(review)
            console.log(result);
            res.json(result)
        });

        //delete orders
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) };
            const result = await orderCollection.deleteOne(query)
            res.json(result);
        });
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})