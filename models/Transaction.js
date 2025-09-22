import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  date: { type: String, required: true },
  type: { type: String, enum: ["income", "expense", "cost"], required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  note: { type: String }
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);
