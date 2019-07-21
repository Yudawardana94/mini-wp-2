<template>
  <el-container>
    <el-header>Header</el-header>
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
              <p class="bookmarkcount">{{article.bookmarked.length}}</p>
              <a v-on:click="bookmark(article._id)">
                <i class="far fa-bookmark"></i>
              </a>
            </div>
            <div class="clapper">
              <p class="clappercount">{{article.clapper.length}}</p>
              <a @click="clap(article._id)">
                <i class="far fa-heart"></i>
              </a>
            </div>
          </div>
        </el-col>
        <el-col :span="14">
          <div class="grid-content bg-purple-dark">
            <h1 class="contenttitle">{{article.title}}</h1>
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
            <el-tag v-for="(tag,i) in article.tags" :key="i" type="info" class="articleTag" @click="searchByTag(tag)">{{tag}}</el-tag>
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
                <p>Writen By: </p>
                <h2> {{article.author.username}} </h2>
                <p>{{article.author.email}} </p>
              </div>
            </el-col>
            <el-col :span="2">
              <div class="grid-content bg-purple">
                <el-button type="primary" plain @click="follow(article.author._id)">Follow</el-button>
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
          console.log(data.data, "ini habis ngebookmark");

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
      axios
        .get(`http://localhost:3000/articles`)
        .then(({ data }) => {
          //   console.log(data);
          this.article = data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    follow(userId){
      console.log('akan ngefollow',userId)

    },
    searchByTag(tag){
      console.log('search by tag')
    }
  },
  mounted() {
    // console.log(this.article);
    // console.log(this.articleData, "=-=-=-=-ini article data=-=-=-=-=");
  },
  created() {
    this.article = this.articleData;
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
  box-shadow: 5px 5px 15px 0.001px;
}
.leftInfo {
  /* border: 1px solid black; */
  padding: 20px 30px 20px 20px;
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
  font-size: 20px;
}
.contenttitle::first-letter {
  text-transform: capitalize;
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
}
.authordata {
  margin: 0px 15px;
  width: 450px;
  display: flex;
  flex-direction: column;
}
.bookmark {
  display: flex;
  flex-direction: row;
  /* justify-content: fle; */
  margin: 10px 10px;
}
.clapper {
  display: flex;
  flex-direction: row;
  /* justify-content: center; */
  margin: 10px 10px;
}
.bookmarkcount {
  margin: 0px 15px;
}
.clappercount {
  margin: 0px 15px;
}
.tagBox {
  /* border: 1px solid greenyellow; */
  margin-top: 70px;
  padding: 15px 10px;
}
.userProfileBot {
  /* border: 1px solid blueviolet; */
  height: 20vh;
  padding: 20px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.articleTag {
  margin: 0px 3px;
  cursor: pointer;
}
.botAvatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>
