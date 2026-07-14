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

    await signOut(auth);

    router.push('/mod-login');

}

async function loadRegistrations() {

    const idToken = await auth.currentUser.getIdToken();

    const response = await fetch(
        "http://localhost:3000/api/registrations",
        {
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        }
    );

    const result = await response.json();

    if (result.success) {
        registrations.value = result.data;
    }

}

onMounted(() => {
    loadRegistrations();
});

</script>

<template>
    <div id="page-main" class="page">
        <Nav @sign-out="handleSignOut" />
        <Header />

        <div class="content-card">

            <h1>Student Registrations</h1>

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
                    Registered:
                    {{ new Date(registration.registered_at).toLocaleString() }}
                </p>

            </div>

        </div>
    </div>
</template>

<style scoped>
.page {
    min-height: 100vh;
    background: linear-gradient(160deg, #0d0f2b 0%, #131640 100%);
    color: #ffffff;
}

.content-card {
    padding: 32px 24px;
}

h1 {
    margin-bottom: 12px;
}

p {
    color: #d6d9f5;
}

.application-card {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 12px;
    padding: 18px;
    margin-bottom: 16px;
}

.application-card h3 {
    margin-bottom: 8px;
}

.application-card p {
    margin: 4px 0;
}
</style>
