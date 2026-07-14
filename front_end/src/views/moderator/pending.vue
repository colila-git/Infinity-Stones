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

async function loadPendingModerators() {

    console.log("Loading pending moderators...");

    const idToken = await auth.currentUser.getIdToken();

    const response = await fetch(
        "https://infinite-stones.onrender.com/api/moderators/pending",
        {
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        }
    );

    console.log(response);

    const result = await response.json();

    console.log(result);

    if (result.success) {
        moderators.value = result.data;
        console.log(moderators.value);
    }
}

async function approveModerator(uid) {

    console.log("Approving:", uid);

    if (!confirm("Approve this moderator application?")) {
        return;
    }

    const idToken = await auth.currentUser.getIdToken();

    const response = await fetch(
        `https://infinite-stones.onrender.com/api/moderators/${uid}/approve`,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        }
    );

    console.log(response);

    const result = await response.json();

    console.log(result);

    if (result.success) {
        await loadPendingModerators();
    }

}

async function rejectModerator(uid) {

    console.log(idToken);

    if (!confirm("Reject this moderator application?")) {
        return;
    }

    const idToken = await auth.currentUser.getIdToken();

    const response = await fetch(
        `https://infinite-stones.onrender.com/api/moderators/${uid}/reject`,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        }
    );

    const result = await response.json();

    if (result.success) {
        await loadPendingModerators();
    }

}

onMounted(() => {
    loadPendingModerators();
});
</script>

<template>
    <div id="page-main" class="page">
        <Nav @sign-out="handleSignOut" />
        <Header />

        <div class="pending-card">

        <h1>Pending Applications</h1>

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

            <div class="actions">
                <button
                    class="approve-btn"
                    @click="approveModerator(moderator.uid)"
                >
                    Approve
                </button>

                <button
                    class="reject-btn"
                    @click="rejectModerator(moderator.uid)"
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
    background: linear-gradient(160deg, #0d0f2b 0%, #131640 100%);
    color: #ffffff;
}

.pending-card {
    padding: 32px 24px;
}

h1 {
    margin-bottom: 12px;
}

p {
    color: #d6d9f5;
}

.application-card {
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 10px;
    padding: 18px;
    margin-bottom: 16px;
}

.actions {
    margin-top: 14px;
    display: flex;
    gap: 10px;
}

.approve-btn,
.reject-btn {
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    cursor: pointer;
    font-weight: 600;
}

.approve-btn {
    background: #00C853;
    color: white;
}

.reject-btn {
    background: #E53935;
    color: white;
}
</style>
