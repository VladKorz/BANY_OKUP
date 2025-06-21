import { defineStore } from 'pinia'
import axios from 'axios'

interface Transaction {
  id: number
  type: 'income' | 'expense'
  amount: number
  description: string
  createdAt: string
}

interface TransactionInput {
  type: 'income' | 'expense'
  amount: number
  description: string
}

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transactions: [] as Transaction[],
    bathPrice: 1500000, // Default price in rubles
    isLoading: false,
    error: null as string | null
  }),
  
  getters: {
    totalIncome: (state) => {
      return state.transactions
        .filter(t => t.type === 'income')
        .reduce((total, t) => total + t.amount, 0)
    },
    totalExpense: (state) => {
      return state.transactions
        .filter(t => t.type === 'expense')
        .reduce((total, t) => total + t.amount, 0)
    }
  },
  
  actions: {
    async fetchTransactions() {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await axios.get('http://localhost:3000/api/transactions')
        this.transactions = response.data
      } catch (error) {
        console.error('Error fetching transactions:', error)
        this.error = 'Failed to load transactions'
      } finally {
        this.isLoading = false
      }
    },
    
    async addTransaction(transaction: TransactionInput) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await axios.post('http://localhost:3000/api/transactions', transaction)
        this.transactions.unshift(response.data)
      } catch (error) {
        console.error('Error adding transaction:', error)
        this.error = 'Failed to add transaction'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    async deleteTransaction(id: number) {
      this.isLoading = true
      this.error = null
      
      try {
        await axios.delete(`http://localhost:3000/api/transactions/${id}`)
        this.transactions = this.transactions.filter(t => t.id !== id)
      } catch (error) {
        console.error('Error deleting transaction:', error)
        this.error = 'Failed to delete transaction'
      } finally {
        this.isLoading = false
      }
    },
    
    async updateBathPrice(price: number) {
      this.isLoading = true
      this.error = null
      
      try {
        await axios.post('http://localhost:3000/api/settings/bath-price', { price })
        this.bathPrice = price
      } catch (error) {
        console.error('Error updating bath price:', error)
        this.error = 'Failed to update bath price'
      } finally {
        this.isLoading = false
      }
    }
  }
})