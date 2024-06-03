import { createRouter, createWebHistory } from 'vue-router';
import Onbonding from './onbonding.vue';
import Login from './login.vue';
import Dashboard from './dashboard.vue'
import Transfer from './transfer.vue'
import Bill from './bill.vue'
import History from './history.vue'
import Profile from './profile.vue'
import Addmoney from './addmoney.vue'
import Billhistory from './billhistory.vue'
import { supabase } from '@/supabase'


const routes = [
  { path: '/', redirect: '/onbonding' }, 
  { path: '/onbonding', component: Onbonding },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard },
  { path: '/transfer', component: Transfer },
  { path: '/bill', component: Bill },
  { path: '/history', component: History },
  { path: '/profile', component: Profile },
  { path: '/addmoney', component: Addmoney },
  { path: '/billhistory', component: Billhistory },
];

const router = createRouter({
  history: createWebHistory(),
  routes 
});

export default router;
