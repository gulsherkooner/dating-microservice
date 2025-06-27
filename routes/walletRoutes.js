import express from 'express';
import { UserWallet, WalletTransaction } from '../models/UserWallet.js';
import { Op } from 'sequelize';
import ChatPermission from '../models/ChatPermission.js';
const router = express.Router();

// 🟢 Top-up wallet
router.post('/wallet/topup', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { amount, method } = req.body;

    if (!userId || !amount || !method) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    let userWallet = await UserWallet.findOne({ where: { userId } });
    if (!userWallet) {
      userWallet = await UserWallet.create({ userId, balance: 0 });
    }

    userWallet.balance += amount;
    await userWallet.save();

    await WalletTransaction.create({
      userWalletId: userWallet.id,
      title: `Wallet Top-Up (${method})`,
      amount,
      date: new Date(),
    });

    const updatedWallet = await UserWallet.findOne({
      where: { userId },
      include: [{ model: WalletTransaction, as: 'transactions' }],
    });

    res.json(updatedWallet);
  } catch (err) {
    console.error('Top-up failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 🟡 Get wallet by user ID
router.get('/wallet/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    let wallet = await UserWallet.findOne({
      where: { userId },
      include: [{ model: WalletTransaction, as: 'transactions' }],
    });

    if (!wallet) {
      wallet = await UserWallet.create({ userId, balance: 0 });
    }

    res.json(wallet);
  } catch (err) {
    console.error('Fetch wallet failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 🔴 Deduct wallet amount
router.post('/wallet/deduct', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { amount, purpose, targetUserId } = req.body;

    if (!userId || !amount || !targetUserId) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const wallet = await UserWallet.findOne({ where: { userId } });

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found." });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ error: "Insufficient funds." });
    }

    // Deduct balance
    wallet.balance -= amount;
    await wallet.save();

    // Log transaction
    await WalletTransaction.create({
      userWalletId: wallet.id,
      title: purpose || "Service Deduction",
      amount: -amount,
      date: new Date(),
    });

    // ✅ FIXED: Use userId from header
    await ChatPermission.findOrCreate({
      where: {
        fromUserId: userId,
        toUserId: targetUserId,
      },
    });

    const updatedWallet = await UserWallet.findOne({
      where: { userId },
      include: [{ model: WalletTransaction, as: 'transactions' }],
    });

    res.json({ success: true, wallet: updatedWallet });
  } catch (err) {
    console.error("Deduction failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;
