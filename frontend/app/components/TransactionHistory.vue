<script setup lang="ts">
    const wallet = useWalletStore();
    const editingId = ref<number | null>(null);
    const editAmount = ref(0);
    const saving = ref(false);
    const editError = ref('');

    function openEdit(id: number, amount: number) {
      editingId.value = id;
      editAmount.value = amount;
    }

    async function saveEdit() {
      if ( editingId.value === null || saving.value) return;
      
      saving.value = true;
      editError.value = '';

      try {
        await wallet.updateTransactions(editingId.value, editAmount.value);
        editingId.value = null ;
      }catch {
        editError.value = 'แก้ไขไม่ได้ กรุณาลองอีกครั้ง';
      } finally {
        saving.value = false;
      }
    }

    const deletingId = ref<number | null>(null);
    const deleting = ref(false);
    const deleteError = ref('');
    
    async function confirmDelete() {
      if (deletingId.value === null || deleting.value) return;
    
      deleting.value = true;
      deleteError.value = '';
    
      try {
        await wallet.deleteTransaction(deletingId.value);
        deletingId.value = null;
      } catch {
        deleteError.value = 'ลบไม่ได้ อาจทำให้ยอดเงินติดลบ';
      } finally {
        deleting.value = false;
      }
    }

</script>
<template>
  <section>
    <h2>ประวัติรายการฝากถอน</h2>

    <table>
      <thead>
        <tr>
          <th>วันเวลา</th>
          <th>จำนวนเงิน</th>
          <th>ประเภท</th>
          <th class="email-column">อีเมล</th>
          <th>จัดการ</th>
          <th>ลบข้อมูล</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in wallet.transactions" :key="item.id">
          <td>{{ new Date(item.created_at).toLocaleString('th-TH') }}</td>
          <td>{{ item.amount }}</td>
          <td>{{ item.type === 'deposit' ? 'ฝาก' : 'ถอน' }}</td>
          <td class="email-column">{{ item.email }}</td>
          <td>
          <button type="button" @click="openEdit(item.id, item.amount)">
          Edit
          </button>
          </td>
          <td>
            <button type="button" @click="deletingId = item.id; deleteError = ''">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <p>ทั้งหมด {{ wallet.transactions.length }} รายการ</p>
    <div v-if="editingId !== null" class="modal-backdrop">
      <form class="modal" @submit.prevent="saveEdit">
        <h3>แก้ไขจำนวนเงิน</h3>
        <label for="edit-amount">จำนวนเงิน</label>
        <input
        id="edit-amount"
        v-model.number="editAmount"
        type="number"
        min="0"
        max="100000"
        step="0.01"
        required
        />

        <p>{{ editError }}</p>

        <button type="submit" :disabled="saving">ยืนยัน</button>
        <button
          type="button"
          :disabled="saving"
          @click="editingId = null"
        >
        ยกเลิก
        </button>
      </form>
    </div>
    <div v-if="deletingId !== null" class="modal-backdrop">
      <div class="modal">
        <h3>ยืนยันการลบ</h3>
        <p>ต้องการลบรายการนี้หรือไม่?</p>
        <p>{{ deleteError }}</p>
      
        <button
        type="button"
        :disabled="deleting"
        @click="confirmDelete"
        >
        ยืนยัน
        </button>
      
        <button
        type="button"
        :disabled="deleting"
        @click="deletingId = null"
        >
        ยกเลิก
        </button>
      </div>
    </div>
  </section>
</template>
<style scoped>
section {
  max-width: 1100px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 24px;
  font-size: 24px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

th,
td {
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  text-align: left;
}

th {
  background: #eef2f6;
  font-size: 14px;
  white-space: nowrap;
}

tbody tr:hover {
  background: #f8fafc;
}

button {
  padding: 8px 14px;
  border: 0;
  border-radius: 6px;
  background: #2563eb;
  color: white;
  font: inherit;
  font-size: 14px;
  cursor: pointer;
}

tbody td:last-child button {
  background: #dc2626;
}

button:hover {
  filter: brightness(0.95);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  background: rgb(0 0 0 / 40%);
}

.modal {
  width: min(420px, 100%);
  max-height: calc(100dvh - 40px);
  overflow-y: auto;
  padding: 28px;
  box-sizing: border-box;
  border-radius: 12px;
  background: white;
  box-shadow: 0 20px 60px rgb(0 0 0 / 15%);
}

.modal h3 {
  margin: 0 0 20px;
  font-size: 22px;
}

.modal label {
  display: block;
  margin-bottom: 8px;
}

.modal input {
  width: 100%;
  padding: 10px 12px;
  box-sizing: border-box;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font: inherit;
}

.modal input:focus {
  outline: 2px solid #93c5fd;
  border-color: #2563eb;
}

.modal p {
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.modal button {
  margin-top: 12px;
  margin-right: 8px;
}

.modal button:last-child {
  color: #334155;
  background: #e2e8f0;
}

@media (max-width: 768px) {
  .email-column {
    display: none;
  }

  h2 {
    font-size: 20px;
  }

  th,
  td {
    padding: 10px 8px;
    font-size: 13px;
  }

  button {
    padding: 8px 10px;
    font-size: 13px;
  }

  .modal {
    padding: 20px;
  }
}
</style>