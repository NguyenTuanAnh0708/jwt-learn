import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(morgan());
// parse application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
const books = [
  {
    id: 1,
    name: "Chi Pheo",
    author: "Ngo Tat To",
  },
  {
    id: 2,
    name: "Chien Tranh Va Hoa Binh",
    author: "ACB",
  },
];
// MIDELWARE
const authenToken = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];
  // bear token
  const token = authorizationHeader.split(" ")[1];
  if (!token) res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    if (err) {
      res.sendStatus(403);
    }
    next();
  });
};
// routers

app.get("/books", authenToken, (req, res) => {
  res.status(200).json({ books });
});
app.listen(PORT, () => {
  console.log("Server is running port " + PORT);
});
