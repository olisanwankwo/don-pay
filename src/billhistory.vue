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
        <a href="/bill-history" class="block py-3 px-6 text-lg flex items-center hover:bg-gray-800 border-b border-gray-700">
          <i class='bx bx-receipt text-lg mr-4'></i>
          <span>Bill History</span>
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
          <h1 class="text-lg flex-2 text-center font-bold">Bill History</h1>
          <div class="profile-icon-wrapper bg-gray-800 rounded-full h-12 w-12 flex justify-center items-center hidden md:block" @click="toggleProfileSidebar">
            <i class='bx bx-user text-gray-500 ml-4 mt-4 text-lg'></i>
          </div>
        </div>
  
       
      <div class="activity-wrapper px-4">
        <section class="table__body overflow-x-auto">
          <table class="table-auto w-full">
            <thead>
              <tr class="bg-gray-800 text-gray-300">
                <th class="px-2 md:px-4 py-2">#</th>
                <th class="px-2 md:px-4 py-2">Network <span class="icon-arrow">&UpArrow;</span> </th>
                <th class="px-2 md:px-4 py-2">Phone <span class="icon-arrow">&UpArrow;</span></th>
                <th class="px-2 md:px-4 py-2">Bill Type <span class="icon-arrow">&UpArrow;</span></th>
                <th class="px-2 md:px-4 py-2">Date <span class="icon-arrow">&UpArrow;</span></th>
                <th class="px-2 md:px-4 py-2">Amount <span class="icon-arrow">&UpArrow;</span></th>
                <th class="px-2 md:px-4 py-2">Status <span class="icon-arrow">&UpArrow;</span></th>
              </tr>
            </thead>
            <tbody class="text-gray-500">
              <tr v-for="(transaction, index) in billHistory" :key="index">
                <td class="border px-4 py-2">{{ index + 1 }}</td>
                <td class="border px-4 py-2">{{ transaction.product }}</td>
                <td class="border px-4 py-2">{{ transaction.phone_number }}</td>
                <td class="border px-4 py-2">{{ transaction.bill_type }}</td>
                <td class="border px-4 py-2">{{ transaction.date }}</td>
                <td class="border px-4 py-2">{{ transaction.amount }}</td>
                <td class="border px-4 py-2">{{ transaction.status }}</td>
              </tr>
            </tbody>
          </table>
          </section>
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
          <a href="/billhistory" class="flex flex-col items-center text-gray-400 hover:text-white">
            <i class="bx bx-receipt text-xl mb-1"></i>
            <span class="text-xs">Bill History</span>
          </a>
          <a href="/profile" class="flex flex-col items-center text-gray-400 hover:text-white">
            <i class="bx bx-user text-xl mb-1"></i>
            <span class="text-xs">Profile</span>
          </a>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { useUserStore } from "@/store/user";
  import { supabase } from "@/supabase";
  
  export default {
    setup() {
      const userStore = useUserStore();
      const userInfo = computed(() => userStore.userInfo);
      const showSidebar = ref(false);
      const showProfileSidebar = ref(false);
      const billHistory = ref([]);
  
      const toggleSidebar = () => {
        showSidebar.value = !showSidebar.value;
      };
  
      const toggleProfileSidebar = () => {
        showProfileSidebar.value = !showProfileSidebar.value;
      };
  
      const fetchBillHistory = async () => {
        try {
          const { data: billPaymentHistory, error } = await supabase
            .from("BILL_PAYMENT_HISTORY")
            .select("*")
            .eq("email", userInfo.value.email);
  
          if (error) throw error;
  
          billHistory.value = billPaymentHistory;
        } catch (error) {
          console.error("Error fetching bill history:", error.message);
        }
      };
  
      onMounted(async () => {
        const storedUserInfo = localStorage.getItem("userInfo");
        if (!storedUserInfo) {
          try {
            const { data, error } = await supabase
              .from("USER_duplicate")
              .select("*")
              .eq("id", userStore.userInfo.id)
              .single();
  
            if (error) {
              console.error("Error fetching user information:", error.message);
              return;
            }
  
            userStore.setUserInfo(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
          } catch (error) {
            console.error("Error fetching user information:", error.message);
          }
        } else {
          userStore.setUserInfo(JSON.parse(storedUserInfo));
        }
        fetchBillHistory();
      });
  
      const signOut = async () => {
        try {
          await supabase.auth.signOut();
          localStorage.removeItem("userInfo");
          userStore.setUserInfo(null);
          router.push('./login');
        } catch (error) {
          console.error("Error logging out:", error.message);
        }
      };
  
      return {
        userInfo,
        showSidebar,
        showProfileSidebar,
        billHistory,
        toggleSidebar,
        toggleProfileSidebar,
        signOut
      };
    },
  };
  </script>  

<style scoped>
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
</style>