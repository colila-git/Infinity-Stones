<script setup>
import Header from '../../../components/header.vue'
import { ref, onMounted } from 'vue'
import { auth } from '../../firebase'

const registrations = ref([])

async function loadMyRegistrations() {

  const idToken = await auth.currentUser.getIdToken()

  const response = await fetch(
    "http://localhost:3000/api/registrations/my",
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

onMounted(loadMyRegistrations)
</script>

<template>
  <div class="page">
    <Header />

    <div class="content">

      <h1>My Registrations</h1>

      <div
        v-for="registration in registrations"
        :key="registration.id"
        class="registration-card"
      >

        <h3>{{ registration.event_name }}</h3>

        <p>Status: {{ registration.status }}</p>

        <p>
          Registered:
          {{ new Date(registration.registered_at).toLocaleString() }}
        </p>

      </div>

      <p
        v-if="registrations.length === 0"
      >
        You haven't registered for any events yet.
      </p>

    </div>
  </div>
</template>

<style scoped>
.page{
    min-height:100vh;
    background:linear-gradient(160deg,#0d0f2b,#131640);
    color:white;
}

.content{
    padding:30px;
}

.registration-card{
    background:rgba(255,255,255,.06);
    border:1px solid rgba(255,255,255,.12);
    border-radius:12px;
    padding:18px;
    margin-bottom:16px;
}

.registration-card h3{
    margin-bottom:8px;
}

.registration-card p{
    color:#d6d9f5;
    margin:4px 0;
}
</style>