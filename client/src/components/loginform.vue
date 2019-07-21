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
              <g-signin-button
                :params="googleSignInParams"
                @success="onSignInSuccess"
                @error="onSignInError"
              >Google</g-signin-button>
            </el-form-item>
            <el-form-item></el-form-item>
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
import { axi } from "../api";

export default {
  props: ["isLogin"],
  data() {
    return {
      signin: {
        name: "",
        password: ""
      },
      googleSignInParams: {
        client_id:
          "132166001773-8hdrtj1nhu45na8h87365uoilltf66ks.apps.googleusercontent.com"
      }
    };
  },
  methods: {
    onSignInSuccess(googleUser) {
      console.log(profile);
      console.log("hehehe");
      const profile = googleUser.getBasicProfile(); // etc etc
      var id_token = googleUser.getAuthResponse().id_token;
      axios
        .post("http://localhost:3000/users/signin/google", {
          idToken: id_token
        })
        .then(({ data }) => {
          console.log(data);
          if (data.code === 404) {
            console.log(data, "error tapi berhasil");
            this.$message.error(data.message);
          } else {
            console.log(data, "berhasil");

            localStorage.setItem("token", data);
            this.$emit("whoami");
            this.$emit("isLogin", true);
          }
        })
        .catch(err => {
          console.log('gagal');
          
          console.log(err);
        });
    },
    onSignInError(error) {
      console.log("hmmmmmmmm");
      console.log("OH NOES", error);
    },
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
            this.$emit("whoami");
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
.g-signin-button {
  /* This is where you control how the button looks. Be creative! */
  display: inline-block;
  width: 35px;
  margin-left: 15px;
  padding: 0px 30px;
  border-radius: 3px;
  background-color: rgb(243, 245, 247);
  color: rgb(24, 119, 220);
  border: 1px solid rgb(24, 119, 220);
  /* box-shadow: 0 3px 0 #66B1FF; */
}
.g-signin-button:hover {
  cursor: pointer;
  background-color: rgba(19, 149, 220, 0.4);
  color: rgb(16, 97, 184);
  border: 0.5px solid rgb(102, 164, 230) Î;
}
</style>
