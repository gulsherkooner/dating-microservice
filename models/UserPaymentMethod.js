import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // adjust the path if needed

const UserPaymentMethod = sequelize.define('UserPaymentMethod', {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING, // e.g., Visa...2463
  },
  icon: {
    type: DataTypes.STRING, // icon path or label
  },
  type: {
    type: DataTypes.STRING, // 'card' | 'netbanking'
  }
}, {
  timestamps: true,
  tableName: 'user_payment_method',
});

export default UserPaymentMethod;
