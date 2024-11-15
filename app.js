require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./config/swagger-output.json");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 3000;
const baseUrl = process.env.BASE_URL;
const authRouter = require("./routes/auth.route");
const menuRouter = require("./routes/menu.route");
const cartRouter = require("./routes/cart.route");
const orderRouter = require("./routes/order.route");
const mapRouter = require("./routes/maps.route");
const userRouter = require("./routes/user.route");
const dashboardRouter = require("./routes/dashboard.route");

app.use(cookieParser());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.listen(port, () => {
  console.log(`server runing in ${baseUrl}:${port}`);
});

app.get("/", (req, res) => {
  return res.send("Hello World");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/auth", authRouter);
app.use("/menu", menuRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/maps", mapRouter);
app.use("/user", userRouter);
app.use("/dashboard", dashboardRouter);
