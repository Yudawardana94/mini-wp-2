<template>
  <div class>
    <div class="nav">
      <h4 class="titleNav">Adioos</h4>
    </div>
    <loginForm
      :isLogin="isLogin"
      @whoami="whoami"
      @isLogin="changeLogin"
      @changeForm="changeForm"
      v-if="showForm === 'login'"
    ></loginForm>
    <registerForm
      :isLogin="isLogin"
      @whoami="whoami"
      @isLogin="changeLogin"
      @changeForm="changeForm"
      v-if="showForm === 'register'"
    ></registerForm>
  </div>
</template>

<script>
import loginForm from "./loginform.vue";
import registerForm from "./registerForm.vue";

export default {
  props: ["isLogin"],
  components: {
    loginForm,
    registerForm
  },
  data() {
    return {
      showForm: "login",
      login: {
        name: "",
        password: ""
      }
    };
  },
  methods: {
    changeLogin(val) {
      // console.log(val, "di landing");
      this.$emit("isLogin", val);
    },
    changeForm(val) {
      // console.log(val, 'ini valuenya mau kemana?')
      this.showForm = val;
    },
    whoami() {
      console.log("di landing");
      this.$emit("whoami");
    }
  }
};
</script>

<style scoped>
* {
  font-family: "Barlow Condensed", sans-serif;
}
.nav {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 50px;
  font-size: 25px;
}
.titleNav {
  margin-top: 20px;
  margin-left: 40px;
  /* font-family: 'Asap', sans-serif; */
  font-family: "Fascinate", cursive;
}
</style>

