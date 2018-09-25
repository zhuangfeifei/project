import Vue from 'vue'
import axios from 'axios'
import Util from './storage'
import Api from './api'
import * as types from './types'
import Vuex from 'vuex'
Vue.use(Vuex)

const openId = 'oLCKIwOtSoGIY6AE5iMe4U1oW-iA'
const apiUrl = 'http://192.168.1.79'
const imgUrl = apiUrl + '/puman/kaptcha/'

const state = {
    fetchLoading:false,     //全局加载状态的Loading
    token:'12',
    imgUrls:imgUrl,
    list_id:'',
    list_content:'',
    commentList:'',
    isthumbwx:''
}

const mutations = {
    [types.SET_TOKEN](state,res){
        state.token = res
    },
    [types.SET_LOADING](state,res){
        state.fetchLoading = res
    },
    [types.LIST_ID](state,res){
        state.list_id = res
    },
    [types.LIST_CONTENT](state){
        state.list_content = Util.getLocal('list_content')
    },
    [types.COMMENTLIST](state){
        state.commentList = Util.getLocal('commentList')
    },
    [types.IS_THUMBWX](state){
        state.isthumbwx = Util.getLocal('isthumbwx')
    },
}

const actions = {
    list({commit}){   // 获取头条列表
        return Api.post(apiUrl + '/puman/api/seminar/list',$.param({ limit: 6, current: 1, type: '', openId:openId }))
    },
    list_content({commit,state}){   // 获取头条列表详情
        Api.post(apiUrl + '/puman/api/seminar/detailById',$.param({ id: state.list_id }))
        .then(res =>{
            // console.log(res.data)
            if(res.data.code == 200) {
                Util.setLocal(res.data, 'list_content')
                commit('LIST_CONTENT')
            }
        })
        .catch(err => console.log(err))
    },
    commentList({commit,state}){    // 获取评论列表
        Api.post(apiUrl + '/puman/api/seminar/commentList',$.param({ seminarid: state.list_id, limit:20, current:1 }))
        .then(res =>{
            console.log(res.data)
            if(res.data.code == 200) {
                Util.setLocal(res.data, 'commentList')
                commit('COMMENTLIST')
            }
        })
        .catch(err => console.log(err))
    },
    thumbwx({commit,state}){       // 点赞
        var counts = state.isthumbwx == 0 ? 1 : 0
        Api.post(apiUrl + '/puman/api/seminar/thumbwx',$.param({ openId:openId, seminarid: state.list_id, count: counts }))
        .then(res =>{
            // console.log(res.data)
            if(res.data.code == 200) {
                Util.setLocal(counts, 'isthumbwx')   
                commit('IS_THUMBWX')
            }
        })
        .catch(err => console.log(err))
    },
    comment({commit,state}, item){       // 点赞
        var counts = state.isthumbwx == 0 ? 1 : 0
        Api.post(apiUrl + '/puman/api/seminar/comment',$.param({ openId:openId, seminarid:state.list_id, id:item.commentId, isAnon:item.isAnon }))
        .then(res =>{
            console.log(res.data)
            if(res.data.code == 200) {
                // Util.setLocal(counts, 'isthumbwx')   
                // commit('IS_THUMBWX')
            }
        })
        .catch(err => console.log(err))
    },
}

const getters = {

}

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters
})