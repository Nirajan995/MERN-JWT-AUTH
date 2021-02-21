import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/UserRouter.js";
import customerRoutes from "./routes/CustomerRouter.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const CONNECTION_URL =
  "mongodb+srv://broCode:broCode123@cluster0.q2sik.mongodb.net/dev?retryWrites=true&w=majority";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`PORT running on ${PORT}`));

mongoose.connect(
  CONNECTION_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) return console.error(err);
    console.log(`MongoDB connected succesfully`);
  }
);

mongoose.set("useFindAndModify", false);

app.use("/auth", authRoutes);
app.use("/customer", customerRoutes);
