export const namespaced = true;
export const state = {
  output: "",
  results: null,
  compilationStatus: "success",
  executionStatus: "success",
};

export const mutations = {
  SET_OUTPUT: function (state, output) {
    state.output = output;
  },
  SET_RESULTS: function (state, results) {
    state.results = results;
  },
  SET_COMPILATION_STATUS: function (state, status) {
    state.compilationStatus = status;
  },
  SET_EXECUTION_STATUS: function (state, status) {
    state.executionStatus = status;
  },
};

export const actions = {
  setConsoleOutput: function ({ commit }, output) {
    commit("SET_OUTPUT", output);
  },
  setParserResults: function ({ commit }, results) {
    commit("SET_RESULTS", results);
  },
  setCompilationStatus: function ({ commit }, status) {
    commit("SET_COMPILATION_STATUS", status);
  },
  setExecutionStatus: function ({ commit }, status) {
    commit("SET_EXECUTION_STATUS", status);
  },
};

export const getters = {
  compilationFailed: function (state) {
    return state.compilationStatus === "failed";
  },
  executionFailed: function (state) {
    return state.executionStatus === "failed";
  },
};
