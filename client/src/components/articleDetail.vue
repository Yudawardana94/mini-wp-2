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
        <el-col :span="22" :offset="1">
          <div class="grid-content bg-purple-dark">
            <!-- {{articleData.image}} -->
            <img class="image" :src="article.image" />
          </div>
        </el-col>
        <el-col :span="1"></el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <div class="leftInfo">
            <div class="bookmark">
              <a v-on:click="bookmark(article._id)">
                <i style="cursor: pointer" class="far fa-bookmark"></i>
              </a>
              <p class="bookmarkcount">{{article.bookmarked.length}}</p>
            </div>
            <div class="clapper">
              <a @click="clap(article._id)">
                <i style="cursor: pointer" class="far fa-heart"></i>
              </a>
              <p class="clappercount">{{article.clapper.length}}</p>
            </div>
          </div>
        </el-col>
        <el-col :span="14">
          <div class="grid-content bg-purple-dark">
            <h1 class="contenttitle">{{article.title}}</h1>
            <br />
            <el-row>
              <el-col :span="1">
                <div></div>
              </el-col>

              <el-col :span="22">
                <div class="authorInfo">
                  <img :src="article.author.avatar" alt="author" class="avatar" />
                  <div class="authordata">
                    <p>{{article.author.username}}</p>
                    <p>{{article.createdAt | moment("MMMM Do YYYY")}}</p>
                  </div>
                </div>
              </el-col>
            </el-row>
            <div class="content" v-html="article.content"></div>
          </div>
          <div class="tagBox">
            <h3 style="margin-bottom: 10px; margin-left: 10px;">Tags:</h3>
            <el-tag
              v-for="(tag,i) in article.tags"
              :key="i"
              class="articleTag"
              @click="searchByTag(tag)"
            >{{tag}}</el-tag>
          </div>
          <br />
          <hr />
          <!-- <div class="userProfileBot"> -->
          <el-row class="userProfileBot">
            <el-col :span="5">
              <div class="grid-content bg-purple">
                <img :src="article.author.avatar" alt="avatar" class="botAvatar" />
              </div>
            </el-col>
            <el-col :span="17">
              <div class="grid-content bg-purple-light">
                <p>Writen By:</p>
                <h1>{{article.author.username}}</h1>
                <p>{{article.author.email}}</p>
              </div>
            </el-col>
            <el-col :span="2">
              <div class="grid-content bg-purple">
                <el-button
                  v-if="hasfollow === false"
                  type="primary"
                  plain
                  @click="follow(article.author._id)"
                >Follow</el-button>
                <el-button
                  v-if="hasfollow === true"
                  type="primary"
                  plain
                  @click="follow(article.author._id)"
                >Unfollow</el-button>
              </div>
            </el-col>
          </el-row>
          <!-- </div> -->
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
export default {
  props: ["articleData"],
  data() {
    return {
      article: "",
      hasfollow: "",
      hasclap: "",
      hasbookmarked: ""
    };
  },
  methods: {
    clap(id) {
      console.log("ngeclap ini", id);
      console.log(`http://localhost:3000/articles/clap/${id}`);
      axios({
        url: `http://localhost:3000/articles/clap/${id}`,
        method: "PATCH",
        headers: {
          token: localStorage.getItem("token")
        }
      })
        .then(({ data }) => {
          console.log(data.data, "ini habis ngeclap");

          if (data.message === "Claped") {
            this.$message({
              message: "clapped",
              type: "success"
            });
          } else {
            this.$message({
              message: "Unclapped",
              type: "success"
            });
          }
          this.article = data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    bookmark(id) {
      console.log("ngebookmark ini", id);
      console.log(`http://localhost:3000/articles/bookmark/${id}`);
      axios({
        url: `http://localhost:3000/articles/bookmark/${id}`,
        method: "PATCH",
        headers: {
          token: localStorage.getItem("token")
        }
      })
        .then(({ data }) => {
          console.log(data, "ini habis ngebookmark");

          if (data.message === "Bookmarked") {
            this.$message({
              message: "Bookmarked",
              type: "success"
            });
          } else {
            this.$message({
              message: "UnBookmarked",
              type: "success"
            });
          }
          this.article = data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    fetchArticle() {
      console.log("berhasil ngefetch");

      axios
        .get(`http://localhost:3000/articles`)
        .then(({ data }) => {
          console.log(data, ", ;hasil fetch");
          this.article = data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    follow(targetId) {
      console.log(this.hasfollow, "ini status follownya");
      console.log("akan ngefollow", targetId);
      axios({
        url: `http://localhost:3000/users/check`,
        method: "POST",
        data: {
          targetId: targetId
        },
        headers: {
          token: localStorage.getItem("token")
        }
      })
        .then(({ data }) => {
          if (data.checked === true) {
            console.log("ke unfoll");
            return axios({
              url: `http://localhost:3000/users/unfollow`,
              method: "PATCH",
              data: {
                targetId: targetId
              },
              headers: {
                token: localStorage.getItem("token")
              }
            });
          } else {
            console.log("ke foll");
            return axios({
              url: `http://localhost:3000/users/follow`,
              method: "PATCH",
              data: {
                targetId: targetId
              },
              headers: {
                token: localStorage.getItem("token")
              }
            });
          }
        })
        .then(({ data }) => {
          console.log(data, "samapi jauh disini");
          if (this.hasfollow) {
            this.hasfollow = false;
          } else {
            this.hasfollow = true;
          }
        })
        .catch(err => {
          console.log("eh loh gagal");
          console.log(err);
        });
    },
    getAnArticle() {
      axios({
        url: "http://localhost:3000/articles/anArticle/" + this.article._id,
        method: "GET",
        headers: {
          token: localStorage.getItem("token")
        }
      })
        .then(({ data }) => {
          console.log(data, "satu dada yang sangat berarti");
          this.article = data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    searchByTag(tag) {
      console.log("search by tag", tag);

      this.$emit("tosearchbytag", {
        page: "searchbytag",
        articletag: tag
      });
    },
    checkFollow() {
      console.log("ini juga di vue");
      console.log(this.article, " ini articlenya dari detail");

      console.log(this.article.author._id, " ini id authornya");
      // console.log("identifikasi diri sendiri", localStorage.getItem("token"));
      axios({
        url: `http://localhost:3000/users/check`,
        method: "POST",
        data: {
          targetId: this.article.author._id
        },
        headers: {
          token: localStorage.getItem("token")
        }
      })
        .then(({ data }) => {
          console.log(data, "data saya");
          this.hasfollow = data.checked;
        })
        .catch(err => {
          console.log("loh error");
        });
    },
    backtohome() {
      console.log("bakctohomr");
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
    this.checkFollow();
  },
  computed: {},
  created() {
    this.article = this.articleData;
    // this.fetchArticle()
    // console.log(this.articleData, "ini di created");
    console.log(this.article, "ini article di created");
  }
};
</script>

<style scoped>
.image {
  width: 100%;
  max-height: 450px;
  object-fit: cover;
  /* border: 1px solid salmon; */
  margin-bottom: 30px;
  /* box-shadow: 5px 5px 15px 0.001px; */
}
.leftInfo {
  /* border: 1px solid black; */
  padding: 20px 50px 20px 20px;
  height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
}
h1 {
  font-size: 40px;
}
.content {
  margin-top: 20px;
  font-size: 20px;
  font-family: "Sarala", sans-serif;
  text-align: justify
}
.contenttitle::first-letter {
  text-transform: capitalize;
}
.contenttitle {
  font-family: "Raleway", sans-serif;
  font-size: 55px;
  font-weight: 900;
}
.authorInfo {
  display: flex;
  flex-direction: row;
  margin: 10px 15px;
  margin-bottom: 30px;
}
.avatar {
  width: 35px;
  height: auto;
  border-radius: 3px;
}
.authordata {
  margin: 0px 15px;
  width: 450px;
  display: flex;
  flex-direction: column;
  font-family: 'Lato', sans-serif;
  font-weight: 700
}
.bookmark {
  display: flex;
  flex-direction: row;
  /* justify-content: fle; */
  font-size: 26px;
  margin: 10px 10px;
}
.clapper {
  display: flex;
  flex-direction: row;
  font-size: 26px;
  /* justify-content: center; */
  margin: 10px 12px;
}
.bookmarkcount {
  margin: -9px 21px;
  font-family: "Sarala", sans-serif;
  font-size: 25px;
}
.clappercount {
  margin: -9px 19px;
  font-family: "Sarala", sans-serif;
  font-size: 25px;
}
.tagBox {
  /* border: 1px solid greenyellow; */
  margin-top: 40px;
  padding: 15px 10px;
  font-family: 'Lato', sans-serif;
}
.userProfileBot {
  /* border: 1px solid blueviolet; */
  height: 20vh;
  padding: 20px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: 'Lato', sans-serif;
}
.articleTag {
  margin: 0px 3px;
  cursor: pointer;
}
.botAvatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid rgb(66, 67, 77);
}

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
/* .logo:hover{
  font-size: 55px;
} */
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
</style>
