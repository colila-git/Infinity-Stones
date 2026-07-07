<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goToSignup() {
  router.push('/signup');
}

function goToLogin() {
  router.push('/login');
}

function goToModLogin() {
  router.push('/mod-login');
}
</script>

<template>
  <div id="page-landing" class="page">
    <div class="landing-inner">
      <div class="eyebrow">Ateneo de Naga University</div>
      <h1>Intramurals<br />Recruitment 2026</h1>
      <p>
        Join the College of Computer Studies team and compete across four
        exciting categories. Sign up now to secure your spot before slots
        fill up.
      </p>
      <div>
        <button class="btn-primary" @click="goToSignup">Join Here</button>
        <button class="btn-secondary" @click="goToLogin">Sign In</button>
      </div>
      <div class="auth-link mt-20">
        <a @click="goToModLogin">Moderator Login →</a>
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
}

#page-landing {
  background: linear-gradient(135deg, #0d0f2b 0%, #1a1f5e 60%, #1e1b6e 100%);
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  color: #ffffff;
}

#page-landing::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 80% 60% at 50% 40%,
    rgba(91, 140, 255, 0.15) 0%,
    transparent 70%
  );
}

.landing-inner {
  position: relative;
  z-index: 1;
  max-width: 860px;
  padding: 40px 24px;
}

.landing-inner .eyebrow {
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #00c9b1;
  font-weight: 600;
  margin-bottom: 16px;
}

.landing-inner h1 {
  font-family: 'Rajdhani', sans-serif;
  font-size: clamp(2.4rem, 6vw, 4rem);
  font-weight: 700;
  line-height: 1.05;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #fff 40%, #5b8cff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.landing-inner p {
  color: #9ea3c8;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 32px;
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

.btn-secondary {
  background: transparent;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 13px 32px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 12px;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.06);
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

.mt-20 {
  margin-top: 20px;
}
</style>