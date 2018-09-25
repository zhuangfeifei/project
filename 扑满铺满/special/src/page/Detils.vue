<template>
    <div id="Detils">
        <div id="nav">
            <div class="headers">
                <img @click="history" src="../assets/img/fan.png" alt="">
                <slot>详情</slot>
            </div>
        </div>

        <div v-if="content" class="Detils_content">
            <h3>{{content.title}}</h3>
            <p>{{content.createTime | filter}}</p>
            <div class="love">
                <img class="title_img" :src="imgUrl + content.pictureName" alt="">
                <div><img @click="click_love" :src="isThumb == 0 ? love_img[0] : love_img[1]" alt=""><span class="Fabulous">{{isThumb == 0 ? '赞' : content.beLikedNum}}</span><span class="Read">阅读</span><span>{{0}}</span></div>
            </div>
            <div class="content" :class="{content_active: !content_show}">
                <!--<div class="description">{{content.description}}打官司了深刻的法律省得麻烦；见风使舵是否了可能是地方数据库的a山沟沟水电费GV苟富贵是的</div>-->
                <div v-html="content_html"></div>
                <span v-if="content_show" id="full" @click="full_text">......阅读全文</span>
            </div>
        </div>

        <div class="footter">
            <div class="zhuti" @click="Reply(items.id)" v-for="(items,indexs) in commentList" :key="indexs">
                <div class="tou">
                    <div>
                        <img v-lazy="items.avatar">
                        <span>{{items.nickname}}</span>
                    </div>
                    <div>{{items.operatime}}</div>
                </div>
                <div class="neirong">
                    <div>{{items.content}}</div>
                    <div class="huifu" v-for="(item,index) in items.data" :key="index">
                        {{item.nickname}}：{{item.content}}
                    </div>
                </div>
            </div>
        </div>


        <van-popup class="fot" v-model="show" position="bottom" :overlay="false">
            <div class="comments">
                <input type="text" class="texts" v-model="Reply.texts">
                <p v-show="show_pla">
                    <img src="../assets/img/图标_评论框_评论@2x.png" alt=""><span v-if="is_Reply">评一下</span><span v-else>回复</span>
                </p>
                <span class="Send" @click="SendUp">发送</span>
            </div>
        </van-popup>

    </div>
</template>
<script>
export default {
    data(){
        return{
            Headline_list:'',lists:'',content_show:true, show:true, show_pla:true, is_Reply:true, 
            Reply:{ Reply_id:'', isAnon:2, texts:'' },
            love_img:[require('../assets/img/按钮_未点赞@2x.png'),require('../assets/img/按钮_已点赞@2x.png')]
        }
    },
    beforeCreate(){
        
    },
    created(){
        $(document).ready(()=>{  
            $("input").focus(()=>{  
                this.show_pla = false
            })  
            $("input").blur(()=>{  
                this.show_pla = true 
            })  
        })
    },
    computed:{
        imgUrl(){
            return this.$store.state.imgUrls
        },
        content(){
            if(this.$store.state.list_content == ''){  // 防止刷新数据丢失
                this.$store.commit('LIST_CONTENT')
                this.$store.commit('COMMENTLIST')
                this.$store.commit('IS_THUMBWX')
            }
            return this.$store.state.list_content.data
        },
        content_html(){
            return this.$store.state.list_content.data.content.replace(/;/g,'').replace(/&gt/g,'>').replace(/&lt/g,'<').replace(/&apos/g,"'").replace(/&quot/g,"\\")
                .replace(/&#39/g,"'").replace(/&ensp/g,"'").replace(/&emsp/g,"'").replace(/base64/g,';base64').replace(/&ampwxfrom/g,'&amp;wxfrom').replace(/&ampwx_lazy/g,'&amp;wx_lazy')
        },
        commentList(){
            return this.$store.state.commentList.data
        },
        isThumb(){
            return this.$store.state.isthumbwx
        }
    },
    methods:{
        click_love(){
            this.$store.dispatch('thumbwx')
            // console.log(this.content.beLikedNum)
        },
        history() {
            history.go(-1)
        },
        full_text(){
            this.content_show = false
        },
        Reply(id){
            this.is_Reply = !this.is_Reply
            this.Reply.Reply_id = id
        },
        SendUp(){
            if(is_Reply) this.$store.dispatch('comment', this.Reply)
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
    #Detils{
        width: 100%; font-size: 4vw; padding-top: 15vw;
    }
    
    #nav{
        width: 100%; height: 15vw; background-color: black; line-height: 15vw; font-size: 5vw; font-weight: Bold;
        position: fixed!important; top: 0; color: white; text-align: center; z-index: 100; position: relative; opacity: 0.9;
        img{
            width: 6vw; height: 6vw; float: left; position: absolute; top: 4.5vw; left: 1vw;
        }      
    }

    .Detils_content{
        width: 90%; margin: 0 auto;
        .love{
            width: 100%; text-align: right; margin-bottom: 5vw;
            .title_img{
                width: 100%; height: 25vh; border-radius: 2vw; margin-bottom: 1vw;
            }
            img{
                width: 5vw; height: 4vw;
            }
            .Fabulous{ color: rgba(255,139,75,1); margin-left: 2vw;}
            .Read{
                margin-left: 5vw; margin-right: 2vw;
            }
        }
        .content{
            width: 100%; position: relative; max-height: 20vw; overflow: hidden; border-top: 1px solid rgba(232,232,232,1);
            // .description{
            //     width: 100%; line-height: 5.5vw; font-size: 3.5vw; margin-top: 3vw; border-top: 1px solid rgba(232,232,232,1);;
            //     display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden; padding-top: 3vw;
            // }
            #full{
                position: absolute; bottom: 0; right: 0; color: rgba(255,139,75,1);font-family:PingFang-SC-Medium; font-weight: Medium;
                background-color: white; font-size: 3.5vw;
            }
        }

        .content_active{ max-height: 100%!important; overflow: none; word-wrap:break-word; word-break:break-all; overflow: hidden;}
    }

    .footter{
        width: 100%; margin-top: 8vw; border-top: 4vw solid rgba(232,232,232,1);
        .zhuti{
            width: 90%; margin: 0 auto;
        }
        .tou{
            width: 100%; height: 10vw; display: flex; justify-content: space-between; line-height: 10vw; margin-top: 2vw;
            font-size: 3.5vw; color: gray;
            
        }
        .tou span{
            position: relative; top: -3vw;
        }
        .tou img{
            width: 9vw; height: 9vw; border-radius: 50%; margin-right: 1vw;
        }
        .neirong{
            width: 90%; border-bottom: 1px solid gainsboro; margin: 0 auto; padding-left: 6vw; padding-bottom: 2vw;
        }
        .huifu{
            width: 100%; background-color: ghostwhite; color: gray; padding: 1vw 2vw 0 2vw; font-size: 3.5vw;
        }
    }


    .fot{
        width: 100%; height: 15vw; background-color: white; border-top: 1px solid rgba(204,204,204,1);
        .comments{
            width: 100%; height: 100%; position: relative;
            .texts{
                width: 80%; height: 9vw; background: rgba(232,232,232,1); border-radius:10px; border: 0;
                margin: 3vw 5%; outline: none; font-size: 4vw; margin-right: 2%; 
            }
            p{
                position: absolute; top: 2vw; left: 8%; color:rgba(128,128,128,1); font-size: 3.5vw;
                img{
                    width: 5vw; height: 5vw;
                }
                span{
                    position: relative; top: -1vw; left: 3vw;
                }
            }
            .Send{ color: #23af22; }
        }
    }
</style>


