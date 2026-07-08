import { createStore } from "vuex";
import * as miria from "./modules/miria";

export default createStore({
  modules: {
    miria,
  },
  state: {
    isDark: window.localStorage.getItem("isDark") !== "false", // default true
    colorTheme: window.localStorage.getItem("colorTheme") || "catppuccin",
  },
  mutations: {
    SET_DARK: function (state, val) {
      state.isDark = val;
    },
    SET_COLOR_THEME: function (state, val) {
      state.colorTheme = val;
    }
  },
  actions: {
    updateTheme: function ({ commit, state }, payload) {
      if (payload && payload.isDark !== undefined) {
        commit("SET_DARK", payload.isDark);
        window.localStorage.setItem("isDark", payload.isDark);
      }
      if (payload && payload.colorTheme) {
        commit("SET_COLOR_THEME", payload.colorTheme);
        window.localStorage.setItem("colorTheme", payload.colorTheme);
      }
      
      document.documentElement.classList.add('theme-transition');
      document.body.className = (state.isDark ? "dark-theme" : "light-theme") + " theme-" + state.colorTheme;
      
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
      }, 300);
    },
    initTheme: function ({ state }) {
      document.body.className = (state.isDark ? "dark-theme" : "light-theme") + " theme-" + state.colorTheme;
    }
  },
});
