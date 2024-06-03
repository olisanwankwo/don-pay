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
        <h1 class="text-lg flex-2 text-center font-bold">Fund Wallet</h1>
        <div class="profile-icon-wrapper bg-gray-800 rounded-full h-12 w-12 flex justify-center items-center hidden md:block" @click="toggleProfileSidebar">
          <i class='bx bx-user text-gray-500 ml-4 mt-4 text-lg'></i>
        </div>
      </div>

      <div class="content p-6">
        <form @submit.prevent="addMoney">
          <div class="mb-4">
            <label for="amount" class="block text-sm mb-2">Amount (NGN)</label>
            <input v-model="amount" type="number" id="amount" class="w-full bg-gray-800 rounded-lg p-3" />
          </div>
          <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">Add Money</button>
        </form>
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
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { useUserStore } from "@/store/user";
import { supabase } from "@/supabase";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  setup() {
    const userStore = useUserStore();
    const userInfo = computed(() => userStore.userInfo);
    const showSidebar = ref(false);
    const showProfileSidebar = ref(false);
    const router = useRouter();
    const amount = ref(0);

    const toggleSidebar = () => {
      showSidebar.value = !showSidebar.value;
    };

    const toggleProfileSidebar = () => {
      showProfileSidebar.value = !showProfileSidebar.value;
    };

    const fetchUserInfo = async () => {
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
          console.log("User information stored in Pinia and local storage:", data);
        } catch (error) {
          console.error("Error fetching user information:", error.message);
        }
      } else {
        userStore.setUserInfo(JSON.parse(storedUserInfo));
      }
    };

    const addMoney = async () => {
      try {
        const user_id = JSON.parse(localStorage.getItem("user_id"));
        if (!userInfo.value || userInfo.value.account_balance === undefined) {
          console.error("User information or account balance is undefined");
          toast.error("Error: User information or account balance is undefined.");
          return;
        }

        const updatedUserInfo = {
          ...userInfo.value,
          account_balance: userInfo.value.account_balance + parseFloat(amount.value),
        };
        userStore.setUserInfo(updatedUserInfo);
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));

        const { error } = await supabase
          .from("USER_duplicate")
          .update({ account_balance: updatedUserInfo.account_balance })
          .eq("id", updatedUserInfo.id)
          .single();

        if (error) {
          console.error("Error updating account balance:", error.message);
          toast.error("Error updating account balance.");
          return;
        }

        const genRandomNumber = () => {
          const num = "0123456789";
          return Number(num.split('').sort(() => Math.random() - 0.5).join(''));
        };
        const id = genRandomNumber();

        const response = await supabase.from("TRANSACTION_history").insert([
          {
            id,
            user_id,
            email: userInfo.value.email,
            transaction_type: "deposit",
            amount: parseFloat(amount.value),
            reference: "lakoH92dfvCew",
            status: "successful",
            date: new Date().toISOString(),
            description: "Fund Wallet",
            transaction_amount: parseFloat(amount.value),
            account_balance: updatedUserInfo.account_balance
          },
        ]);
        console.log(response);
        toast.success("Money added successfully.");
      } catch (error) {
        console.error("Error adding money:", error.message);
        toast.error("Error adding money.");
      }
    };

    const signOut = async () => {
      try {
        await supabase.auth.signOut();
        localStorage.removeItem("userInfo");
        userStore.setUserInfo(null);
        router.push("/login");
      } catch (error) {
        console.error("Error logging out:", error.message);
      }
    };

    onMounted(fetchUserInfo);

    return {
      userInfo,
      showSidebar,
      showProfileSidebar,
      toggleSidebar,
      toggleProfileSidebar,
      signOut,
      amount,
      addMoney,
    };
  },
};
</script>


<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.content {
  max-width: 600px;
  margin: 0 auto;
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

.profile-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.profile-info p {
  margin-bottom: 0.5rem;
}

.profile-info p span {
  font-weight: bold;
}

.profile-avatar {
  border: 4px solid #fff;
}

.account-info,
.personal-info,
.security-info {
  border-top: 1px solid #4b5563;
  padding-top: 1.5rem;
}

.account-info h2,
.personal-info h2,
.security-info h2 {
  color: #60a5fa;
}

.profile-wrapper {
  margin-top: -6rem;
}
</style>
