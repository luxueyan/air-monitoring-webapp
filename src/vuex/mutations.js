export default {
  updateUser: function(state, user) {
    state.user = user
  },

  updateData(state, data) {
    state.data = data
  },

  updateSelectedSites(state, selectedSites) {
    state.selectedSites = selectedSites
  }
}
