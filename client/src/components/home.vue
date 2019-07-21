<template>
  <div class="home">
    <el-container>
      <el-header height="80px">
        <h1 class="logo">Adioos</h1>

        <div class="navbarRight">
          <h3 class="add" :articleForm="articleForm" @click="showForm">Add+</h3>
          <h3 class="signout" @click="onSignOut">SignOut</h3>
          <!-- <signOut></signOut> -->
        </div>
      </el-header>

      <el-container>
        <el-aside class="leftSide" width="250px"></el-aside>

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
        <el-aside width="230px">
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
              <div v-for="i in 5" :key="i">
                <div class="accordionItem">{{i}}</div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import signOut from "./signOut.vue";
import ListItem from "./ListItem.vue";

export default {
  components: {
    signOut,
    ListItem
  },
  data() {
    return {
      articleForm: "hide",
      publicArticles: [],
      userArticles: []
    };
  },
  methods: {
    detailArticle(article) {
      console.log("article ke ini", article);
      this.$emit("toDetail", { page: "articleDetail", article });
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
    },
    fetchArticle() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      axios
        .get(`http://localhost:3000/articles`)
        .then(({ data }) => {
          loading.close();
          console.log("berhasil masup doonggg");
          console.log(data);
          this.publicArticles = data.reverse();
        })
        .catch(err => {
          console.log(err);
        });
    },
    fetchUserArticle() {
      axios
        .get(`http://localhost:3000/articles/logedUser`, {
          headers: {
            token: localStorage.getItem("token")
          }
        })
        .then(({ data }) => {
          console.log(data, "ini user article");

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
    }
  },
  computed: {
    displayedText() {
      return "display";
      // console.log(text.length);
      // let displayed = text.substr(0, 250) + '...';
      // console.log(displayed);
      // return displayed;
    }
  },
  mounted() {
    this.fetchArticle();
    this.fetchUserArticle();
  }
};
</script>

<style scoped>
/* * {
  border: 1px solid black;
} */
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
}
.navbarRight {
  display: flex;
  align-items: baseline;
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
/* .card {
  display: flex;
  flex-direction: row;
  margin: 5px 0px 15px 0px;
  border: 2px solid black;
  border-radius: 2%;
  height: 180px;
}
.image {
  max-width: 100%;
  height: auto;
  width: 230px;
  object-fit: cover;
} */
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
</style>
