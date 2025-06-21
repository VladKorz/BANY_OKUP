<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import TransactionList from '../components/TransactionList.vue'
import TransactionForm from '../components/TransactionForm.vue'
import ROICard from '../components/ROICard.vue'
import { useTransactionStore } from '../stores/transaction'

const transactionStore = useTransactionStore()
const showForm = ref(false)

const toggleForm = () => {
  showForm.value = !showForm.value
}

onMounted(async () => {
  await transactionStore.fetchTransactions()
})
</script>

<template>
  <div class="dashboard">
    <header>
      <h1>Окуп баньки</h1>
    </header>
    
    <main>
      <ROICard />
      
      <div class="transactions-section">
        <div class="section-header">
          <h2>История операций</h2>
          <button class="btn-add" @click="toggleForm">
            {{ showForm ? 'Закрыть' : 'Добавить запись' }}
          </button>
        </div>
        
        <TransactionForm v-if="showForm" @close="toggleForm" />
        <TransactionList />
      </div>
    </main>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  margin-bottom: 2rem;
  text-align: center;
}

h1 {
  color: #8B7D6B;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

h2 {
  color: #8B7D6B;
  font-size: 1.5rem;
}

.btn-add {
  background-color: #D4BFA0;
  border: none;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-add:hover {
  background-color: #C4AF90;
}

.transactions-section {
  background-color: #E6DBC8;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(139, 125, 107, 0.1);
}

main {
  display: grid;
  gap: 2rem;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }
  
  h1 {
    font-size: 2rem;
  }
}
</style>