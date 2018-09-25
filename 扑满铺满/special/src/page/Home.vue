<template>
  <div id="Home">
      <van-tabs @click="onClick" :line-width="30">
          <van-tab v-for="(item,index) in list" :title="item.name" :key="index">
            <!--内容 {{ index }}-->
          </van-tab>
      </van-tabs>
      <router-view />
  </div>
</template>

<script>
export default {
    name: 'Home',
    data () {
        return {
            list:[{name:'头 条',url:'/Home'},{name:'理 财',url:'/Home/Reason'},{name:'生 活',url:'/Home/Life'},{name:'视 频',url:'/Home/Video'}]
        }
    },
    methods: {
        onClick(index, title) {
          // this.$toast(title)
            this.$router.push({path: this.list[index].url})
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #Home{
        width: 100%;
    }
</style>
