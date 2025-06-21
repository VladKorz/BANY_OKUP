import Transaction from '../models/Transaction.js'

export default async function (fastify, opts) {
  // Get all transactions
  fastify.get('/', async (request, reply) => {
    try {
      const transactions = await Transaction.findAll({
        order: [['createdAt', 'DESC']]
      })
      return transactions
    } catch (error) {
      reply.code(500).send({ error: 'Failed to fetch transactions' })
    }
  })
  
  // Get a specific transaction
  fastify.get('/:id', async (request, reply) => {
    try {
      const transaction = await Transaction.findByPk(request.params.id)
      
      if (!transaction) {
        return reply.code(404).send({ error: 'Transaction not found' })
      }
      
      return transaction
    } catch (error) {
      reply.code(500).send({ error: 'Failed to fetch transaction' })
    }
  })
  
  // Create a new transaction
  fastify.post('/', {
    schema: {
      body: {
        type: 'object',
        required: ['type', 'amount', 'description'],
        properties: {
          type: { type: 'string', enum: ['income', 'expense'] },
          amount: { type: 'number', minimum: 0.01 },
          description: { type: 'string', minLength: 1, maxLength: 100 }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const transaction = await Transaction.create(request.body)
      return transaction
    } catch (error) {
      reply.code(400).send({ 
        error: 'Failed to create transaction', 
        details: error.message 
      })
    }
  })
  
  // Delete a transaction
  fastify.delete('/:id', async (request, reply) => {
    try {
      const transaction = await Transaction.findByPk(request.params.id)
      
      if (!transaction) {
        return reply.code(404).send({ error: 'Transaction not found' })
      }
      
      await transaction.destroy()
      return { success: true }
    } catch (error) {
      reply.code(500).send({ error: 'Failed to delete transaction' })
    }
  })
}