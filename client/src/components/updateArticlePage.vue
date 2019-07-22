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
      <el-row :gutter="20">
        <el-col :span="18" :offset="3">
          <div class="form">
            <el-form ref="form" :label-position="'top'" :model="article" label-width="120px">
              <el-form-item label="Title: " :label-position="'top'">
                <el-input v-model="article.title"></el-input>
              </el-form-item>
              <el-form-item label="Tags: " :label-position="'top'">
                <el-input v-model="joinedTag"></el-input>
              </el-form-item>
              <el-form-item :label-position="'top'">
                <el-upload
                  class="upload-demo"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :on-success="handleSuccess"
                  :file-list="fileList"
                  :limit="1"
                  list-type="picture"
                  v-model="file"
                >
                  <el-button size="small" type="primary" ref="file">Click to upload</el-button>
                  <div slot="tip" class="el-upload__tip">jpg/png files with a size less than 500kb</div>
                </el-upload>
              </el-form-item>
              <el-form-item label="Content: " :label-position="'top'">
                <textarea id="editor" name="editor" @change="getVal()"></textarea>
              </el-form-item>
              <el-button type="success" @click="saveArticle('Published',article._id)">Post!</el-button>
            </el-form>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple"></div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
export default {
  props: ["editArticleId"],
  data() {
    return {
      article: {},
      file: "",
      fileList: []
    };
  },
  methods: {
    getEditor() {
      var editor = new Jodit("#editor", {
        height: 350,
        autofocus: true,
        iframe: true,
        uploader: {
          insertImageAsBase64URI: true
        },
        toolbarButtonSize: "small"
      });

      //   this.fetchData()
      //   console.log(this.article.title);
      // editor.value = this.article.title;
    },
    getVal() {
      this.article.description = document.getElementById("editor").value;
    },
    setVal() {
      console.log("menaroh data ke wysiwyg", this.article.content);
      document.getElementById("editor").value = this.article.content;
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
    fetchData() {
      console.log("akan mengambil data");
      axios({
        url: `http://localhost:3000/articles/${this.editArticleId}`,
        method: "GET",
        headers: {
          token: localStorage.getItem("token")
        }
      })
        .then(({ data }) => {
          console.log(data, " ini data yang akan diedit");
          this.article = data;
          this.setVal();
        })
        .catch(err => {
          console.log(err);
        });
    },
    saveArticle(status, articleId) {
      console.log(status);
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
        text: "Your article is being processed...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      axios({
        url: `http://localhost:3000/articles/${articleId}`,
        method: "PATCH",
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
          loading.close();
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
    backtohome() {
      console.log("bakctohomr dari update");
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
    toMyProfile() {
      console.log("ke profileku");
      this.$emit("change", "mypage");
    }
  },
  mounted() {
    this.getEditor();
  },
  created() {
    console.log(this.editArticleId, "ini id yang akan di edit");
    this.fetchData();
  },
  computed: {
    joinedTag() {
      if (this.article.tags) {
        console.log(this.article.tags.join(","));
        return this.article.tags.join(",");
      } else {
        return "";
      }
    }
  }
};
</script>

<style>
.form {
  font-family: "Sarala", sans-serif;
}
.el-form-item__label{
  font-size: 20px;
  font-weight: 700;
}
</style>
