<template>
  <div class="a">
    {{asd}}
  </div>
</template>

<script>
export default {
  name: 'A',
  data () {
    return {
      
    }
  },
  computed:{
    asd(){
      return this.$route.params.q+'----------'
    }
  }
}
</script>

<style scoped>

</style>
