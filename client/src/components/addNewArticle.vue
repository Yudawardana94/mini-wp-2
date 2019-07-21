<template>
  <el-container>
    <el-header>
      <h1 class="logo">Adioos</h1>

      <div class="navbarRight">
        <el-button type="primary" @click="saveArticle('Unpublished')" round class="buttonPost">Save to Draft</el-button>
        <h3 class="signout" @click="onSignOut">SignOut</h3>
        <!-- <signOut></signOut> -->
      </div>
    </el-header>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="20" :offset="2">
          <form>
            <div class="grid-content bg-purple">
              <p>Title</p>
              <el-input v-model="article.title"></el-input>
              <br />
              <br />
              <p>Tags</p>
              <el-input v-model="article.tags"></el-input>
              <p style="margin-left: 30px;">separate inputed tag by coma ( , )</p>
              <br />
              <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :file-list="fileList"
                :limit="2"
                list-type="picture"
                v-model="file"
              >
                <el-button size="small" type="primary" ref="file">Click to upload</el-button>
                <div slot="tip" class="el-upload__tip">jpg/png files with a size less than 500kb</div>
              </el-upload>
              <br />
              <p>Create Article :</p>
              <textarea id="editor" name="editor" @change="getVal()"></textarea>
            </div>
            <!-- <input type="submit" @submit.prevent="saveArticle('Unpublished')"> -->
            <br />
            <br />
            <el-button type="success" @click="saveArticle('Published')" >Post!</el-button>
          </form>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple"></div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
export default {
  //   props: ["articleForm"],
  data() {
    return {
      article: {
        title: "",
        image: "",
        description: "",
        tags: "",
        status: ""
      },
      file: "",
      fileList: []
    };
  },
  methods: {
    getEditor() {
      console.log("berhasil dipanggil");
      var editor = new Jodit("#editor", {
        height: 350,
        autofocus: true,
        iframe: true,
        uploader: {
          insertImageAsBase64URI: true
        },
        toolbarButtonSize: "small"
      });
    },
    getVal() {
      this.article.description = document.getElementById("editor").value;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log("hehhehe");
      console.log(file);
    },
    handleSuccess(response, file, filelist) {
      console.log("hehehe, berhasil success aye aye");
      console.log(file.raw);
      this.article.image = file.raw;
    },
    upload() {
      console.log("hehehe");
      console.log(this.$ref);
    },
    saveArticle(status) {
      console.log(status)
      this.article.status = status;
      console.log(this.article, "ini berhasil di submit");
      let formData = new FormData();
      formData.append("title", this.article.title);
      formData.append("image", this.article.image);
      formData.append("content", this.article.description);
      formData.append("tags", this.article.tags);
      formData.append("status", this.article.status);

      const loading = this.$loading({
          lock: true,
          text: 'Your article is being processed...',
          spinner: 'https://cdn.dribbble.com/users/200228/screenshots/2428662/svg.gif',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      axios({
        method: "post",
        url: "http://localhost:3000/articles",
        data: formData,
        config: {
          headers: {
            token: localStorage.getItem("token"),
            "Content-Type": "multipart/form-data"
          }
        },
        headers: {
          token: localStorage.getItem("token")
        }
      })
        .then(({ data }) => {
          loading.close()
          console.log("eedededededeh");
          console.log(data);
          this.$message({
            message: `Article has been created.`,
            type: "success"
          });
          this.changePage("home");
        })
        .catch(err => {
          this.$message({
            message: `Failed to post article`,
            type: "fail"
          });
        });
    },
    changePage(val) {
      this.$emit("changePage", val);
    },
    onSignOut() {
      console.log("berhasil logout");
      this.$emit("islogin", false);
      this.$emit("changePage", "landing");
      localStorage.removeItem("token");
    }
  },
  mounted() {
    this.getEditor();
    // console.log(this.articleForm,'darisini')
  }
};
</script>

<style scoped>
.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  position: sticky;
  z-index: 100;
}
.navbarRight {
  display: flex;
  align-items: baseline;
  top: 0;
}
.el_main {
  position: absolute;
  top: 60px;
}
.buttonPost {
  margin-right: 25px;
}
</style>
