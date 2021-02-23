import express from "express";
import Customer from "../models/CustomerModel.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { name } = req.body;

    const newCustomer = new Customer({ name });
    const savedCustomer = await newCustomer.save();
    res.send(savedCustomer);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});
router.get("/", auth, async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});
export default router;
