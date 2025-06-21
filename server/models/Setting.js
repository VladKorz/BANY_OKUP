import { DataTypes } from 'sequelize'
import { sequelize } from '../db/database.js'

const Setting = sequelize.define('Setting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
})

// Initialize bath price setting if it doesn't exist
export const initSettings = async () => {
  const [bathPrice, created] = await Setting.findOrCreate({
    where: { key: 'bathPrice' },
    defaults: {
      value: '1500000' // Default bath price in rubles
    }
  })
  
  if (created) {
    console.log('Default bath price setting created')
  }
}

export default Setting