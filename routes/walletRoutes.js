import express from 'express';
import { UserWallet, WalletTransaction } from '../models/UserWallet.js'; // Sequelize models

const router = express.Router();

// Add money to wallet
router.post('/wallet/topup', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { amount, method } = req.body;

    if (!userId || !amount || !method) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Find or create wallet
    let userWallet = await UserWallet.findOne({ where: { userId } });
    if (!userWallet) {
      userWallet = await UserWallet.create({ userId, balance: 0 });
    }

    // Update balance
    userWallet.balance += amount;
    await userWallet.save();

    // Add transaction
    await WalletTransaction.create({
      userWalletId: userWallet.id,
      title: `Wallet Top-Up (${method})`,
      amount,
      date: new Date()
    });

    // Fetch updated wallet with transactions
    const updatedWallet = await UserWallet.findOne({
      where: { userId },
      include: [WalletTransaction]
    });

    res.json(updatedWallet);
  } catch (err) {
    console.error('Top-up failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get wallet info
router.get('/wallet/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    let wallet = await UserWallet.findOne({
      where: { userId },
      include: [WalletTransaction]
    });

    if (!wallet) {
      wallet = await UserWallet.create({ userId, balance: 0 });
    }

    res.json(wallet);
  } catch (err) {
    console.error('Fetch or create wallet error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Deduct from wallet
router.post('/wallet/deduct', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { amount, purpose } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const wallet = await UserWallet.findOne({ where: { userId } });

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found." });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ error: "Insufficient funds." });
    }

    wallet.balance -= amount;
    await wallet.save();

    await WalletTransaction.create({
      userWalletId: wallet.id,
      title: purpose || "Service Deduction",
      amount: -amount,
      date: new Date()
    });

    const updatedWallet = await UserWallet.findOne({
      where: { userId },
      include: [WalletTransaction]
    });

    res.json({ success: true, wallet: updatedWallet });
  } catch (err) {
    console.error("Deduction failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
