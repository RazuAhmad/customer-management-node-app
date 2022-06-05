const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 7000;

// Middleware
app.use(cors());
app.use(express.json());

/*
Username: productManagementApp
password: productManagement123
*/

const uri =
  "mongodb+srv://productManagementApp:productManagement123@cluster0.npcfm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("proManagementDatabase");
    const userCollection = database.collection("customerCollection");

    //    POST API
    app.post("/customer", async (req, res) => {
      const newCustomer = req.body;
      const result = await userCollection.insertOne(newCustomer);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(result);
    });

    // UPDATE API
    app.put("/customer/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
          brand: updatedUser.brand,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });

    // FIND ONE API
    app.get("/customer/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    // DELETE API
    app.delete("/customer/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      //   if (result.deletedCount > 0) {
      //     alert("deleted successfully an existing customer");
      //   }
      res.send(result);
    });

    // GET API
    app.get("/customer", async (req, res) => {
      const cursor = userCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
