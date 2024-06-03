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
        <h1 class="text-lg flex-2 text-center font-bold">Transfer Money</h1>
        <div class="profile-icon-wrapper bg-gray-800 rounded-full h-12 w-12 flex justify-center items-center hidden md:block" @click="toggleProfileSidebar">
          <i class='bx bx-user text-gray-500 ml-4 mt-4 text-lg'></i>
        </div>
      </div>
  
      <div class="content p-6">
        <form @submit.prevent="initiateTransfer">
          <div class="mb-4">
            <label for="emailAddress" class="block text-sm mb-2">Recipient Email Address</label>
            <input v-model="recipientEmail" type="email" id="emailAddress" class="w-full bg-gray-800 rounded-lg p-3" @blur="checkRecipient">
          </div>
          <div class="mb-4" v-if="recipientName">
            <label for="recipientName" class="block text-sm mb-2">Recipient Name</label>
            <input type="text" id="recipientName" class="w-full bg-gray-800 rounded-lg p-3" v-model="recipientName" readonly>
          </div>
          <div class="mb-4">
            <label for="amount" class="block text-sm mb-2">Amount (NGN)</label>
            <input v-model="amount" type="number" id="amount" class="w-full bg-gray-800 rounded-lg p-3">
          </div>
          <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">Transfer</button>
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
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css'; 

export default {
  setup() {
    const userStore = useUserStore();
    const userInfo = computed(() => userStore.userInfo);
    const userBalance = computed(() => userInfo.value ? userInfo.value.account_balance : null);
    const showSidebar = ref(false);
    const showProfileSidebar = ref(false);
    const router = useRouter();
    const recipientEmail = ref("");
    const recipientName = ref("");
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

    const checkRecipient = async () => {
      if (!recipientEmail.value) {
        recipientName.value = "";
        return;
      }

      try {
        const { data, error } = await supabase
          .from("USER_duplicate")
          .select("name")
          .eq("email", recipientEmail.value)
          .single();

        if (error) {
          console.error("Error fetching recipient information:", error.message);
          recipientName.value = "";
          return;
        }

        recipientName.value = data.name || "";
      } catch (error) {
        console.error("Error fetching recipient information:", error.message);
        recipientName.value = "";
      }
    };

    const initiateTransfer = async () => {
      if (!recipientEmail.value || !amount.value || !recipientName.value) {
        toast.error("Please fill out all fields.");
        return;
      }

      if (recipientEmail.value === userInfo.value.email) {
        toast.error("You cannot transfer money to yourself.");
        return;
      }

      if (userBalance.value < amount.value) {
        toast.error("Insufficient balance.");
        return;
      }

      try {
        const { data: recipientData, error: recipientError } = await supabase
          .from("USER_duplicate")
          .select("*")
          .eq("email", recipientEmail.value)
          .single();

        if (recipientError) {
          console.error("Error fetching recipient data:", recipientError.message);
          toast.error("Recipient not found.");
          return;
        }

        const { data: senderData, error: senderError } = await supabase
          .from("USER_duplicate")
          .update({ account_balance: userBalance.value - amount.value })
          .eq("id", userInfo.value.id)
          .single();

        if (senderError) {
          console.error("Error updating sender balance:", senderError.message);
          toast.error("Transfer failed. Please try again.");
          return;
        }

        const { data: updatedRecipientData, error: updateRecipientError } = await supabase
          .from("USER_duplicate")
          .update({ account_balance: recipientData.account_balance + amount.value })
          .eq("id", recipientData.id)
          .single();

        if (updateRecipientError) {
          console.error("Error updating recipient balance:", updateRecipientError.message);
          toast.error("Transfer failed. Please try again.");
          return;
        }

        userStore.setUserInfo({ ...userInfo.value, account_balance: userBalance.value - amount.value });
        localStorage.setItem("userInfo", JSON.stringify({ ...userInfo.value, account_balance: userBalance.value - amount.value }));

        await supabase.from("TRANSFER_HISTORY").insert([
          {
            sender_email: userInfo.value.email,
            recipient_email: recipientEmail.value,
            amount: parseFloat(amount.value),
            transaction_amount: parseFloat(amount.value),
            account_balance: userBalance.value - amount.value,
            transaction_type: "transfer",
            description: "debited",
            date: new Date().toISOString()
          },
          {
            sender_email: recipientEmail.value,
            recipient_email: userInfo.value.email,
            amount: parseFloat(amount.value),
            transaction_amount: parseFloat(amount.value),
            account_balance: recipientData.account_balance + amount.value,
            transaction_type: "transfer",
            description: "credited",
            date: new Date().toISOString()
          }
        ]);

        toast.success("Transfer successful!");
        recipientEmail.value = "";
        recipientName.value = "";
        amount.value = 0;
      } catch (error) {
        console.error("Error during transfer:", error.message);
        toast.error("Transfer failed. Please try again.");
      }
    };

    onMounted(fetchUserInfo);

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
      userBalance,
      showSidebar,
      showProfileSidebar,
      toggleSidebar,
      toggleProfileSidebar,
      signOut,
      recipientEmail,
      recipientName,
      amount,
      checkRecipient,
      initiateTransfer
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
  