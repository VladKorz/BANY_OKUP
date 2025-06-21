import { Sequelize } from 'sequelize'

// Create Sequelize instance with SQLite
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './bath_roi.sqlite',
  logging: false
})

// Test database connection
export const testConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connection has been established successfully.')
    return true
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    return false
  }
}