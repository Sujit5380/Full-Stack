// POST /transfer
app.post("/transfer", async (req, res) => {
  const { senderId, receiverId, amount } = req.body;

  if (!senderId || !receiverId || !amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    // Step 1: Fetch sender and receiver
    const sender = await Account.findOne({ userId: senderId });
    const receiver = await Account.findOne({ userId: receiverId });

    if (!sender || !receiver) {
      return res.status(404).json({ error: "Sender or receiver not found" });
    }

    // Step 2: Validate balance
    if (sender.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Step 3: Deduct from sender
    const senderUpdate = await Account.updateOne(
      { userId: senderId, balance: { $gte: amount } }, // conditional update
      { $inc: { balance: -amount } }
    );

    // Step 4: If deduction fails, abort
    if (senderUpdate.modifiedCount === 0) {
      return res.status(400).json({ error: "Failed to deduct balance" });
    }

    // Step 5: Credit to receiver
    const receiverUpdate = await Account.updateOne(
      { userId: receiverId },
      { $inc: { balance: amount } }
    );

    // Step 6: If receiver update fails, roll back manually
    if (receiverUpdate.modifiedCount === 0) {
      await Account.updateOne({ userId: senderId }, { $inc: { balance: amount } });
      return res.status(500).json({ error: "Transfer failed, rolled back" });
    }

    res.json({ message: "Transfer successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
