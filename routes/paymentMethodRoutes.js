import express from 'express';
import  UserPaymentMethod  from '../models/UserPaymentMethod.js'; // Sequelize model

const router = express.Router();

// Get all methods for a user
router.get('/payment-methods/:userId', async (req, res) => {
  try {
    const methods = await UserPaymentMethod.findAll({
      where: { userId: req.params.userId }
    });
    res.json(methods);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new method
router.post('/payment-methods', async (req, res) => {
  try {
    const { userId, name, icon, type } = req.body;
    const newMethod = await UserPaymentMethod.create({ userId, name, icon, type });
    res.status(201).json(newMethod);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// (Optional) Delete a method
router.delete('/payment-methods/:id', async (req, res) => {
  try {
    const deleted = await UserPaymentMethod.destroy({
      where: { id: req.params.id }
    });
    res.json({ success: !!deleted });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
