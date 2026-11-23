import { defineStore } from "pinia";
export const useWalletStore = defineStore('wallet', () => {
    const balance = ref(0);
    const transactions = ref<{
        id: number,
        type: string,
        amount: number,
        created_at: string,
        email: string,
    }[]>([])

    async function fetchBalance() {
        const token = localStorage.getItem('access_token');

        const result = await $fetch<{ balance: number }>(
            'http://localhost:3000/balance',
            {
                headers: {
                    Authorization:`Bearer ${token}`
                }
            }
        );
        balance.value = result.balance;
    }

    async function createTransactions(type: string, amount: number) {
        const token = localStorage.getItem('access_token');

        await $fetch('http://localhost:3000/transactions' , {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: {type, amount}
        });
        await fetchBalance();
        await fetchTransactions();
    }

    async function fetchTransactions() {
        const token = localStorage.getItem('access_token');
        transactions.value = await $fetch<typeof transactions.value> (
            'http://localhost:3000/transactions', 
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    }

    async function updateTransactions(id: number, amount: number) {
        const token = localStorage.getItem('access_token');

        await $fetch(`http://localhost:3000/transactions/${id}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: { amount }
        });
        await fetchBalance();
        await fetchTransactions();
    }
    
    async function deleteTransaction(id: number) {
    const token = localStorage.getItem('access_token');

    await $fetch(`http://localhost:3000/transactions/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    await fetchBalance();
    await fetchTransactions();
    }
    
    return {balance, fetchBalance, createTransactions, fetchTransactions, transactions, updateTransactions, deleteTransaction}
})