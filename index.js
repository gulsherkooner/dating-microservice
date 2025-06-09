import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import sequelize from './config/db.js';
import walletRoutes from './routes/walletRoutes.js';
import paymentMethodRoutes from './routes/paymentMethodRoutes.js';
import datingPostRoutes from './routes/datingPost.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import profileRoutes from './routes/profileRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import logger from './config/logger.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

sequelize.authenticate()
  .then(() => logger.info('Connected to PostgreSQL'))
  .catch((err) => {
    logger.error('PostgreSQL connection error:', err);
    process.exit(1);
  });

app.use('/api', walletRoutes);
app.use('/api', paymentMethodRoutes);
app.use('/api', datingPostRoutes);
app.use('/api', settingsRoutes);
app.use('/api', profileRoutes);
app.use('/api', matchRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
