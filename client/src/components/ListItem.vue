<template>
  <div class="card" v-if="data">
    <img class="image" :src="data.image" />
    <span class="content">
      <h1>{{ data.title }}</h1>
      <!-- <div v-html="truncate"/> -->
      <p class="data">{{data.content | truncate(220)}}</p>
      <!-- <p v-html="{{data.content | truncate(220)}}"></p> -->
      <br />
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
      detailPage(data){
          console.log('yomann')
          console.log(data)
          this.$emit('detailArticle',data)
      }
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
  border-radius: 2%;
  height: 190px;
}
.image {
  max-width: 100%;
  height: auto;
  width: 230px;
  object-fit: cover;
  border-top-left-radius: 5%;
  border-bottom-left-radius: 5%;
}
.image:hover { 
  background-color: yellow;
}
.content {
  width: 470px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-content: space-between;
}
.bot{
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}
/* .data{
    min-height: 100px;
} */
a{
    cursor: pointer;
}
</style>
