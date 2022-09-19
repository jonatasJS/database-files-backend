const routes = require("express").Router();
const multer = require("multer");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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

    // verifica se os dados vindos do body estão preenchidos
    if (username === "" ||
        email === "" ||
        password === "" ||
        username === null ||
        email === null ||
        password === null) {
      return res.status(400).send({ error: "Preencha todos os campos!" });
    }

    // verificando se o email já existe
    const emailExists = await User.findOne({ email });
    const userExists = await User.findOne({ username });

    if (userExists || emailExists) {
      return res.status(400).send({ error: "User already exists" });
    }

    // Criar um novo usuário com a senha criptografada
    const user = await User.create({
      username,
      email: email,
      password: await bcrypt.hash(password, 10),
    });

    return res.json({
      user,
      token: user._id,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

routes.post("/authenticate", async (req, res) => {
  try {
    const { username, password } = req.body;

    // verifica se os dados vindos do body estão preenchidos
    if (username === "" ||
        password === "" ||
        username === null ||
        password === null) {
      return res.status(400).send({ error: "Preencha todos os campos!" });
    }
    
    const user = await User.findOne({ username }).select("+password");

    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }

    // Verificando se a senha está correta
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).send({ error: "Invalid password" });
    }
    
    user.password = undefined;
    
    return res.send({ user, token: user._id });
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

// tota para verificar se o token é válido
routes.post("/validatetoken", async (req, res) => {
  try {
    const { token } = req.body;
    
    const user = await User.findOne({ _id: token });

    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }

    return res.send({ user, token: user._id });
  } catch (err) {
    return res.status(400).send({ error: "Error authenticating user" });
  }
});

// envia email para redefinir a senha
routes.get("/resetpassword/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // verifica se os dados vindos do body estão preenchidos
    if (email === "" ||
        email === null) {
      return res.status(400).send({ error: "Preencha todos os campos!" });
    }

    // procura o usuário pelo email
    const user = await User.findOne({email});
    console.log(user);

    if (!user) {
      console.log(email)
      console.log(user);
      console.log("User not found");	
      return res.status(400).send({ error: "User not found" });
    }

    // envia email para o usuário
    const transporter = await nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
        method: "PLAIN",
        type: "custom",
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Redefinir senha",
      text: "Redefinir senha",
      html: `<p>Olá ${user.username},</p>
      <p>Para redefinir sua senha, clique no link abaixo:</p>
      <a href="http://localhost:3000/resetpassword/${user._id}">Redefinir senha</a>`,
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(400).send({ error: "Error sending email" });
      } else {

        return res.status(200).send({
          message: "Email enviado com sucesso!"
        });
      }
    });

    // return res.send({ message: "Email enviado com sucesso!" });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "Error authenticating user" });
  }
});

module.exports = routes;
