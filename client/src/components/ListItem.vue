<template>
  <div class="card" v-if="data">
    <img class="image" :src="data.image" />
    <span class="content">
      <h1 class="title">{{ data.title }}</h1>
      <!-- <div v-html="truncate"/> -->
      <p class="data">{{data.content | truncate(220)}}</p>
      <!-- <p v-html="data.content | truncate(220)"></p> -->
      <div class="bot">
        <div class="left">
          <p>
            author:
            <span>{{ data.author.username}}</span>
          </p>
          <span>{{ data.createdAt | moment("MMMM Do YYYY") }}</span>
        </div>
        <div class="right">
          <a @click="detailPage(data)">Read More</a>
        </div>
      </div>
      <!-- <p>{{ data.createdAt | moment("MMM Do YY");  }} || @{{ data.author.username }}</p> -->
    </span>
  </div>
</template>

<script>
export default {
  props: ["data"],
  computed: {},
  methods: {
    detailPage(data) {
      console.log("yomann");
      console.log(data);
      this.$emit("detailArticle", data);
    }
  },
  created() {
    console.log(this.data, "ini dari cereatednyaa~~");
  }
};
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: row;
  margin: 5px 0px 15px 0px;
  /* border: 1px solid grey; */
  box-shadow: 0 0px 5px 0.001px;
  border-radius: 5px;
  height: 190px;
  font-family: "Sarala", sans-serif;
}
.image {
  max-width: 100%;
  height: auto;
  width: 230px;
  object-fit: cover;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.image:hover {
  background-color: yellow;
}
.content {
  width: 550px;
  padding: 13px 10px 10px 25px;
  /* padding-left: 20px; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: space-between;
}
.bot {
  display: flex;

  justify-content: space-between;
  align-items: flex-end;
  /* align-self: flex-end; */
  padding-top: 6px;
}
.data{
    font-size: 13px;
    padding-top: 5px;
    padding-bottom: 0px;
}
a {
  cursor: pointer;
}
h1 {
  font-family: 'Lato', sans-serif;
}
.left{
  font-size: 13px;
  font-weight: 700;
}
.right{
  font-size: 16px;
  font-weight: 800;
  color: rgb(21, 85, 183);
  padding-right: 30px;
}
.right:hover{
  color: rgb(97, 173, 240);
}
.title{
  font-size: 21px;
  font-weight: 800;
  text-transform: capitalize;
}
</style>
