// routes/imagesRouter.js
import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const imagesRouter = express.Router();
const uri = "YOUR_MONGO_CONNECTION_STRING"; // need to update this uri
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

imagesRouter.get('/:imageId', async (req, res) => {
  const imageIdString = req.params.imageId;

  if (!ObjectId.isValid(imageIdString)){
    return res.status(400).send("Invalid image ID");
  }
  
  try {
    await client.connect();
    const database = client.db("BuddhaWorldGallery");
    const collection = database.collection("ListedArtifacts");
    
    const imageId = new ObjectId(req.params.imageId);
    const imageDetails = await collection.findOne({ _id: imageId });

    if (imageDetails) {
      res.json(imageDetails);
    } else {
      res.status(404).send('Image not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving image details");
  } finally {
    await client.close();
  }
});

export default imagesRouter;
