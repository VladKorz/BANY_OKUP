import Fastify from 'fastify'
import cors from '@fastify/cors'
import { sequelize } from './db/database.js'
import transactionRoutes from './routes/transactions.js'
import settingsRoutes from './routes/settings.js'

const fastify = Fastify({
  logger: true
})

// Register CORS
await fastify.register(cors, {
  origin: '*'
})

// Register routes
fastify.register(transactionRoutes, { prefix: '/api/transactions' })
fastify.register(settingsRoutes, { prefix: '/api/settings' })

// Health check route
fastify.get('/health', async (request, reply) => {
  return { status: 'ok' }
})

// Start server
const start = async () => {
  try {
    // Sync database models
    await sequelize.sync()
    console.log('Database synchronized')
    
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()