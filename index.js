import express from "express";
const app = express();
const PORT = process.env.PORT || 5000;
app.use("/", (req, res) => {
  res.status(200).json({
    status: "Sucess",
  });
});
app.listen(PORT, () => {
  console.log("server is running port" + PORT);
});
