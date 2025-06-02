import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // adjust the path if needed

const UserWallet = sequelize.define('UserWallet', {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  balance: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  }
}, {
  timestamps: true,
  tableName: 'user_wallet',
});

// Transaction model (one-to-many with UserWallet)
const WalletTransaction = sequelize.define('WalletTransaction', {
  userWalletId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: UserWallet,
      key: 'id'
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
