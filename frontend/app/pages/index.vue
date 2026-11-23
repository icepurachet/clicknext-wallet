<script setup lang="ts">
    import { useWalletStore } from '~/stores/wallet';
    const wallet = useWalletStore();

    const ready = ref(false);
    const activeMenu = ref('wallet');
    const menuOpen = ref(false);
    
    onMounted(async () => {
        const token = localStorage.getItem('access_token')

        if (!token) {
            await navigateTo('/login');
            return;
        }

        try {
            await $fetch('http://localhost:3000/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            await wallet.fetchBalance();
            await wallet.fetchTransactions();

            ready.value = true ;
        }   catch {
            localStorage.removeItem('access_token');
            await navigateTo('/login');
        }
    });
    
    async function handleLogout() {
        localStorage.removeItem('access_token');
        ready.value = false;
        await navigateTo('login');
    }
</script>

<template>
  <div v-if="ready" class="app">
    <header class="header">
      <button
        class="menu-toggle"
        type="button"
        @click="menuOpen = !menuOpen"
      >
        ☰
      </button>

      <strong>Clicknext</strong>
      <button type="button" @click="handleLogout">Logout</button>
    </header>

    <div class="layout">
      <nav class="sidebar" :class="{ open: menuOpen }">
        <button
          type="button"
          :class="{ active: activeMenu === 'wallet' }"
          @click="activeMenu = 'wallet'; menuOpen = false"
        >
          Deposit / Withdraw
        </button>

        <button
          type="button"
          :class="{ active: activeMenu === 'history' }"
          @click="activeMenu = 'history'; menuOpen = false"
        >
          Transaction
        </button>
      </nav>

      <main class="content">
        <div v-if="activeMenu === 'wallet'" class="wallet-panel">
          <h1>ฝาก / ถอนเงิน</h1>
          <p class="balance">ยอดคงเหลือ: {{ wallet.balance }} บาท</p>
          <TransactionForm />
        </div>

        <TransactionHistory v-else />
      </main>
    </div>
  </div>
</template>
<style scoped>
.app {
  min-height: 100vh;
  font-family: sans-serif;
  color: #222;
  background: #f5f6f8;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 24px;
  background: white;
  border-bottom: 1px solid #ddd;
}

.layout {
  display: flex;
  min-height: calc(100vh - 64px);
}

.sidebar {
  width: 220px;
  flex-shrink: 0;
  padding: 24px 12px;
  box-sizing: border-box;
  background: white;
  border-right: 1px solid #ddd;
}

.sidebar button {
  display: block;
  width: 100%;
  padding: 14px;
  margin-bottom: 8px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.sidebar button.active {
  color: white;
  background: #2563eb;
}

.content {
  flex: 1;
  min-width: 0;
  padding: 40px;
  overflow-x: auto;
}

.wallet-panel {
  max-width: 600px;
  margin: 40px auto;
  padding: 32px;
  border-radius: 10px;
  background: white;
  text-align: center;
}

.balance {
  margin-bottom: 32px;
  font-size: 22px;
}

.menu-toggle {
  display: none;
}

@media (max-width: 768px) {
    .menu-toggle {
      display: inline-block;
    }

    .layout {
      flex-direction: column;
    }

    .sidebar {
      display: none;
      width: 100%;
      border-right: 0;
    }

    .sidebar.open {
      display: block;
    }

    .content {
      padding: 16px;
    }

    .wallet-panel {
      margin: 16px auto;
      padding: 20px;
    }
    :global(body) {
      margin: 0;
    }

    .header,
    .wallet-panel {
      box-sizing: border-box;
    }
}
.header > button:last-child {
  padding: 9px 18px;
  border: 1px solid #dc2626;
  border-radius: 6px;
  background: white;
  color: #dc2626;
  font: inherit;
  font-size: 14px;
  cursor: pointer;
}

.header > button:last-child:hover {
  background: #fef2f2;
}

.header strong {
  font-size: 22px;
  color: #2563eb;
}

.menu-toggle {
  padding: 6px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  font-size: 22px;
  cursor: pointer;
}

.sidebar button {
  font: inherit;
  font-size: 14px;
}

.sidebar button:not(.active):hover {
  background: #eff6ff;
}

button:focus-visible {
  outline: 2px solid #93c5fd;
  outline-offset: 3px;
}

@media (max-width: 768px) {
  .header {
    position: sticky;
    top: 0;
    z-index: 30;
    padding: 0 16px;
  }

  .sidebar {
    position: fixed;
    top: 64px;
    bottom: 0;
    left: 0;
    z-index: 20;
    width: 240px;
    overflow-y: auto;
    border-right: 1px solid #e2e8f0;
    box-shadow: 8px 0 24px rgb(0 0 0 / 12%);
  }

  .sidebar.open {
    display: block;
  }
}
</style>