<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

const router = useRouter();

const fname = ref('');
const lname = ref('');
const idNumber = ref('');
const affiliation = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const passwordsMatch = computed(() => {
  if (!confirmPassword.value) return null;
  return password.value === confirmPassword.value;
});
const accountType = ref('user');
const role = ref('user');
const approvalStatus = ref('approved');
const errorMsg = ref('');
const loading = ref(false);

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function formatAuthError(err) {
  switch (err?.code) {
    case 'auth/email-already-in-use':
      return 'That email is already registered.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/weak-password':
      return 'Use a stronger password.';
    default:
      return err?.message || 'Account creation failed.';
  }
}

async function handleSignup() {
  if (
    !affiliation.value ||
    !fname.value.trim() ||
    !lname.value.trim() ||
    !idNumber.value.trim() ||
    !email.value.trim() ||
    !password.value.trim() ||
    !confirmPassword.value.trim()
  ) {
    errorMsg.value = 'Please fill in all required fields.';
    return;
  }

  if (!/^\d{9}$/.test(idNumber.value)) {
    errorMsg.value = 'ID Number must contain exactly 9 digits.';
    return;
  }

  if (!isValidEmail(email.value.trim())) {
    errorMsg.value = 'Enter a valid email address.';
    return;
  }

  // Only allow GBox email addresses
  if (!email.value.trim().toLowerCase().endsWith('@gbox.adnu.edu.ph')) {
    errorMsg.value = 'Please use your official AdNU GBox email address.';
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Passwords do not match.';
    return;
  }

  if (password.value.trim().length < 6) {
    errorMsg.value = 'Password must be at least 6 characters long.';
    return;
  }

  errorMsg.value = '';
  loading.value = true;

  try {
    if (accountType.value === 'moderator') {
      role.value = 'moderator';
      approvalStatus.value = 'pending';
    } else {
      role.value = 'user';
      approvalStatus.value = 'approved';
    }
    
    const cred = await createUserWithEmailAndPassword(
      auth,
      email.value.trim(),
      password.value
    );
    await updateProfile(cred.user, {
      displayName: `${fname.value.trim()} ${lname.value.trim()}`,
    });

    router.push('/main');
  } catch (err) {
    errorMsg.value = formatAuthError(err);
  } finally {
    loading.value = false;
  }
}

function goToLogin() {
  router.push('/login');
}

function goToLanding() {
  router.push('/');
}
</script>

<template>
  <div id="page-signup" class="page">
    <div class="auth-page">
      <div class="auth-card">
        <div class="logo-row">
          <div class="topbar-logo">ADNU</div>
          <div class="topbar-title">
            ATENEO DE NAGA UNIVERSITY<span>Intramurals 2026</span>
          </div>
        </div>
        <h2>Create Account</h2>
        <p class="sub">Register to participate in Ateneo de Naga University's Intramurals.</p>

        <div class="form-row">
          <div class="form-group">
            <label>First Name</label>
            <input type="text" v-model="fname" placeholder="Juan" />
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input type="text" v-model="lname" placeholder="Dela Cruz" />
          </div>
        </div>

        <div class="form-group">
          <label>ID Number</label>
          <input
            type="text"
            inputmode="numeric"
            v-model="idNumber"
            placeholder="Enter your ID Number"
            maxlength="9"
            @input="idNumber = idNumber.replace(/\D/g, '')"
          />
        </div>

        <div class="form-group">
          <label>Affiliation</label>

          <select v-model="affiliation">
            <option disabled value="">Select Your Affiliation</option>

            <option value="CO">College (CO)</option>
            <option value="SH">Senior High School (SH)</option>
            <option value="HR">Faculty / Teachers (HR)</option>
          </select>
        </div>

        <div class="form-group">
          <label>Email Address</label>
          <input type="email" v-model="email" placeholder="jcruz@gbox.adnu.edu.ph" />
        </div>

        <div class="form-group">
          <label>Account Type</label>

          <div class="account-cards">

            <div
              class="account-card"
              :class="{ active: accountType === 'user' }"
              @click="accountType = 'user'"
            >
              <div class="card-icon">👤</div>

              <div class="card-content">
                <h4>Normal Account</h4>
                <p>Standard user access.</p>
              </div>

              <div
                class="checkmark"
                v-if="accountType === 'user'"
              >
                ✓
              </div>
            </div>

            <div
              class="account-card"
              :class="{ active: accountType === 'moderator' }"
              @click="accountType = 'moderator'"
            >
              <div class="card-icon">🛡️</div>

              <div class="card-content">
                <h4>Moderator Account</h4>
                <p>Requires approval from an existing moderator.</p>
              </div>

              <div
                class="checkmark"
                v-if="accountType === 'moderator'"
              >
                ✓
              </div>
            </div>

          </div>

          <div
            class="moderator-notice"
            v-if="accountType === 'moderator'"
          >
            <strong>Approval Required</strong><br>
            Your moderator account will remain pending until approved by an existing moderator.
          </div>
        </div>

        <div class="form-group">
          <label>Password</label>
          <input
            type="password"
            v-model="password"
            placeholder="••••••••"
            :class="{
              'input-valid': passwordsMatch === true,
              'input-invalid': passwordsMatch === false
            }"
          />
        </div>

        <div class="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            v-model="confirmPassword"
            placeholder="••••••••"
          />

        <p
          v-if="passwordsMatch === true"
          class="success-text"
        >
          ✓ Passwords match
        </p>

        <p
          v-if="passwordsMatch === false"
          class="error-text"
        >
          ✗ Passwords do not match
        </p>
      </div>

        <p v-if="errorMsg" class="error-text">{{ errorMsg }}</p>

        <button class="btn-primary full-width" :disabled="loading" @click="handleSignup">
          {{ loading ? 'Creating Account...' : 'Create Account' }}
        </button>

        <div class="auth-link">
          Already have an account? <a @click="goToLogin">Sign in here</a>
        </div>
        <div class="auth-link mt-12">
          <a @click="goToLanding">← Back to home</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@300;400;500;600&display=swap');

.page {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
  color: #ffffff;
}

.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #0d0f2b 0%, #131640 100%);
  padding: 24px;
  width: 100%;
}

.auth-card {
  background: #1a1f5e;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 36px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4);
}

.auth-card .logo-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
}

.topbar-logo {
  width: 42px;
  height: 36px;
  border-radius: 8px;
  background: #2d2fa8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: #ffffff;
  flex-shrink: 0;
}

.topbar-title {
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  font-size: 11px;
  line-height: 1.2;
  letter-spacing: 0.5px;
}

.topbar-title span {
  display: block;
  color: #9ea3c8;
  font-size: 10px;
  font-weight: 500;
}

.auth-card h2 {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.auth-card p.sub {
  color: #9ea3c8;
  font-size: 13px;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #9ea3c8;
  margin-bottom: 6px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 11px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  transition: border-color 0.2s;
  outline: none;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #4b4fd9;
}

.form-group select option {
  background: #1a1f5e;
}

.account-cards{
    display:flex;
    flex-direction:column;
    gap:12px;
    margin-top:10px;
}

.account-card{
    display:flex;
    align-items:center;
    gap:15px;
    padding:16px;
    border:2px solid #d9d9d9;
    border-radius:12px;
    cursor:pointer;
    transition:.25s;
    background:#fff;
    position:relative;
}

.account-card:hover{
    border-color:#0d6efd;
    transform:translateY(-2px);
}

.account-card.active{
    border-color:#0d6efd;
    background:#eef6ff;
    box-shadow:0 4px 12px rgba(13,110,253,.15);
}

.card-icon{
    font-size:28px;
}

.card-content{
    flex:1;
}

.card-content h4{
    margin:0;
    font-size:16px;
    color:#1d3557;
}

.card-content p{
    margin:4px 0 0;
    font-size:13px;
    color:#666;
}

.checkmark{
    width:28px;
    height:28px;
    border-radius:50%;
    background:#0d6efd;
    color:white;
    display:flex;
    justify-content:center;
    align-items:center;
    font-weight:bold;
    font-size:15px;
}

.moderator-notice{
    margin-top:12px;
    padding:12px;
    border-radius:8px;
    background:#fff8e6;
    border-left:4px solid #f0ad4e;
    color:#8a6d3b;
    font-size:14px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.btn-primary {
  background: linear-gradient(135deg, #2d2fa8, #4b4fd9);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 13px 32px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 20px rgba(75, 79, 217, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(75, 79, 217, 0.55);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.success-text {
  color: #4ade80;
  font-size: 12px;
  margin-top: 6px;
}

.error-text {
  color: #ff6b6b;
  font-size: 12px;
  margin-bottom: 12px;
}

.input-valid {
  border-color: #4ade80 !important;
}

.input-invalid {
  border-color: #ff6b6b !important;
}

.full-width {
  width: 100%;
}

.mt-12 {
  margin-top: 12px;
}

.auth-link {
  font-size: 13px;
  color: #9ea3c8;
  text-align: center;
  margin-top: 16px;
}

.auth-link a {
  color: #5b8cff;
  cursor: pointer;
  text-decoration: none;
}

.auth-link a:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>