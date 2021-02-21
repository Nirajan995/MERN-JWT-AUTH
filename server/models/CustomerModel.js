import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Customer = mongoose.model("customer", customerSchema);

export default Customer;
