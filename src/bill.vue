<template>
  <div class="min-h-screen bg-gray-900 text-white relative">
    <div class="sidebar fixed left-0 w-64 h-full bg-gray-900 text-white transition-all duration-300 ease-in-out transform" :class="{ '-translate-x-full': !showSidebar }">
      <header class="flex items-center justify-center py-4">
        <img v-bind:src="'./logo-no-background.png'" alt="Header Image" class="h-12 md:h-auto">
      </header>
      <a href="/dashboard" class="block py-3 px-6 text-lg flex items-center hover:bg-gray-800 border-t border-b border-gray-700">
        <i class='bx bx-wallet text-lg mr-4'></i>
        <span>Account Balance</span>
      </a>
      <a href="/transfer" class="block py-3 px-6 text-lg flex items-center hover:bg-gray-800 border-b border-gray-700">
        <i class='bx bx-transfer-alt text-lg mr-4'></i>
        <span>Transfer</span>
      </a>
      <a href="/bill" class="block py-3 px-6 text-lg flex items-center hover:bg-gray-800 border-b border-gray-700">
        <i class='bx bx-file text-lg mr-4'></i>
        <span>Bills</span>
      </a>
      <a href="/history" class="block py-3 px-6 text-lg flex items-center hover:bg-gray-800 border-b border-gray-700">
        <i class='bx bx-history text-lg mr-4'></i>
        <span>Transaction History</span>
      </a>
    </div>

    <button v-if="showSidebar" @click="toggleSidebar" class="absolute top-0 right-0 mt-4 mr-4 text-gray-400 hover:text-white">
      <i class="bx bx-x text-lg m" style="margin-right:77rem;"></i>
    </button>

    <div v-if="showProfileSidebar" class="profile-sidebar fixed right-0 w-64 h-full bg-gray-900 text-white transition-all duration-300 ease-in-out transform" :class="{ '-translate-x-full': !showProfileSidebar }">
      <header class="flex items-center justify-center py-4">
        <i class='bx bx-user text-3xl'></i>
        <button v-if="showProfileSidebar" @click="toggleProfileSidebar" class="fixed top-4 right-4 text-gray-400 hover:text-white z-50">
          <i class="bx bx-x-circle text-lg"></i>
        </button>
      </header>
      <div v-if="userInfo" class="px-6 py-4">
        <p class="text-lg font-semibold"></p>
        <p v-if="userInfo && userInfo.name" class="text-sm text-gray-400" style="margin-left: -4px;">Name: {{ userInfo.name }}</p>
        <p v-if="userInfo && userInfo.phone_number" class="text-sm text-gray-400" style="margin-left: -4px">Phone: {{ userInfo.phone_number }}</p>
        <p v-if="userInfo && userInfo.email" class="text-sm text-gray-400" style="margin-left: -4px;">Email: {{ userInfo.email }}</p>
      </div>
      <button @click="signOut" class="block w-full py-3 text-left px-6 bg-gray-800 hover:bg-gray-700 text-lg">Logout</button>
    </div>

    <div class="min-h-screen bg-gray-900 text-white">
      <div class="header flex justify-between items-center px-6 py-10">
        <div class="menu-icon-wrapper bg-gray-800 rounded-full h-12 w-12 flex justify-center items-center hidden md:block" @click="toggleSidebar">
          <i class='bx bx-menu-alt-left text-gray-500 ml-4 mt-4 text-lg'></i>
        </div>
        <h1 class="text-lg flex-2 text-center font-bold">Bills Payment</h1>
        <div class="profile-icon-wrapper bg-gray-800 rounded-full h-12 w-12 flex justify-center items-center hidden md:block" @click="toggleProfileSidebar">
          <i class='bx bx-user text-gray-500 ml-4 mt-4 text-lg'></i>
        </div>
      </div>
      <div class="content p-6">
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="billType" class="block text-sm mb-2">Bill Type</label>
            <select id="billType" class="w-full bg-gray-800 rounded-lg p-3" @change="selectBillType">
              <option value="airtime">Airtime</option>
              <option value="data">Data</option>
            </select>
          </div>
          <div v-if="selectedBillType === 'airtime'" class="mb-4">
            <label for="network-airtime" class="block text-sm mb-2">Select Network</label>
            <select id="network-airtime" class="w-full bg-gray-800 rounded-lg p-3" v-model="selectedProduct">
              <option value="9mobile">9mobile</option>
              <option value="MTN">MTN</option>
              <option value="Airtel">Airtel</option>
              <option value="Glo">Glo</option>
            </select>
          </div>
          <div v-if="selectedBillType === 'data'" class="mb-4">
            <label for="network-data" class="block text-sm mb-2">Select Network</label>
            <select id="network-data" class="w-full bg-gray-800 rounded-lg p-3" @change="(e)=>{
              this.selectedProduct=e.target.value
              this.fetchDataPlans(this.selectedProduct);
            }">
              <option value="9mobile">9mobile</option>
              <option value="MTN">MTN</option>
              <option value="Airtel">Airtel</option>
              <option value="Glo">Glo</option>
            </select>
            <label for="dataPlan" class="block text-sm mb-2 mt-4">Select Data Plan</label>
            <select id="dataPlan" class="w-full bg-gray-800 rounded-lg p-3" @change="updateSelectedDataPlan">
              <option v-for="plan in dataPlans" :value="plan.code" :key="plan.code">{{ plan.name }}</option>
            </select>
          </div>
          <div class="mb-4">
            <label for="phoneNumber" class="block text-sm mb-2">Phone Number</label>
            <input type="tel" id="phoneNumber" v-model="phoneNumber" class="w-full bg-gray-800 rounded-lg p-3" placeholder="e.g., 08012345678">
          </div>
          <div v-if="selectedBillType === 'airtime'" class="mb-4">
            <label for="amount" class="block text-sm mb-2">Amount (NGN)</label>
            <input type="number" id="amount" v-model="amount" class="w-full bg-gray-800 rounded-lg p-3">
          </div>
          <div v-if="selectedBillType === 'data'" class="mb-4">
            <label for="dataAmount" class="block text-sm mb-2">Amount (NGN)</label>
            <input type="text" id="dataAmount" v-model="amount" class="w-full bg-gray-800 rounded-lg p-3" readonly>
          </div>
          <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">Pay</button>
        </form>
      </div>
    </div>
    <div class="md:hidden fixed bottom-0 left-0 w-full bg-gray-900 text-white flex justify-between items-center px-6 py-3">
      <a href="/dashboard" class="flex flex-col items-center text-gray-400 hover:text-white">
        <i class="bx bx-wallet text-xl mb-1"></i>
        <span class="text-xs">Account Balance</span>
      </a>
      <a href="/transfer" class="flex flex-col items-center text-gray-400 hover:text-white">
        <i class="bx bx-transfer-alt text-xl mb-1"></i>
        <span class="text-xs">Transfer</span>
      </a>
      <a href="/bill" class="flex flex-col items-center text-gray-400 hover:text-white">
        <i class="bx bx-file text-xl mb-1"></i>
        <span class="text-xs">Bills</span>
      </a>
      <a href="/history" class="flex flex-col items-center text-gray-400 hover:text-white">
        <i class="bx bx-history text-xl mb-1"></i>
        <span class="text-xs">Transaction History</span>
      </a>
      <a href="/profile" class="flex flex-col items-center text-gray-400 hover:text-white">
        <i class="bx bx-user text-xl mb-1"></i>
        <span class="text-xs">Profile</span>
      </a>
    </div>
  </div>
</template>

<script>
import { supabase } from "@/supabase";
import { computed } from 'vue'
import router from '@/router';
import { Apis } from './api/index';

const api = new Apis();
export default {
  data() {
    return {
      showSidebar: false,
      showProfileSidebar: false,
      selectedBillType: 'airtime',
      dataPlans: [],
      selectedDataPlan: null,
      selectedProduct: "",
      phoneNumber: '',
      amount: ''
    };
  },
  methods: {
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
    },
    toggleProfileSidebar() {
      this.showProfileSidebar = !this.showProfileSidebar;
    },
    selectBillType(event) {
      this.selectedBillType = event.target.value;
    },
    async fetchDataPlans(network) {
      try {
        const data = await api.fetchDataPlans(network);
        if (data.status === 'true') {
          this.dataPlans = data.details.categories;
        } else {
          console.error('Failed to fetch data plans:', data.message);
        }
      } catch (error) {
        console.error('Error fetching data plans:', error);
      }
    },
    updateSelectedDataPlan(event) {
      const selectedPlanCode = event.target.value;
      this.selectedDataPlan = this.dataPlans.find(plan => plan.code === selectedPlanCode);
      if (this.selectedDataPlan) {
        this.amount = this.selectedDataPlan.amount;
      }
    },
    async handleSubmit() {
      if (this.selectedBillType === 'airtime' && this.selectedProduct && this.phoneNumber && this.amount) {
        try {
          const params = {
            product: this.selectedProduct,
            phone_no: this.phoneNumber,
            amount: this.amount,
            ported: "true",
            reference: Math.random().toString(36).substring(2, 15)
          };
          const result = await api.purchaseAirtime(params);
          if (result.status === 'true') {
            console.log('Airtime purchase successful:', result);
            alert('Airtime purchase successful');
            await this.insertTransactionHistory('airtime', params, result);
          } else {
            console.error('Airtime purchase failed:', result.message);
            alert('Airtime purchase failed: ' + result.message);
          }
        } catch (error) {
          console.error('Error during airtime purchase:', error);
          alert('Error during airtime purchase');
        }
      } else if (this.selectedBillType === 'data' && this.selectedDataPlan && this.phoneNumber) {
        try {
          const params = {
            product: this.selectedProduct,
            code: this.selectedDataPlan.code,
            phone_no: this.phoneNumber,
            ported: "true",
            reference: Math.random().toString(36).substring(2, 15)
          };
          const result = await api.purchaseData(params);
          if (result.status === 'true') {
            console.log('Data purchase successful:', result);
            alert('Data purchase successful');
            await this.insertTransactionHistory('data', params, result);
          } else {
            console.error('Data purchase failed:', result.message);
            alert('Data purchase failed: ' + result.message);
          }
        } catch (error) {
          console.error('Error during data purchase:', error);
          alert('Error during data purchase');
        }
      } else {
        alert('Please select a product, enter a valid phone number and amount.');
      }
    },
    async insertTransactionHistory(billType, params, result) {
  try {
    const email = this.userInfo?.email || '';
    const { error } = await supabase
      .from('BILL_PAYMENT_HISTORY')
      .insert({
        email,
        bill_type: billType,
        product: params.product,
        phone_number: params.phone_no,
        amount: parseFloat(params.amount), 
        status: "successful",
        reference: params.reference.toString(), 
        date: new Date().toISOString()
      });
    if (error) throw error;
  } catch (error) {
    console.error('Error inserting transaction history:', error.message);
  }
},
    async signOut() {
      try {
        await supabase.auth.signOut();
        router.push("./login");
      } catch (error) {
        console.error("Error logging out:", error.message);
      }
    }
  },
  setup() {
    const userInfo = computed(() => {
      const storedUserInfo = localStorage.getItem('userInfo');
      return storedUserInfo ? JSON.parse(storedUserInfo) : null;
    });

    return {
      userInfo
    }
  }
};
</script>


<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.sidebar,
.profile-sidebar {
  transition: transform 0.3s ease-in-out;
}

.sidebar header,
.profile-sidebar header {
  background-color: #1a202c;
  padding: 20px;
}

.sidebar header img {
  height: auto;
}

.content {
  max-width: 600px;
  margin: 0 auto;
}
</style>