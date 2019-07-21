<template>
  <div id="registerForm">
    <el-row :gutter="20">
      <el-col :span="5" :offset="2">
        <div class="grid-content bg-purple">
          <el-form ref="form" label-position="top" label-width="120px">
            <el-form-item label="Username">
              <el-input v-model="signup.username"></el-input>
            </el-form-item>
            <el-form-item label="Email">
              <el-input v-model="signup.email"></el-input>
            </el-form-item>
            <el-form-item label="Password">
              <el-input type="password" autocomplete="off" v-model="signup.password"></el-input>
            </el-form-item>
            <p>
              Already have an account ?
              <el-link type="primary" @click="changeForm">Sign in</el-link>
            </p>
            <el-form-item>
              <el-button type="primary" @click="onSignUp">Sign up</el-button>
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
export default {
  props: ["isLogin"],
  data() {
    return {
      signup: {
        username: "",
        email: "",
        password: ""
      }
    };
  },
  methods: {
    onSignUp() {
      console.log(
        "logindong",
        this.signup.username,
        this.signup.email,
        this.signup.password
      );
      let username = this.signup.username;
      let email = this.signup.email;
      let password = this.signup.password;
      axios
        .post("http://localhost:3000/users/signup", {
          username,
          email,
          password
        })
        .then(({ data }) => {
          console.log(data, "berhasil");
          console.log(username, password, "bahan register");
          if (data.name === "ValidationError") {
            throw data;
          } else {
            return axios.get("http://localhost:3000/users/getuser/" + data._id);
          }
        })
        .then(({ data }) => {
          console.log(data, " ini data darai find one abis register");
          return axios.post("http://localhost:3000/users/signin", {
            ue: username,
            password
          });
        })
        .then(({ data }) => {
          console.log(data, "hasil bikin danlogin");
          localStorage.setItem('token',data)
          this.$emit("isLogin", true);
          this.$emit("whoami")
        })
        .catch(err => {
          console.log(err, "gagal");
        });
    },
    changeForm() {
      this.$emit("changeForm", "login");
    }
  }
};
</script>

<style scoped>
#registerForm {
  margin-top: 15vh;
}
p {
  margin-bottom: 10px;
  margin-top: -10px;
  font-size: 15px;
}
</style>
