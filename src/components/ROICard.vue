<script setup lang="ts">
import { computed } from 'vue'
import { useTransactionStore } from '../stores/transaction'

const transactionStore = useTransactionStore()

const bathPrice = computed(() => transactionStore.bathPrice)
const totalIncome = computed(() => transactionStore.totalIncome)
const totalExpense = computed(() => transactionStore.totalExpense)
const currentBalance = computed(() => totalIncome.value - totalExpense.value)
const roiPercentage = computed(() => {
  if (bathPrice.value === 0) return 0
  return Math.round((currentBalance.value / bathPrice.value) * 100)
})
</script>

<template>
  <div class="roi-card">
    <div class="price-section">
      <h3>Стоимость баньки</h3>
      <div class="price">{{ bathPrice.toLocaleString() }} ₽</div>
    </div>
    
    <div class="progress-section">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: `${Math.min(roiPercentage, 100)}%` }"
          :class="{ 'complete': roiPercentage >= 100 }"
        ></div>
      </div>
      <div class="roi-stats">
        <div class="roi-percentage">{{ roiPercentage }}%</div>
        <div class="roi-amount">{{ currentBalance.toLocaleString() }} ₽ из {{ bathPrice.toLocaleString() }} ₽</div>
      </div>
    </div>
    
    <div class="summary">
      <div class="summary-item income">
        <div class="label">Доходы</div>
        <div class="value">{{ totalIncome.toLocaleString() }} ₽</div>
      </div>
      <div class="summary-item expense">
        <div class="label">Расходы</div>
        <div class="value">{{ totalExpense.toLocaleString() }} ₽</div>
      </div>
      <div class="summary-item balance">
        <div class="label">Баланс</div>
        <div class="value">{{ currentBalance.toLocaleString() }} ₽</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.roi-card {
  background-color: #E6DBC8;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(139, 125, 107, 0.1);
}

h3 {
  margin: 0 0 0.5rem;
  color: #8B7D6B;
  font-size: 1.25rem;
}

.price-section {
  margin-bottom: 1.5rem;
  text-align: center;
}

.price {
  font-size: 2rem;
  font-weight: 700;
  color: #8B7D6B;
}

.progress-section {
  margin-bottom: 1.5rem;
}

.progress-bar {
  height: 24px;
  background-color: #F5F0E6;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background-color: #A3B18A;
  transition: width 0.5s ease-in-out;
}

.progress-fill.complete {
  background-color: #588157;
}

.roi-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.roi-percentage {
  font-size: 1.25rem;
  font-weight: 700;
  color: #588157;
}

.roi-amount {
  color: #8B7D6B;
}

.summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.summary-item {
  text-align: center;
  padding: 0.75rem;
  border-radius: 8px;
  background-color: #F5F0E6;
}

.summary-item.income .value {
  color: #588157;
}

.summary-item.expense .value {
  color: #BC6C25;
}

.summary-item.balance .value {
  color: #8B7D6B;
  font-weight: 700;
}

.label {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  color: #8B7D6B;
}

.value {
  font-weight: 600;
  font-size: 1.125rem;
}

@media (max-width: 768px) {
  .summary {
    grid-template-columns: 1fr;
  }
}
</style>