<template>
  <div>
    <div class="landing" v-if="isLogin === false || pageNow === 'landing'">
      <landing :activeUser="activeUser" :isLogin="isLogin" @isLogin="changeLogin" @whoami="whoami"></landing>
    </div>
    <div class="home" v-if="isLogin === true">
      <home
        v-if="pageNow === 'home'"
        @changePage="changePage"
        :islogin="isLogin"
        @islogin="changeLogin"
        @toDetail="detailArticle"
      ></home>
      <article-detail :articleData="articleData" v-if="pageNow === 'articleDetail'"></article-detail>
      <addArticle v-if="pageNow === 'newArticle'" @changePage="changePage"></addArticle>
      
    </div>
  </div>
</template>

<script>
import landing from "./components/landing.vue";
import home from "./components/home.vue";
import articleDetail from "./components/articleDetail.vue";
import addArticle from "./components/addNewArticle.vue";
import axi from "./api";

export default {
  components: {
    home,
    landing,
    articleDetail,
    addArticle
  },
  data() {
    return {
      isLogin: false,
      pageNow: "",
      activeUser: "",
      articleData: ''
    };
  },
  methods: {
    changeLogin(val) {
      console.log(val, "di app.vue");
      this.isLogin = val;
      this.changePage("home");
    },
    changePage(page) {
      if (page === "landing") {
        this.$message({
          message: `Log out success.`,
          type: "success"
        });
      }
      this.pageNow = page;
    },
    detailArticle(data){
      console.log('di detail article method',data)
      this.pageNow = data.page
      this.articleData = data.article
    },
    whoami() {
      console.log("ini juga di vue");
      console.log("identifikasi diri sendiri", localStorage.getItem("token"));
      axios
        .get(`http://localhost:3000/users/whoami`, {
          headers: {
            token: localStorage.getItem("token")
          }
        })
        .then(({ data }) => {
          console.log(data, "hmmmmmmmm~~~~");
          console.log("hehehe");
          this.$message({
            message: `Welcome ${data.username} Login success.`,
            type: "success"
          });
          this.activeUser = data;
        })
        .catch(err => {
          console.log("lloh error di ap.vue??");
          console.log(err);
        });
    },
  },
  mounted() {
    if (localStorage.getItem("token")) {
      this.isLogin = true;
      this.pageNow = "home";
    } else {
      this.isLogin = false;
      this.pageNow = "landing";
    }
  }
};
</script>
<style>
* {
  margin: 0px;
  padding: 0px;
  /* height: 100vh; */
  /* width: auto; */
}
</style>

<style scoped>
.landing {
  background-color: #cff2eb;
  background-image: url("https://cdn.dribbble.com/users/1152627/screenshots/5899427/dribbble_upload.png");
  background-position: 95% 55%;
  background-size: 85vh;
  background-repeat: no-repeat;
  height: 100vh;
}
</style>
