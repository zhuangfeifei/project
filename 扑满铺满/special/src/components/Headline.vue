<template>
    <div id="Headline" v-if="lists">
        <nav @click="click_list(lists)">
            <div class="imgs"><img v-lazy="imgUrl + lists.PICTURE_NAME" alt=""></div>
            <div class="DESCRIPTION">
                <p>{{lists.TITLE}}</p>
                <p>{{lists.DESCRIPTION}}</p>
                <div class="list_user">
                    <img src="../assets/img/图标_专题页_评论@2x.png" alt=""><span>{{lists.COMMENT_NUM}}</span>
                    <img src="../assets/img/图标_点赞@2x.png" alt=""><span>{{lists.BE_LIKED_NUM}}</span>
                    <span class="date">{{lists.CREATE_TIME | filter}}</span>
                </div>
            </div>
        </nav>

        <div class="content_list">
            <div class="list_" v-if="index != 0" @click="click_list(item)" v-for="(item,index) in Headline_list" :key="index">
                <div class="list_main">
                    <p>{{item.TITLE}}</p>
                    <p>{{item.DESCRIPTION}}</p>
                </div>
                <div class="list_img"><img v-lazy="imgUrl + item.PICTURE_NAME" alt=""></div>
                <div class="list_user">
                    <img src="../assets/img/图标_专题页_评论@2x.png" alt=""><span>{{item.COMMENT_NUM}}</span>
                    <img src="../assets/img/图标_点赞@2x.png" alt=""><span>{{item.BE_LIKED_NUM}}</span>
                    <span class="date">{{item.CREATE_TIME | filter}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            Headline_list:'',lists:''
        }
    },
    beforeCreate(){
        
    },
    created(){
        this.$store.dispatch('list')
        .then(res => {
            if(res.data.code == 200){
                // console.log(res.data.data.list)
                this.lists = res.data.data.list.reverse()[0]
                this.Headline_list = res.data.data.list
            }
        })
        .catch(err => console.log(err))
    },
    computed:{
        imgUrl(){
            return this.$store.state.imgUrls
        }
    },
    methods:{
        click_list(item){
            this.$store.commit('LIST_ID', item.id)
            this.$store.dispatch('list_content')
            this.$store.dispatch('commentList')
            this.$Util.setLocal(item.isThumb, 'isthumbwx')
            this.$store.commit('IS_THUMBWX')
            this.$router.push({path:'/Detils'})
        }
    },
    filters:{
        filter(value){
            return value.substring(0,10)
        }
    }
}
</script>
<style lang="less" scoped>
    #Headline{
        width: 100%; font-size: 4vw;
    }
    
    .font{font-family:PingFang-SC-Bold; font-weight: Bold;}

    nav{
        width: 100%; border-bottom: 3vw solid rgba(232,232,232,1);
        .imgs{
            width: 100%; height: 25vh;
            img{width: 100%; height: 100%;}
        }
        .DESCRIPTION{
            width: 90%; margin: 2vw 5%; font-size: 3.5vw;
            p{
                display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; overflow: hidden;
                line-height: 8vw; margin: 0; color:rgba(75,75,75,1); 
            }
            p:nth-child(1){.font; font-size: 4vw;}
        }
    }
    .list_user{
        width: 100%; height: 10vw; line-height: 13vw; color:rgba(128,128,128,1); clear: both;
        img{
            width: 3.5vw; height: 3.5vw; margin-right: 1vw;
        }
        img:nth-child(3){
            margin-left: 5vw;
        }
        .date{ float: right;}
    }

    .content_list{
        width: 100%; padding-top: 1vw;
        .list_{
            width: 90%; height: 18vh; margin: 0 auto; padding: 5vw 0;
            .list_main{
                width: 65%; height: 70%; font-size: 3.5vw; float: left; padding-right: 2vw; box-sizing: border-box;
                p{
                    display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden;
                    line-height: 8vw; margin: 0; color:rgba(75,75,75,1); line-height: 5vw;
                }
                p:nth-child(1){.font; font-size: 4vw; line-height: 6vw; margin-bottom: 3vw;}
            }
            .list_img{
                width: 35%; height: 70%; float: left; margin-top: 1vw;
                img{width: 100%; height: 100%; border-radius: 3vw;}
            }
        }
    }
</style>


