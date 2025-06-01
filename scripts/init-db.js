import sequelize from "../config/db.js";
import dotenv from 'dotenv';
dotenv.config();

// Import all models so Sequelize is aware of them
import DatingProfile from "../models/DatingProfile.js";
import { UserWallet, WalletTransaction } from "../models/UserWallet.js";
import UserPaymentMethod from "../models/UserPaymentMethod.js";
import Settings from "../models/settings.js";
import DatingPost from "../models/datingPost.js";
// Add any other models you have here

async function initDb() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to PostgreSQL");

    // This will create all tables for all imported models
    await sequelize.sync({ force: true }); // Drops and recreates all tables
    console.log("✅ All tables created successfully");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    process.exit(1);
  }
}

initDb();
