const routes = require("express").Router();
const multer = require("multer");
const multerConfig = require("./config/multer");

const Post = require("./models/Post");

routes.get("/posts", async (req, res) => {
  const posts = await Post.find();

  return res.json(posts);
});

routes.post("/posts", multer(multerConfig).single("file"), async (req, res) => {
  try {
    const { originalname, size, key, location: url = "" } = req.file;

    const post = await Post.create({
      name: originalname,
      size,
      key,
      url,
    });

    return res.json(post);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

routes.delete("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    await post.remove();

    return res.send({
      message: "Post removido com sucesso!"
    });
  } catch (err) {
    return res.status(400).send({ error: "Error deleting post", err });
  }
});

routes.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    return res.json(post);
  } catch (err) {
    return res.status(400).send({ error: "Error deleting post" });
  }
});

module.exports = routes;
