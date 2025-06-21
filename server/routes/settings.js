import Setting from '../models/Setting.js'
import { initSettings } from '../models/Setting.js'

export default async function (fastify, opts) {
  // Initialize settings
  await initSettings()
  
  // Get bath price
  fastify.get('/bath-price', async (request, reply) => {
    try {
      const bathPrice = await Setting.findOne({
        where: { key: 'bathPrice' }
      })
      
      if (!bathPrice) {
        return reply.code(404).send({ error: 'Bath price setting not found' })
      }
      
      return { price: parseInt(bathPrice.value, 10) }
    } catch (error) {
      reply.code(500).send({ error: 'Failed to fetch bath price' })
    }
  })
  
  // Update bath price
  fastify.post('/bath-price', {
    schema: {
      body: {
        type: 'object',
        required: ['price'],
        properties: {
          price: { type: 'number', minimum: 1 }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { price } = request.body
      
      const [bathPrice] = await Setting.findOrCreate({
        where: { key: 'bathPrice' },
        defaults: {
          value: price.toString()
        }
      })
      
      if (bathPrice.value !== price.toString()) {
        bathPrice.value = price.toString()
        await bathPrice.save()
      }
      
      return { price }
    } catch (error) {
      reply.code(400).send({ 
        error: 'Failed to update bath price', 
        details: error.message 
      })
    }
  })
}