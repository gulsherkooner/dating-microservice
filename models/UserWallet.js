import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // adjust path if needed

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

// Transaction model
const WalletTransaction = sequelize.define('WalletTransaction', {
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
