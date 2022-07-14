const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wrj79b8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

async function run() {
	try {
		await client.connect();
		const posts = client.db("Blog").collection("posts");

		app.get("/", async (req, res) => {
			const query = {};
			const cursor = posts.find(query);
			const allPost = await cursor.toArray();
			res.send(allPost);
		});
		app.get("/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const post = await posts.findOne(query);
			res.send(post);
		});
	} finally {
		//await client.close();
	}
}
run().catch(console.dir);
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
