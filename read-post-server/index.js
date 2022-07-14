const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

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
		//read full post
		app.get("/posts", async (req, res) => {
			const query = {};
			const cursor = posts.find(query);
			const allPost = await cursor.toArray();
			res.send(allPost);
		});
		// read single post
		app.get("/posts/:id", async (req, res) => {
			const id = req.params.id;

			const query = {
				_id: ObjectId(id),
			};
			const post = await posts.findOne(query);
			res.send(post);
		});

		//update post
		app.put("/posts/:id", async (req, res) => {
			const id = req.params.id;
			console.log(id);
			const editPost = req.body;
			console.log(editPost);
			const filter = { _id: ObjectId(id) };
			const options = { upsert: true };
			const updateDoc = {
				$set: {
					body: editPost.bodyData,
				},
			};
			const result = await posts.updateOne(filter, updateDoc, options);
			res.send(result);
		});

		//delete post
		app.delete("/posts/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await posts.deleteOne(query);
			res.send(result);
		});
	} finally {
		//await client.close();
	}
}
run().catch(console.dir);
app.get("/", (req, res) => {
	res.send("Hello world");
});
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
