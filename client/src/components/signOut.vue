<template>
  <h3 class="signout" @click="onSignOut">SignOut</h3>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    onSignOut() {
      console.log("berhasil logout");
      this.$emit("changeLogin", false);
      this.$emit("changePage", "landing");
      localStorage.removeItem("token");
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function() {
        console.log("User signed out.");
      });
    }
  }
};
</script>

<style>
</style>
