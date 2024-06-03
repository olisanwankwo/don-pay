import { defineStore } from 'pinia';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    userInfo: null,
  }),
  actions: {
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
    },
  },
});