import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT_SERVER_AUTH || 5500;
app.use(morgan());
// parse application/x-www-form-urlencoded
app.use(bodyParser.json());
// parse application/json
app.use(bodyParser.urlencoded({ extended: false }));
// FAKE DB REFRESH TOKEN
const refreshTokens = [];
// routers
app.post("/login", (req, res) => {
  const dataUser = req.body;
  const accessToken = jwt.sign(dataUser, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30s",
  });
  const refreshToken = jwt.sign(dataUser, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.status(200).json({ accessToken, refreshToken });
});
app.post("/refreshToken", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
    const accessToken = jwt.sign(
      { name: data.name, password: data.password },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    res.status(200).json({ accessToken });
  });
});
app.listen(PORT, () => {
  console.log("Server Auth is running port " + PORT);
});
