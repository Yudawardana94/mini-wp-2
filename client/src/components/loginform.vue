<template>
  <div id="loginForm">
    <el-row :gutter="20">
      <el-col :span="5" :offset="2">
        <div class="grid-content bg-purple">
          <el-form ref="form" label-position="top" label-width="120px">
            <el-form-item label="Username / email">
              <el-input v-model="signin.name"></el-input>
            </el-form-item>
            <el-form-item label="Password">
              <el-input type="password" autocomplete="off" v-model="signin.password"></el-input>
            </el-form-item>
            <p>
              Doesn`t have an account ?
              <el-link type="primary" @click="changeForm">Register here</el-link>
            </p>
            <el-form-item>
              <el-button type="primary" @click="onSignIn">Sign In</el-button>
              <!-- <el-button>Cancel</el-button> nanti jadi sign by google -->
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { axi } from "../api"

export default {
  props: ["isLogin"],
  data() {
    return {
      signin: {
        name: "",
        password: ""
      }
    };
  },
  methods: {
    onSignIn() {
      console.log("logindong", this.signin.name, this.signin.password);
      let ue = this.signin.name;
      let password = this.signin.password;
      axios
        .post("http://localhost:3000/users/signin", {
          ue,
          password
        })
        .then(({ data }) => {
          console.log(data);
          if (data.code === 404) {
            console.log(data, "error tapi berhasil");
            this.$message.error(data.message);
          } else {
            console.log(data, "berhasil");
            
            localStorage.setItem("token", data);
            this.$emit("whoami")
            this.$emit("isLogin", true);
          }
        })
        .catch(err => {
          console.log(err, "gagal");
        });
    },
    changeForm() {
      this.$emit("changeForm", "register");
    }
  }
};
</script>

<style scoped>
#loginForm {
  margin-top: 15vh;
}
p {
  margin-bottom: 10px;
  margin-top: -10px;
  font-size: 15px;
}
</style>
