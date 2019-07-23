<template>
  <div class="home">
    <el-container>
      <el-header height="80px">
        <h1 class="logo">Adioos</h1>

        <div class="navbarRight">
          <el-tooltip content="Click to add new Article" placement="bottom" effect="light">
            <h3 class="add" :articleForm="articleForm" @click="showForm">Add+</h3>
          </el-tooltip>
          <el-tooltip class="item" effect="light" :content="logedUser.username" placement="bottom">
            <h3 class="dashboard" @click="toMyProfile">Dashboard</h3>
          </el-tooltip>
          <h3 class="signout" @click="onSignOut">SignOut</h3>
          <!-- <signOut></signOut> -->
        </div>
      </el-header>

      <div class="pic">
        <img class="carou" :src="image" alt="head" />
        <!-- <form @submit.prevent="searchArticle"> -->
        <el-form class="search" @submit.prevent.native="searchArticle">
          <h2>Search Article</h2>
          <el-form-item label>
            <el-input v-model="searched" placeholder="search title of article..."></el-input>
            <!-- <el-button class="searchButton" type="primary" @click="searchArticle">Primary</el-button> -->
          </el-form-item>
        </el-form>
        <!-- </form> -->
      </div>
      <el-container>
        <el-aside class="leftSide" width="170px"></el-aside>

        <el-main>
          <el-col>
            <ListItem
              v-for="(article, i) in publicArticles"
              :key="i"
              :data="article"
              @detailArticle="detailArticle(article)"
            ></ListItem>
          </el-col>
        </el-main>

        <el-aside width="290px" class="right">
          <el-collapse accordion>
            <el-collapse-item title="My Article" name="myarticle">
              <div v-for="(userArticle,i) in userArticles" :key="i">
                <div class="accordionItem" @click="detailArticle(userArticle)">{{userArticle.title}}</div>
              </div>
            </el-collapse-item>
            <el-collapse-item title="Popular Article" name="articles">
              <div v-for="i in 5" :key="i">
                <div class="accordionItem">{{i}}</div>
              </div>
            </el-collapse-item>
            <el-collapse-item title="Popular Tags" name="tags">
              <div v-for="(topTag,i) in topTags" :key="i">
                <div class="accordionItem" @click="searchByTag(topTag)">{{topTag}}</div>
              </div>
            </el-collapse-item>
          </el-collapse>
          <h1
            style="font-size: 30px; padding-top: 20px; font-family: 'Sarala', sans-serif;"
          >Some News</h1>
          <div v-if="news === []" class="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div class="news" v-for="(newses,i) in news" :key="i">
            <p class="title">{{newses.title | truncate(50)}}</p>
            <p class="desc">{{newses.description | truncate(50)}}</p>
            <a target="blank" :href="newses.url" class="link">read full news</a>
          </div>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import signOut from "./signOut.vue";
import ListItem from "./ListItem.vue";
import axios from '../api'

export default {
  
  components: {
    signOut,
    ListItem
  },
  data() {
    return {
      articleForm: "hide",
      publicArticles: [],
      userArticles: [],
      topTags: [],
      logedUser: {},
      news: [],
      searched: "",
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
    };
  },
  methods: {
    detailArticle(article) {
      console.log("article ke ini", article);
      this.$emit("toDetail", { page: "articleDetail", article, dari: "home" });
    },
    showForm() {
      console.log(this.articleForm);
      this.$emit("changePage", "newArticle");
      if (this.articleForm === "hide") {
        this.articleForm = "show";
      } else if (this.articleForm === "show") {
        this.articleForm = "hide";
      }
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
    },
    fetchArticle() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      axios
        .get(`/articles`)
        .then(({ data }) => {
          loading.close();
          this.publicArticles = data.reverse();
          let popularTag = {};
          data.forEach(element => {
            // console.log(element)
            element.tags.forEach(tag => {
              popularTag[tag] = 1 + (popularTag[tag] || 0);
            });
          });
          // console.log(popularTag,'ini tag popular')
          let keysSorted = Object.keys(popularTag)
            .sort(function(a, b) {
              return popularTag[b] - popularTag[a];
            })
            .slice(0, 5);
          this.topTags = keysSorted;
          // console.log(keysSorted,'ini hasil sort')
        })
        .catch(err => {
          console.log(err);
        });
    },
    fetchUserArticle() {
      axios
        .get(`/articles/logedUser`, {
          headers: {
            token: localStorage.getItem("token")
          }
        })
        .then(({ data }) => {
          console.log(data, "ini user article");
          this.logedUser = data[0].author;

          if (data.length > 5) {
            for (let i = 1; i < 6; i++) {
              console.log(data.length - i);
              this.userArticles.push(data[data.length - i]);
            }
          } else if (data.length < 5 && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              this.userArticles.push(data[i]);
            }
          } else {
            console.log("push yang ini");
            this.userArticles.push({ title: `you dont't have an article yet` });
          }
        });
    },
    moment(date) {
      return moment(date).format("MMM Do YY");
    },
    searchByTag(tag) {
      console.log("search by tag", tag);

      this.$emit("tosearchbytag", {
        page: "searchbytag",
        articletag: tag
      });
    },
    getNews() {
      axios({
        url: `/news/getNews`,
        method: "GET"
      })
        .then(({ data }) => {
          console.log(data, "ini news");
          this.news = data;
        })
        .catch(err => {
          console.log(err);
          this.$message({
            type: "error",
            message: `Oops something wrong`
          });
        });
    },
    searchArticle() {
      console.log(this.searched, "ini searched dari enter");
      this.$emit("searchbyarticle", this.searched);
      this.searched = "";
    }
  },
  computed: {},
  mounted() {
    this.fetchArticle();
    this.fetchUserArticle();
    this.getNews();
  }
};
</script>

<style scoped>
/* * {
  border: 1px solid black;
} */
.search {
  /* color: rgb(9, 11, 26); */
  width: 800px;
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.searchButton {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, 30%);
}
.logo {
  font-family: "Fascinate", cursive;
}
.el-main {
  height: 100vh;
  width: 200px;
  display: flex;
  flex-direction: column;
  padding-top: 0px;
}
.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  box-shadow: 1px 1px 10px 0.5px;
}
.navbarRight {
  display: flex;
  align-items: baseline;
  font-family: "Raleway", sans-serif;
}
.timeline {
  padding: 10px;
  margin: 8px 0px;
}

/* main body */
.el-col {
  display: flex;
  flex-direction: column;
}
.dashboard {
  padding-right: 20px;
  cursor: pointer;
}
image:hover {
  zoom: 20%;
}
.content {
  padding: 10px;
}
.add {
  cursor: pointer;
  padding-right: 20px;
}
.signout {
  cursor: pointer;
}
.leftSide {
  /* border: 1px solid black; */
  padding: 20px;
}
.carou {
  width: 100%;
  height: 350px;
  object-fit: cover;
  /* border: 1px solid blue; */
  margin-bottom: 20px;
  opacity: 0.8;
  /* box-shadow: 1px 1px 10px 0.5px; */
}
.right {
  /* border: 1px solid black */
  font-family: "Sarala", sans-serif;
  font-size: 15px;
  font-weight: 700;
  text-transform: capitalize;
  height: 100vh;
}
.accordionItem {
  cursor: pointer;
}
.news {
  border: 0.6px solid grey;
  margin-right: 15px;
  margin-top: 10px;
  height: 110px;
  border-radius: 4px;
  /* box-shadow: 0px 0px 5px 0.001px; */
}
.news {
  font-family: "Sarala", sans-serif;
  font-size: 13px;
  font-weight: 400;
  padding: 12px 15px;
}
.title {
  font-size: 13px;
  font-weight: 600;
}
.el-input__inner {
  height: 35px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
}

/* /// css loader */
.lds-roller {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
}
.lds-roller div {
  animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  transform-origin: 32px 32px;
}
.lds-roller div:after {
  content: " ";
  display: block;
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #000;
  margin: -3px 0 0 -3px;
}
.lds-roller div:nth-child(1) {
  animation-delay: -0.036s;
}
.lds-roller div:nth-child(1):after {
  top: 50px;
  left: 50px;
}
.lds-roller div:nth-child(2) {
  animation-delay: -0.072s;
}
.lds-roller div:nth-child(2):after {
  top: 54px;
  left: 45px;
}
.lds-roller div:nth-child(3) {
  animation-delay: -0.108s;
}
.lds-roller div:nth-child(3):after {
  top: 57px;
  left: 39px;
}
.lds-roller div:nth-child(4) {
  animation-delay: -0.144s;
}
.lds-roller div:nth-child(4):after {
  top: 58px;
  left: 32px;
}
.lds-roller div:nth-child(5) {
  animation-delay: -0.18s;
}
.lds-roller div:nth-child(5):after {
  top: 57px;
  left: 25px;
}
.lds-roller div:nth-child(6) {
  animation-delay: -0.216s;
}
.lds-roller div:nth-child(6):after {
  top: 54px;
  left: 19px;
}
.lds-roller div:nth-child(7) {
  animation-delay: -0.252s;
}
.lds-roller div:nth-child(7):after {
  top: 50px;
  left: 14px;
}
.lds-roller div:nth-child(8) {
  animation-delay: -0.288s;
}
.lds-roller div:nth-child(8):after {
  top: 45px;
  left: 10px;
}
@keyframes lds-roller {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
