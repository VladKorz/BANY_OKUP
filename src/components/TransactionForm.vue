<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useTransactionStore } from '../stores/transaction'

const emit = defineEmits(['close'])
const transactionStore = useTransactionStore()

const schema = yup.object({
  type: yup.string().oneOf(['income', 'expense'], 'Выберите тип операции').required('Тип операции обязателен'),
  amount: yup.number().positive('Сумма должна быть положительной').required('Сумма обязательна'),
  description: yup.string().required('Описание обязательно').max(100, 'Описание не должно превышать 100 символов')
})

const { handleSubmit, errors, values, defineField } = useForm({
  validationSchema: schema,
  initialValues: {
    type: 'income',
    amount: '',
    description: ''
  }
})

const [type, typeAttrs] = defineField('type')
const [amount, amountAttrs] = defineField('amount')
const [description, descriptionAttrs] = defineField('description')

const isSubmitting = ref(false)

const onSubmit = handleSubmit(async (values) => {
  try {
    isSubmitting.value = true
    await transactionStore.addTransaction({
      type: values.type,
      amount: Number(values.amount),
      description: values.description
    })
    emit('close')
  } catch (error) {
    console.error('Error adding transaction:', error)
  } finally {
    isSubmitting.value = false
  }
})
</script>

<template>
  <div class="transaction-form">
    <h3>Добавить новую запись</h3>
    
    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label>Тип операции</label>
        <div class="type-selector">
          <label class="radio-label">
            <input 
              type="radio" 
              name="type" 
              value="income"
              v-model="type"
            />
            <span>Доход</span>
          </label>
          <label class="radio-label">
            <input 
              type="radio" 
              name="type" 
              value="expense"
              v-model="type"
            />
            <span>Расход</span>
          </label>
        </div>
        <div class="error" v-if="errors.type">{{ errors.type }}</div>
      </div>
      
      <div class="form-group">
        <label for="amount">Сумма (₽)</label>
        <input 
          id="amount"
          type="number" 
          v-model="amount"
          placeholder="0"
          step="0.01"
        />
        <div class="error" v-if="errors.amount">{{ errors.amount }}</div>
      </div>
      
      <div class="form-group">
        <label for="description">Описание</label>
        <input 
          id="description"
          type="text" 
          v-model="description"
          placeholder="Например: Аренда бани"
        />
        <div class="error" v-if="errors.description">{{ errors.description }}</div>
      </div>
      
      <div class="form-actions">
        <button type="button" class="btn-cancel" @click="emit('close')">Отмена</button>
        <button type="submit" class="btn-submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Сохранение...' : 'Сохранить' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.transaction-form {
  background-color: #F5F0E6;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

h3 {
  margin: 0 0 1.5rem;
  color: #8B7D6B;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #8B7D6B;
  font-weight: 600;
}

input[type="text"],
input[type="number"] {
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #D4BFA0;
  background-color: #fff;
  color: #8B7D6B;
  font-size: 1rem;
}

input[type="text"]:focus,
input[type="number"]:focus {
  outline: none;
  border-color: #C4AF90;
  box-shadow: 0 0 0 2px rgba(196, 175, 144, 0.2);
}

.type-selector {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 0.5rem;
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio-label input {
  margin-right: 0.5rem;
}

.error {
  color: #BC6C25;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel {
  background-color: transparent;
  border: 1px solid #D4BFA0;
  color: #8B7D6B;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background-color: #F5F0E6;
}

.btn-submit {
  background-color: #D4BFA0;
  border: none;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-submit:hover {
  background-color: #C4AF90;
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>