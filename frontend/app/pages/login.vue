<script setup lang="ts">
        const email = ref('');
        const password = ref('');
        const message = ref('')

        async function handleLogin() {
            message.value = ''

            try {
                const result = await $fetch<false | { access_token: string }>('http://localhost:3000/login', {
                    method : 'POST',
                    body: {
                        email: email.value,
                        password: password.value
                    }
                });

            if ( !result || typeof result !== 'object' || !result.access_token) {
                    message.value = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
                    return;
                }

                localStorage.setItem( 'access_token', result.access_token )
                message.value = 'เข้าสู่ระบบสำเร็จ'
                await navigateTo('/')
            } catch {
                message.value = 'เข้าสู่ระบบไม่ได้ กรุณาลองอีกครั้ง'
            }
        }
</script>
<template>
    <main>
        <h1>เข้าสู่ระบบ</h1>
        <form @submit.prevent="handleLogin">
            <div>
                <label for="email">อีเมล</label>
                <input id="email" v-model="email" type="email"required />
            </div>
            <div>
                <label for="password">รหัสผ่าน</label>
                <input id="password" v-model="password" type="password" required />
            </div>
            <button type="submit">เข้าสู่ระบบ</button>
        </form>
        <p> {{ message }}</p>
    </main>
</template>
<style scoped>
:global(body) {
  margin: 0;
}

main {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
  background: #f5f6f8;
  color: #222;
  font-family: sans-serif;
}

h1 {
  margin: 0 0 28px;
  font-size: 28px;
}

form {
  width: 100%;
  max-width: 360px;
  padding: 32px;
  box-sizing: border-box;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  box-shadow: 0 8px 24px rgb(0 0 0 / 5%);
}

form > div {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font: inherit;
}

input:focus {
  outline: 2px solid #bfdbfe;
  border-color: #2563eb;
}

button {
  width: 100%;
  padding: 12px;
  border: 0;
  border-radius: 6px;
  background: #2563eb;
  color: white;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

button:hover {
  background: #1d4ed8;
}

button:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 3px;
}

p {
  max-width: 360px;
  margin: 16px 0 0;
  text-align: center;
  font-size: 14px;
  line-height: 1.6;
}

p:empty {
  display: none;
}

@media (max-width: 480px) {
  form {
    padding: 24px;
  }

  h1 {
    font-size: 24px;
  }
}
</style>