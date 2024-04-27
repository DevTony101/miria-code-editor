import Vue from "vue";
import Vuex from "vuex";
import * as miria from "./modules/miria";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    miria,
  },
  state: {
    theme: window.localStorage.getItem("theme") ?? "light-theme",
  },
  mutations: {
    SET_THEME: function (state, theme) {
      state.theme = theme;
    },
  },
  actions: {
    updateTheme: function ({ commit, state }, theme) {
      if (!theme) {
        document.body.classList.replace("light-theme", state.theme);
      } else {
        document.body.classList.replace(state.theme, theme);
        commit("SET_THEME", theme);
        window.localStorage.setItem("theme", state.theme);
      }
    },
  },
});
