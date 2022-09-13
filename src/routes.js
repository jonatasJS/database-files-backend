const routes = require("express").Router();
const multer = require("multer");
const multerConfig = require("./config/multer");

const Post = require("./models/Post");

routes.get("/posts", async (req, res) => {
  const posts = await Post.find();

  return res.json(posts);
}); 

routes.post("/posts", multer(multerConfig).single("file"), async (req, res) => {
  console.log(req.file);
  const {
    originalname,
    size,
    key,
    location
  } = req.file;

  const post = await Post.create({
    name: originalname,
    size,
    key,
    url: location || ""
  }).then(postProp => {
    post.save();
    return res.json({post, postProp});
  }).catch(err => {
    return res.json(err);
  });


  // return res.json(post);
});

routes.delete("/posts/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);

  await post.remove();

  return res.send();
});

module.exports = routes;
