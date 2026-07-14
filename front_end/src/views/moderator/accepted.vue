<script setup>
import Nav from './component/nav.vue'
import Header from './component/header.vue'

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'

const router = useRouter()

const moderators = ref([])

async function handleSignOut() {

    await signOut(auth);

    router.push('/mod-login');

}

async function loadAcceptedModerators() {

    const idToken = await auth.currentUser.getIdToken();

    const response = await fetch(
        "http://localhost:3000/api/moderators/accepted",
        {
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        }
    );

    const result = await response.json();

    if (result.success) {
        moderators.value = result.data;
    }

}

function formatDate(date) {

    if (!date) return "N/A";

    const d = new Date(date);

    const formattedDate = d.toLocaleDateString("en-PH", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });

    const formattedTime = d.toLocaleTimeString("en-PH", {
        hour: "numeric",
        minute: "2-digit"
    });

    return `${formattedDate} • ${formattedTime}`;

}

onMounted(() => {
    loadAcceptedModerators();
});
</script>

<template>
    <div id="page-main" class="page">
        <Nav @sign-out="handleSignOut" />
        <Header />

        <div class="content-card">

            <h1>Accepted Applications</h1>

            <div
                v-for="moderator in moderators"
                :key="moderator.uid"
                class="application-card"
            >

                <h3>
                    {{ moderator.first_name }}
                    {{ moderator.last_name }}
                </h3>

                <p>{{ moderator.email }}</p>

                <p>Affiliation: {{ moderator.affiliation }}</p>

                <p>Status: {{ moderator.approval_status }}</p>

                <p>Approved by: {{ moderator.approved_by_name }}</p>

                <p>Approved on: {{ formatDate(moderator.approved_at) }}</p>

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
