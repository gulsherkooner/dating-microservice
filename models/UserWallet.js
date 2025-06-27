import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

// Wallet table
const UserWallet = sequelize.define('UserWallet', {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  balance: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  }
}, {
  timestamps: true,
  tableName: 'user_wallet',
});

// ✅ Fix: Add ID with autoIncrement
const WalletTransaction = sequelize.define('WalletTransaction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userWalletId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: UserWallet,
      key: 'id',
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
}, {
  timestamps: true,
  tableName: 'wallet_transaction',
});

// Associations
UserWallet.hasMany(WalletTransaction, { foreignKey: 'userWalletId', as: 'transactions' });
WalletTransaction.belongsTo(UserWallet, { foreignKey: 'userWalletId', as: 'wallet' });

export { UserWallet, WalletTransaction };
