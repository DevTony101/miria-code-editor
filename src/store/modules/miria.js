export const namespaced = true;
export const state = {
  output: "",
  results: null,
  compilationStatus: "success",
};

export const mutations = {
  SET_OUTPUT: function(state, output) {
    state.output = output;
  },
  SET_RESULTS: function(state, results) {
    state.results = results;
  },
  SET_COMPILATION_STATUS: function(state, status) {
    state.compilationStatus = status;
  },
};

export const actions = {
  setConsoleOutput: function({ commit }, output) {
    commit("SET_OUTPUT", output);
  },
  setParserResults: function({ commit }, results) {
    commit("SET_RESULTS", results);
  },
  setCompilationStatus: function({ commit }, status) {
    commit("SET_COMPILATION_STATUS", status);
  },
};

export const getters = {
  compilationFailed: function(state) {
    return state.compilationStatus === "failed";
  },
};
