<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-10 w-auto" v-bind:src="'./logo-no-background.png'" alt="Your Company" />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Create an account</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form @submit.prevent="handleSignup" class="space-y-6">
        <div class="input field">
          <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Name</label>
          <input type="text" v-model="name" id="name" name="name" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
        </div>

        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
          <div class="mt-2">
            <input id="email" name="email" type="email" autocomplete="email" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" v-model="email" />
          </div>
        </div>

        <div>
          <label for="phone" class="block text-sm font-medium leading-6 text-gray-900">Phone number</label>
          <div class="mt-2">
            <input id="phone" name="phone" type="tel" autocomplete="tel" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" v-model="phone" />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
          <div class="mt-2 relative">
            <input  id="password" name="password" type="password"  autocomplete="new-password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" v-model="password" />
            <span @click="togglePasswordVisibility('password')" class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-400 hover:text-gray-600">
              <i class="bx bx-show"></i> 
            </span>
          </div>
        </div>

        <div>
          <label for="password_confirmation" class="block text-sm font-medium leading-6 text-gray-900">Confirm Password</label>
          <div class="mt-2 relative">
            <input id="password_confirmation" name="password_confirmation" type="password" autocomplete="new-password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" v-model="password_confirmation" />
            <span @click="togglePasswordVisibility('password_confirmation')" class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-400 hover:text-gray-600">
              <i class="bx bx-show"></i> 
            </span>
          </div>
        </div>

        <div>
          <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Create Account</button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Already have an account? 
        <router-link to="/login" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Sign in here</router-link>
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
      name: '',
      email: '',
      phone: '',
      password: '',
      password_confirmation: '',
      showPassword: false,
    }
  },
  methods: {
    async handleSignup() {
      try {
      
        if (!this.isStrongPassword(this.password)) {
          throw new Error("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
        }

        const { error, user } = await supabase.auth.signUp({
      email: this.email,
      password: this.password,
    });

        if (error) {
          if (error.message.includes("already exists")) {
            throw new Error("Email already exists. Please use a different email.");
          } else {
            throw new Error(error.message);
          }
        }

        toast.success('Registration successful');

        const { data, error: insertError } = await supabase
      .from("USER_duplicate")
      .insert([{ email: this.email, phone_number: this.phone, name: this.name, password: this.password }]);
    
    if (insertError) {
      throw new Error("Error storing user information in the database.");
    }

  
    const userStore = useUserStore();
    userStore.setUserInfo({ name: this.name, email: this.email, password: this.password, phone: this.phone });

        
        setTimeout(() => {
          this.$router.push('/login');
        }, 5000);
      } catch (error) {
    
        toast.error(error.message || "An error occurred during registration.");
        console.error(error);
      }
    },
    isStrongPassword(password) {
      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return strongPasswordRegex.test(password);
    },
    togglePasswordVisibility(fieldId) {
      const passwordInput = document.getElementById(fieldId);
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
