<template>
  <el-container>
    <el-header height="80px">
      <h1 class="logo" @click="backtohome">Adioos</h1>

      <div class="navbarRight">
        <h3 class="signout" @click="onSignOut">SignOut</h3>
      </div>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="5">
          <div class="left"></div>
        </el-col>
        <el-col :span="14">
          <div class="mid">
            <el-row class="top">
              <el-col :span="8" class="userInfoParent">
                <div class="grid-content bg-purple">
                  <div class="follo">
                    <div class="following">
                      <h3 style="font-size: 40px;">{{following}}</h3>
                      <span style="font-size: 15px;">following</span>
                    </div>
                    <p></p>
                    <div class="follower">
                      <h3 style="font-size: 40px;">{{follower}}</h3>
                      <span style="font-size: 15px;">follower</span>
                    </div>
                  </div>
                  <h1 class="username">{{usersInfo.username}}</h1>
                  <p class="email">{{usersInfo.email}}</p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content bg-purple-light"></div>
              </el-col>
              <el-col :span="8" class="avatarParent">
                <div class="grid-content bg-purple">
                  <img :src="usersInfo.avatar" alt class="avatar" />
                </div>
              </el-col>
            </el-row>
            <br />
            <hr />
            <br />
            <el-row class="bottom">
              <el-col :span="24">
                <div class="myArticle" v-for="(article,i) in userArticles" :key="i">
                  <div class="cardMyProfile">
                    <div class="articleimage">
                      <img :src="article.image" alt class="articleimagefit" />
                    </div>
                    <div class="articlebody">
                      <div style="padding: 3px; cursor: pointer" class="articlebodytitle">
                        <h3>{{article.title}}</h3>
                      </div>
                      <div style="padding: 3px;" class="articlebodytag">
                        <el-tag
                          class="tag"
                          type="primary"
                          size="mini"
                          effect="plain"
                          @click="searchByTag(tag)"
                          v-for="(tag,i) in article.tags"
                          :key="i"
                        >{{tag}}</el-tag>
                      </div>
                      <div style="padding: 3px;" class="articlebodymenus">
                        <el-tooltip
                          class="item"
                          effect="light"
                          content="Click to edit this article"
                          placement="left-start"
                        >
                          <el-button
                            size="mini"
                            class="articlebodymenusicon"
                            type="primary"
                            icon="el-icon-edit"
                            @click="editArticle(article._id)"
                            circle
                          ></el-button>
                        </el-tooltip>
                        <el-tooltip
                          class="item"
                          effect="light"
                          content="Right Bottom prompts info"
                          placement="right-end"
                        >
                          <el-button
                            size="mini"
                            class="articlebodymenusicon"
                            type="danger"
                            icon="el-icon-delete"
                            @click="remove(article._id)"
                            circle
                          ></el-button>
                        </el-tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="right"></div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      userArticles: [],
      usersInfo: {}
    };
  },
  methods: {
    fetchData() {
      axios({
        url: `http://localhost:3000/articles/logedUser`,
        method: "GET",
        headers: {
          token: localStorage.getItem("token")
        }
      })
        .then(({ data }) => {
          console.log(data);
          this.userArticles = data.reverse();
        })
        .catch(err => {
          console.log(err);
        });
    },
    whoami() {
      axios({
        url: `http://localhost:3000/users/whoami`,
        method: `GET`,
        headers: {
          token: localStorage.getItem("token")
        }
      }).then(({ data }) => {
        console.log(data, "ini data user");
        this.usersInfo = data;
      });
    },
    remove(articleId) {
      console.log(`loh kok ${articleId} dihapus??`);
      this.$confirm(
        "This will permanently delete the file. Continue?",
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning"
        }
      )
        .then(() => {
          axios({
            url: `http://localhost:3000/articles/${articleId}`,
            method: "DELETE",
            headers: {
              token: localStorage.getItem("token")
            }
          })
            .then(({ data }) => {
              console.log(data, "berhasil di delete");
              this.$message({
                type: "success",
                message: "Delete completed"
              });
              this.fetchData();
              this.whoami();
            })
            .catch(err => {
              console.log(err);
              this.$message({
                type: "info",
                message: "Error"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Delete canceled"
          });
        });
    },
    editArticle(articleId) {
      console.log(`${articleId}ini diedit ya, deadline besok `);
      this.$emit("changePage", { page: "updatearticle", articleId });
    },
    backtohome() {
      console.log("bakctohomr");
      this.$emit("change", "home");
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
    searchByTag(tag) {
      console.log("search by tag", tag);

      this.$emit("tosearchbytag", {
        page: "searchbytag",
        articletag: tag
      });
    }
  },
  mounted() {
    this.fetchData();
    this.whoami();
    console.log(this.usersInfo);
  },
  created() {},
  computed: {
    following() {
      if (this.usersInfo.following) {
        return this.usersInfo.following.length;
        // return 100
      } else {
        return 0;
      }
    },
    follower() {
      if (this.usersInfo.follower) {
        return this.usersInfo.follower.length;
        // return 10
      } else {
        return 0;
      }
    }
  }
};
</script>

<style scoped>
.left {
  /* border: 1px solid black; */
  height: 87vh;
}
.mid {
  /* border: 1px solid black; */
  height: 87vh;
  display: flex;
  /* justify-content: space-between; */
  flex-direction: column;
}
.right {
  /* border: 1px solid black; */
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 87vh;
}
.top {
  height: 200px;
  /* border: 1px solid black; */
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-family: "Sarala", sans-serif;
}
.bottom {
  height: 450px;
  /* border: 1px solid black; */
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.avatar {
  width: 120px;
  height: auto;
  border-radius: 50%;
}
.avatarParent {
  justify-content: center;
  display: flex;
  align-items: center;
}
.userInfoParent {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-right: 30px;
  padding-top: 23px;
}
.cardMyProfile {
  height: 90px;
  border: 2px solid grey;
  border-radius: 5px;
  padding: 15px 20px 10px 20px;
  display: flex;
  flex-direction: row;
  align-content: center;
}
.articleimagefit {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
}
.articlebody {
  /* border: 1px solid goldenrod; */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px 10px;
  align-content: space-between;
}
.articlebodytag {
  display: flex;
  flex-direction: row;
}
.tag {
  margin: 0px 3px;
  cursor: pointer;
}
.nabarRight {
  font-family: "Raleway", sans-serif;
}
.signout {
  padding-right: 30px;
}
.logo {
  font-size: 30px;
  padding-left: 30px;
  font-family: "Fascinate", cursive;
  cursor: pointer;
}
.signout:hover {
  color: rgb(44, 168, 222);
}
.signout {
  cursor: pointer;
}
.el-header {
  box-shadow: 0px -8px 20px 0.001px;
}
.username {
  font-size: 40px;
  /* padding-bottom: -10px; */
  text-transform: capitalize;
}
.email {
  margin-top: -10px;
  font-size: 20px;
}
.follo {
  display: flex;
  flex-direction: row;
}
.following {
  display: flex;
  flex-direction: column;
  justify-content: baseline;
  padding-right: 35px;
  align-items: center;
}
.follower {
  display: flex;
  flex-direction: column;
  justify-content: baseline;
  padding-right: 35px;
  align-items: center;
}
</style>
