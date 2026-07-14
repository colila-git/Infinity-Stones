<script setup>
import Nav from './component/nav.vue'
import Header from './component/header.vue'

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'

const router = useRouter()

const registrations = ref([])

async function handleSignOut() {

  await signOut(auth)
  router.push('/mod-login')

}

async function loadRegistrations() {

  const idToken = await auth.currentUser.getIdToken()

  const response = await fetch(
    "http://localhost:3000/api/registrations",
    {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    }
  )

  const result = await response.json()

  if (result.success) {
    registrations.value = result.data
  }

}

async function approve(id) {

    const idToken = await auth.currentUser.getIdToken();

    const response = await fetch(
        `http://localhost:3000/api/registrations/${id}/approve`,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        }
    );

    const result = await response.json();

    if (!result.success) {
        alert(result.message);
        return;
    }

    await loadRegistrations();

}

async function reject(id) {

    const idToken = await auth.currentUser.getIdToken();

    const response = await fetch(
        `http://localhost:3000/api/registrations/${id}/reject`,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        }
    );

    const result = await response.json();

    if (!result.success) {
        alert(result.message);
        return;
    }

    await loadRegistrations();

}

onMounted(loadRegistrations)
</script>

<template>

  <div id="page-main" class="page">

    <Nav @sign-out="handleSignOut" />
    <Header />

    <div class="content-card">

      <h1>Student Event Registrations</h1>

      <div
        v-for="registration in registrations"
        :key="registration.id"
        class="application-card"
      >

        <h3>
          {{ registration.first_name }}
          {{ registration.last_name }}
        </h3>

        <p>{{ registration.email }}</p>

        <p><strong>Event:</strong> {{ registration.event_name }}</p>

        <p><strong>Status:</strong> {{ registration.status }}</p>

        <p>
            <strong>Registered:</strong>
            {{ new Date(registration.registered_at).toLocaleString() }}
        </p>

        <div
            v-if="registration.status === 'pending'"
            class="actions"
            >
            <button
                class="approve-btn"
                @click="approve(registration.id)"
            >
                Approve
            </button>

            <button
                class="reject-btn"
                @click="reject(registration.id)"
            >
                Reject
            </button>
        </div>

      </div>

    </div>

  </div>

</template>

<style scoped>
.page {
    min-height: 100vh;
    background: linear-gradient(160deg,#0d0f2b,#131640);
    color:white;
}

.content-card{
    padding:32px 24px;
}

.application-card{
    background:rgba(255,255,255,.06);
    border:1px solid rgba(255,255,255,.12);
    border-radius:12px;
    padding:18px;
    margin-bottom:16px;
}

.actions {
    margin-top: 12px;
    display: flex;
    gap: 10px;
}

.approve-btn,
.reject-btn {
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    cursor: pointer;
    color: white;
    font-weight: 600;
}

.approve-btn {
    background: #16a34a;
}

.reject-btn {
    background: #dc2626;
}

.approve-btn:hover {
    background: #15803d;
}

.reject-btn:hover {
    background: #b91c1c;
}
</style>