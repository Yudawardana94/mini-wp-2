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
        @tosearchbytag="searchbyTag"
        @searchbyarticle="searchbyarticle"
      ></home>
      <article-detail
        :articleData="articleData"
        v-if="pageNow === 'articleDetail'"
        @tosearchbytag="searchbyTag"
        @changePage="changePage"
        :islogin="isLogin"
        @islogin="changeLogin"
      ></article-detail>
      <addArticle v-if="pageNow === 'newArticle'" @changePage="changePage"></addArticle>
      <searchbytag
        v-if="pageNow === 'searchbytag'"
        @changePage="changePage"
        :islogin="isLogin"
        @islogin="changeLogin"
        @toDetail="detailArticle"
        :foundTags="foundTags"
      ></searchbytag>
      <mypage
        v-if="pageNow === 'mypage'"
        @tosearchbytag="searchbyTag"
        @change="changePage"
        :islogin="isLogin"
        @islogin="changeLogin"
        @addArticle="changePage"
        @changePage="editArticle"
      ></mypage>
      <updatearticle
        v-if="pageNow === 'updatearticle'"
        :editArticleId="editArticleId"
        @changePage="updateArticle"
        @change="changePage"
      ></updatearticle>
      <searchbyarticle
        @changePage="changePage"
        :islogin="isLogin"
        @islogin="changeLogin"
        @toDetail="detailArticle"
        :clue="clue"
        v-if="pageNow === 'searchbyarticle'"
      ></searchbyarticle>
    </div>
  </div>
</template>

<script>
import landing from "./components/landing.vue";
import home from "./components/home.vue";
import articleDetail from "./components/articleDetail.vue";
import addArticle from "./components/addNewArticle.vue";
import searchbytag from "./components/searchbytag.vue";
import updatearticle from "./components/updateArticlePage.vue";
import mypage from "./components/myProfilePage.vue";
import searchbyarticle from "./components/searchbyarticle.vue";
import axi from "./api";

export default {
  components: {
    home,
    landing,
    articleDetail,
    addArticle,
    searchbytag,
    updatearticle,
    mypage,
    searchbyarticle
  },
  data() {
    return {
      isLogin: false,
      pageNow: "",
      activeUser: "",
      articleData: "",
      editArticleId: "",
      foundTags: "",
      updateData: "",
      clue: ""
    };
  },
  methods: {
    changeLogin(val) {
      console.log(val, "di app.vue");
      this.isLogin = val;
      this.changePage("home");
    },
    changePage(page) {
      console.log("change to", page);
      if (page === "landing") {
        this.$message({
          message: `Log out success.`,
          type: "success"
        });
      }
      this.pageNow = page;
    },
    editArticle(data) {
      console.log(data, "ini data dari my profile");
      this.pageNow = data.page;
      this.editArticleId = data.articleId;
      console.log(this.editArticleId, "ini dari app.vue");
    },
    detailArticle(data) {
      console.log("di detail article method", data);
      this.pageNow = data.page;
      this.articleData = data.article;
    },
    searchbyTag(data) {
      console.log("sudah sampe app.vue");
      console.log(data, "isi datanya mana?");

      this.pageNow = data.page;
      this.foundTags = data.articletag;
      console.log(this.foundTags);
    },
    updateArticle(data) {
      this.pageNow = data.page;
      this.updateData = data.articleId;
      this.editArticleId = data.articleId;
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
    searchbyarticle(clue) {
      console.log(clue, "ini clue yang dicarinya");
      this.pageNow = "searchbyarticle";
      this.clue = clue;
      console.log(this.clue, "ini this.clue");
    }
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
