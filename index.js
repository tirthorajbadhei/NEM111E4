const express = require("express");
const { connect } = require("./db");

const { RegisterModel } = require("./model/register.model");
const { SocialModel } = require("./model/post.model");
const bcrypt = require("bcrypt");
const { auth } = require("./middleware/auth.middleware");
const jwt = require("jsonwebtoken");
const server = express();
const cors = require("cors");
server.use(express.json());
server.use(
  cors({
    origin: "*",
  })
);

server.get("/", (req, res) => {
  res.send("welcome");
});

server.post("/users/register", async (req, res) => {
  const { name, email, gender, password } = req.body;
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      // Store hash in your password DB.
      if (err) {
        console.log(err);
      } else {
        const newData = new RegisterModel({
          name,
          email,
          gender,
          password: hash,
        });
        await newData.save();
        res.send("registered");
      }
    });
  } catch (error) {
    console.log(error);
    res.send("enter all the details");
  }
});
server.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await RegisterModel.find({ email });
    if (user.length > 0) {
      bcrypt.compare(password, user[0].password, (err, result) => {
        // result == true
        if (result) {
          const token = jwt.sign({ name: "suvo" }, "suvo");
          res.send({ status: "login successful", token: token });
        } else {
          res.send("wrong entry");
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.send("wrong entry");
  }
});
server.use(auth);
server.post("/post", async (req, res) => {
  const data = req.body;
  try {
    const post = new SocialModel(data);
    await post.save();
    res.send("post added");
  } catch (error) {
    console.log(error);
    res.send("not able to  post ");
  }
});
server.patch("/posts/update/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  try {
    await SocialModel.findByIdAndUpdate({ _id: id }, data);
    res.send(`post is updated for user whos iD is: ${id}`);
  } catch (error) {
    res.send("something wrong");
  }
});
server.delete("/posts/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await SocialModel.findByIdAndDelete({ _id: id });
    res.send(`post is deleted for user whos iD is: ${id}`);
  } catch (error) {
    res.send("something wrong");
  }
});

server.listen(3500, async () => {
  try {
    await connect;
    console.log("mongoDb connected");
  } catch (error) {
    console.log(error);
  }
  console.log(`server running at port 3500`);
});
