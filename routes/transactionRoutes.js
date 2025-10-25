import express from "express";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// ดึงข้อมูลทั้งหมด
router.get("/", async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ error: "โปรดระบุ year และ month เช่น ?year=2025&month=1" });
    }

    // month จาก query อาจเป็น "1" หรือ "01" ให้แปลงเป็นเลขก่อน
    const monthInt = parseInt(month) - 1; // JavaScript Month index เริ่มที่ 0 = January

    const startDate = new Date(Date.UTC(parseInt(year), monthInt, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(parseInt(year), monthInt + 1, 1, 0, 0, 0));

    const transactions = await Transaction.find({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    }).sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// เพิ่มข้อมูลใหม่
router.post("/", async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// แก้ไขข้อมูล
router.put("/:id", async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ลบข้อมูล
router.delete("/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
