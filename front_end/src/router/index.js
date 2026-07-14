import { createRouter, createWebHistory } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('../views/main.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/signup.vue'),
    },
    {
      path: '/mod-login',
      name: 'mod-login',
      component: () => import('../views/ModeLogin.vue'),
    },
    {
      path: '/moderator',
      name: 'moderator',
      component: () => import('../views/moderator/pending.vue'),
      meta: { requiresModerator: true }
    },
    {
      path: '/moderator/pending',
      name: 'moderator-pending',
      component: () => import('../views/moderator/pending.vue'),
      meta: { requiresModerator: true }
    },
    {
      path: '/moderator/accepted',
      name: 'moderator-accepted',
      component: () => import('../views/moderator/accepted.vue'),
      meta: { requiresModerator: true }
    },
    {
      path: '/moderator/rejected',
      name: 'moderator-rejected',
      component: () => import('../views/moderator/rejected.vue'),
      meta: { requiresModerator: true }
    },
    {
      path: '/moderator/all',
      name: 'moderator-all',
      component: () => import('../views/moderator/all.vue'),
      meta: { requiresModerator: true }
    },
    {
      path: '/moderator/event-registrations',
      name: 'moderator-event-registrations',
      component: () => import('../views/moderator/eventRegistrations.vue'),
      meta: { requiresModerator: true }
    },
    {
      path: '/moderator/registrations',
      name: 'moderator-registrations',
      component: () => import('../views/moderator/registrations.vue'),
      meta: { requiresModerator: true }
    },
    {
      path: '/main',
      name: 'menu',
      component: () => import('../views/student/menu.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/inbox',
      name: 'inbox',
      component: () => import('../views/student/inbox.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('../views/student/events.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/student/register.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/my-registrations',
      name: 'my-registrations',
      component: () => import('../views/student/myRegistrations.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// Wait for Firebase to report the current auth state once, then let
// every route change afterward check it synchronously against `auth.currentUser`.
let authReadyPromise = new Promise((resolve) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    unsubscribe()
    resolve(user)
  })
})

router.beforeEach(async (to) => {

  await authReadyPromise

  if (!to.meta.requiresAuth && !to.meta.requiresModerator) {
    return true
  }


  if (!auth.currentUser) {
    return { name: 'login' }
  }


  if (to.meta.requiresModerator) {

    const idToken = await auth.currentUser.getIdToken();


    const response = await fetch("http://localhost:3000/api/auth/me", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        idToken
      })
    });


    const result = await response.json();


    if (
      !result.success ||
      result.data.account_type !== "moderator" ||
      result.data.approval_status !== "approved"
    ) {
      return { name: "menu" };
    }

  }


  return true;

})

export default router
