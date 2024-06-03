<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-10 w-auto" v-bind:src="'./logo-no-background.png'" alt="Your Company" />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Log in to your account</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form @submit.prevent="handleSignIn" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
          <div class="mt-2">
            <input v-model="email" id="email" name="email" type="email" autocomplete="email" required="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
            <div class="text-sm">
              <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
            </div>
          </div>
          <div class="mt-2 relative">
            <input v-model="password" id="password" name="password" type="password" autocomplete="current-password" required="" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            <span @click="togglePasswordVisibility" class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-400 hover:text-gray-600">
              <i class="bx bx-show"></i> 
            </span>
          </div>
        </div>

        <div>
          <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Don't have an account?
        <router-link to="/onbonding" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Sign up here</router-link>
      </p>
    </div>
  </div>
 
</template>

<script>
import { useUserStore } from '@/store/user';
import { supabase } from '@/supabase';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async handleSignIn(e) {
  try {
    let params = {
      email: this.email,
      password: this.password,
    };

    const { data, error } = await supabase.auth.signInWithPassword(params);
     localStorage.setItem("user_id", JSON.stringify(data.user.id))
    if (error) {
      throw new Error(error.message || "An error occurred during login.");
    }

    if (data) {
      const userStore = useUserStore();
      
      const { data: insertData, error: fetchError } = await supabase
        .from("USER_duplicate")
        .select("*")
        .eq("email", this.email)
        .single();

      if (fetchError) {
        throw new Error("Error fetching user information from the database.");
      }

      if (!insertData) {
        throw new Error("User information not found in the database.");
      }

      userStore.setUserInfo(insertData);

      toast.success('Login successful');
      setTimeout(() => {
        this.$router.push("/dashboard");
      }, 5000);
    } else {
      throw new Error("Invalid email or password.");
    }

  } catch (error) {
    toast.error(error.message || "An error occurred during login.");
    console.error(error);
  }
},
    togglePasswordVisibility() {
      const passwordInput = document.getElementById('password');
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
      } else {
        passwordInput.type = "password";
      }
    }
  }
}
</script>






<style scoped>
</style>


