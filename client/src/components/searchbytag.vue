<template>
  <el-container>
    <el-header height="80px">
      <h1 class="logo" @click="backtohome">Adioos</h1>

      <div class="navbarRight">
          <h3 class="dashboard" @click="toMyProfile">Dashboard</h3>
        <h3 class="signout" @click="onSignOut">SignOut</h3>
        <!-- <signOut></signOut> -->
      </div>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="16" :offset="4">
          <div class="searchTagMid">
            <h1>Result article by tag "{{foundTags}}" :</h1>
            <el-main>
              <el-col>
                <ListItem
                  v-for="(tag, i) in tagsfound"
                  :key="i"
                  :data="tag"
                  @detailArticle="detailArticle(tag)"
                ></ListItem>
              </el-col>
            </el-main>
            <div class="articlebytag"></div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="searchTagRight">
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import ListItem from "./ListItem.vue";

export default {
  components: {
    ListItem
  },
  props: ["foundTags"],
  data() {
    return {
      tagsfound: []
    };
  },
  methods: {
    detailArticle(article) {
      console.log("article ke ini", article);
      this.$emit("toDetail", {
        page: "articleDetail",
        article,
        dari: "searchtag"
      });
    },
    searchTag() {
      axios({
        url: `http://localhost:3000/articles/searchbytag?tag=${this.foundTags}`,
        method: `GET`,
        headers: {
          token: {
            token: localStorage.getItem("token")
          }
        }
      })
        .then(({ data }) => {
          // console.log(data);
          // console.log("berhasil cari data");
          // console.log("+_+_+_+_");
          this.tagsfound = data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    backtohome(){
      console.log("bakctohomr")
      this.$emit("changePage", "home");
    },
    onSignOut() {
      console.log("berhasil logout");
      this.$emit("islogin", false);
      this.$emit("changePage", "landing");
      localStorage.removeItem("token");
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function() {
        console.log("User signed out.");
      });
    },
    toMyProfile() {
      console.log("ke profileku");
      this.$emit("changePage", "mypage");
    }
  },
  mounted() {
    this.searchTag();
  },
  created() {
    console.log("melihat datanya VVV");
    console.log(this.foundTags, "dari created");
  }
};
</script>

<style>
/* //navbartime */
.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  box-shadow: 0px -8px 20px 0.001px;
}
.logo {
  font-family: "Fascinate", cursive;
  cursor: pointer;
}
.navbarRight {
  display: flex;
  align-items: baseline;
  font-family: "Raleway", sans-serif;
}
.dashboard:hover {
  color: rgb(44, 168, 222);
}
.signout:hover {
  color: rgb(44, 168, 222);
}
.dashboard {
  padding-right: 20px;
  cursor: pointer;
}
.signout {
  cursor: pointer;
}
.searchTagMid{
  font-size: 20px;
  font-family: "Sarala", sans-serif;
}
</style>
