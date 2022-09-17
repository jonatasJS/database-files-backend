const routes = require("express").Router();
const multer = require("multer");
const bcrypt = require('bcrypt');

const multerConfig = require("./config/multer");

const { Post, User } = require("./models");

routes.get("/posts", async (req, res) => {
  const posts = await Post.find();

  return res.json(posts);
});

routes.post("/posts", multer(multerConfig).single("file"), async (req, res) => {
  try {
    const { originalusername, size, key, location: url = "" } = req.file;

    const post = await Post.create({
      username: originalusername,
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

routes.post("/registeruser", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // verificando se o email já existe
    const emailExists = await User.findOne({ email });
    const userExists = await User.findOne({ username });

    if (userExists || emailExists) {
      return res.status(400).send({ error: "User already exists" });
    }

    // Criar um novo usuário com a senha criptografada
    const user = await User.create({
      username,
      email: await bcrypt.hash(email, 10),
      password: await bcrypt.hash(password, 10),
    });

    return res.json({
      user,
      token: await bcrypt.hash(user.email, 10),
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

routes.post("/authenticate", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username }).select("+password");

    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }

    // Verificando se a senha está correta
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).send({ error: "Invalid password" });
    }
    
    user.password = undefined;
    
    return res.send({ user, token: await bcrypt.hash(user.email, 10) });
  } catch (err) {
    return res.status(400).send({ error: "Error authenticating user" });
  }
});

routes.get("/users", async (req, res) => {
  const users = await User.find();

  return res.json(users);
});

routes.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    return res.json(user);
  } catch (err) {
    return res.status(400).send({ error: "Error deleting user" });
  }
});

routes.delete("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    await user.remove();

    return res.send({
      message: "User removido com sucesso!"
    });
  } catch (err) {
    return res.status(400).send({ error: "Error deleting user", err });
  }
});

module.exports = routes;
