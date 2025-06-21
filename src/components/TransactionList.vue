<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTransactionStore } from '../stores/transaction'

const transactionStore = useTransactionStore()
const filter = ref('all')

const filteredTransactions = computed(() => {
  if (filter.value === 'all') {
    return transactionStore.transactions
  } else {
    return transactionStore.transactions.filter(t => t.type === filter.value)
  }
})

const deleteTransaction = async (id: number) => {
  if (confirm('Вы уверены, что хотите удалить эту запись?')) {
    await transactionStore.deleteTransaction(id)
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}
</script>

<template>
  <div class="transaction-list">
    <div class="filters">
      <button 
        :class="{ active: filter === 'all' }" 
        @click="filter = 'all'"
      >
        Все
      </button>
      <button 
        :class="{ active: filter === 'income' }" 
        @click="filter = 'income'"
      >
        Доходы
      </button>
      <button 
        :class="{ active: filter === 'expense' }" 
        @click="filter = 'expense'"
      >
        Расходы
      </button>
    </div>
    
    <div v-if="filteredTransactions.length === 0" class="empty-state">
      Нет записей для отображения
    </div>
    
    <ul v-else class="transactions">
      <li 
        v-for="transaction in filteredTransactions" 
        :key="transaction.id"
        class="transaction-item"
        :class="transaction.type"
      >
        <div class="transaction-info">
          <div class="transaction-date">{{ formatDate(transaction.createdAt) }}</div>
          <div class="transaction-description">{{ transaction.description }}</div>
        </div>
        <div class="transaction-amount">
          {{ transaction.type === 'income' ? '+' : '-' }}
          {{ transaction.amount.toLocaleString() }} ₽
        </div>
        <button class="delete-btn" @click="deleteTransaction(transaction.id)">
          &times;
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.transaction-list {
  margin-top: 1rem;
}

.filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.filters button {
  background-color: #F5F0E6;
  border: 1px solid #D4BFA0;
  color: #8B7D6B;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filters button.active,
.filters button:hover {
  background-color: #D4BFA0;
  color: #fff;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #8B7D6B;
  font-style: italic;
}

.transactions {
  list-style: none;
  padding: 0;
  margin: 0;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #F5F0E6;
  transition: background-color 0.2s ease;
}

.transaction-item:hover {
  background-color: #F5F0E6;
}

.transaction-item.income .transaction-amount {
  color: #588157;
}

.transaction-item.expense .transaction-amount {
  color: #BC6C25;
}

.transaction-info {
  flex-grow: 1;
}

.transaction-date {
  font-size: 0.75rem;
  color: #8B7D6B;
  margin-bottom: 0.25rem;
}

.transaction-description {
  color: #8B7D6B;
}

.transaction-amount {
  font-weight: 600;
  margin: 0 1rem;
  text-align: right;
  min-width: 100px;
}

.delete-btn {
  background: none;
  border: none;
  color: #8B7D6B;
  font-size: 1.25rem;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s ease;
  padding: 0.25rem;
}

.delete-btn:hover {
  opacity: 1;
  color: #BC6C25;
}

@media (max-width: 768px) {
  .transaction-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    position: relative;
  }
  
  .transaction-amount {
    text-align: left;
    margin: 0;
  }
  
  .delete-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
}
</style>