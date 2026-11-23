<script setup lang="ts">
    import { useWalletStore } from '~/stores/wallet';
    const wallet = useWalletStore();
    const type = ref('deposit');
    const amount = ref(0);
    const message = ref('');
    const saving = ref(false);
    const confirming = ref(false);

    async function handleSubmit() {
        if (saving.value) return;

        message.value = '' ;
        saving.value = true ;

        try {
            await wallet.createTransactions(type.value, amount.value);
            confirming.value = false;
            message.value = 'บันทึกสำเร็จ';
        } catch {
            message.value = 'บันทึกไม่ได้ กรุณาตรวจจำนวนเงินและการเข้าสู่ระบบ';
        } finally {
            saving.value = false;
        }
    }

    function openComfirm(selectedType: string) {   
      type.value = selectedType;
      message.value = '';
      confirming.value = true;
    }

</script>
<template>
  <section>
    <form @submit.prevent="openComfirm(type)">
      <label for="transaction-amount">จำนวนเงิน</label>
      <input
        id="transaction-amount"
        v-model.number="amount"
        type="number"
        min="0"
        max="100000"
        step="0.01"
        required
      />

      <button
        class="deposit-button"
        type="submit"
        :disabled="saving"
        @click="type = 'deposit'"
        @submit.prevent
      >
        ฝาก
      </button>

      <button
        class="withdraw-button"
        type="submit"
        :disabled="saving"
        @click="type = 'withdraw'"
      >
        ถอน
      </button>
    </form>

    <p>{{ message }}</p>

    <div v-if="confirming" class="modal-backdrop">
      <div class="modal">
        <h3>ยืนยันการ{{ type === 'deposit' ? 'ฝาก' : 'ถอน' }}</h3>
        <p>จำนวนเงิน {{ amount }} บาท</p>

        <button type="button" :disabled="saving" @click="handleSubmit">
          ยืนยัน
        </button>
        <button type="button" :disabled="saving" @click="confirming = false">
          ยกเลิก
        </button>
      </div>
    </div>
  </section>
</template>
<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 40%);
  display: grid;
  place-items: center;
  z-index: 10;
}

.modal {
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: min(360px, 90vw);
  box-sizing: border-box;
}
form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

input {
  width: 180px;
  max-width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 16px;
}

.deposit-button,
.withdraw-button {
  padding: 10px 24px;
  border: 0;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}

.deposit-button {
  background: #16a34a;
}

.withdraw-button {
  background: #dc2626;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.modal {
  width: min(420px, 100%);
  max-height: calc(100dvh - 40px);
  overflow-y: auto;
  padding: 28px;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgb(0 0 0 / 15%);
  text-align: center;
}

.modal-backdrop {
  z-index: 100;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
}

.modal h3 {
  margin: 0 0 20px;
  font-size: 22px;
}

.modal p {
  margin: 16px 0 24px;
  font-size: 18px;
  line-height: 1.6;
}

.modal button {
  padding: 10px 20px;
  margin: 4px;
  border: 0;
  border-radius: 6px;
  background: #2563eb;
  color: white;
  font: inherit;
  font-size: 14px;
  cursor: pointer;
}

.modal button:last-child {
  background: #e2e8f0;
  color: #334155;
}

.modal button:hover {
  filter: brightness(0.95);
}

.modal button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  form {
    gap: 10px;
  }

  form label {
    width: 100%;
  }

  form input {
    width: 100%;
  }

  .modal {
    padding: 20px;
  }
}
</style>