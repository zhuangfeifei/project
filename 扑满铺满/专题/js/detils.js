document.write("<script type='text/javascript' src='./js/api.js'></script>")

$(document).ready(()=>{

    function GetRequest() {
        var url = location.search; //获取url中"?"符后的字串,如"?p=1"  
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }

    var isThumb = true
    if(GetRequest().isThumb == 1){
        $('.zans>img').attr('src','./img/zan1.png')
        isThumb = false
    }

    $.ajax({
        url: apiUrl + '/puman/api/seminar/detailById',
        type: 'post',
        data: {
            id: GetRequest().id
        },
        dataType: 'json',
        success: res => {
            // console.log(res)
            $('.login>img').hide()
            if(res.code == 200){
                $('.title').text(res.data.title)
                $('.time').text(res.data.createTime)
                var content = res.data.content.replace(/;/g,'').replace(/&gt/g,'>').replace(/&lt/g,'<').replace(/&apos/g,"'").replace(/&quot/g,"\\")
                                .replace(/&#39/g,"'").replace(/&ensp/g,"'").replace(/&emsp/g,"'").replace(/base64/g,';base64').replace(/&ampwxfrom/g,'&amp;wxfrom').replace(/&ampwx_lazy/g,'&amp;wx_lazy')
                $('.contents').html(content)
            }
        },
        error: err => {
            // console.log(err)
        }
    })

    $('.imgs').on('click',function(){
        history.go(-1)
    })
   
    $('.zans>img').on('click',function(){     // 点赞
        if(!isThumb){
            zan(2)
            $(this).attr('src','./img/zan0.png')
        }else{
            zan(1)
            $(this).attr('src','./img/zan1.png')
        }
        isThumb = !isThumb
    })

    function zan(class_thumb) {
        $.ajax({
            url: apiUrl + '/puman/api/seminar/thumbwx',
            type: 'post',
            data: {
                openId:openId, seminarid:parseInt(GetRequest().id), count:class_thumb
            },
            dataType: 'json',
            success: res => {
                console.log(res)
            }, 
            error: err => {
                // console.log(err)
            }
        })
    }

    comments_list()    // 获取评论列表
    function comments_list() {
        $.ajax({
            url: apiUrl + '/puman/api/seminar/commentList',
            type: 'post',
            data: {
                openId:openId, seminarid:parseInt(GetRequest().id), limit:20, current:1
            },
            dataType: 'json',
            success: res => {
                // console.log(res)
                $('.zhuti').remove()
                list(res.data)
            }, 
            error: err => {
                // console.log(err)
            }
        })
    }

    var commentId = ''
    var Reply = false  // 开启或关闭回复
    function list(data){
        $.each(data, function(i){
            var list_comment = '<div class="zhuti" ids='+data[i].id+'><div class="tou"><div><img src="'+ data[i].avatar +'"><span>'+ data[i].nickname +'</span></div><div>'+ data[i].operatime +'</div></div>'+
                '<div class="neirong neirong'+i+'"><div>'+ data[i].content +'</div></div></div>'
            $('.pinluan').append(list_comment)
            $.each(data[i].data, function(s){
                var list_Reply = '<div class="huifu">'+data[i].data[s].nickname+'：'+data[i].data[s].content+'</div>'
                $('.neirong'+i+'').append(list_Reply)
            })
        })
        $('.zhuti').on('click',function(){
            if(!Reply){
                commentId = $(this).attr('ids')
                $('#pinhui').text('回复')
            }else{
                commentId = ''
                $('#pinhui').text('评论')
            }
            Reply = !Reply
        })
    }

    var checked = false    // 匿名
    var isAnon = ''
    $('.ni').on('click',function(){
        if(!checked){
            $('.checkImg').attr('src','./img/checked.png')
            isAnon = 1
        }else{
            $('.checkImg').attr('src','./img/checke.png')
            isAnon = 2
        }
        checked = !checked
        // console.log(checked)
    })

    $('#pinhui').on('click',function(){   // 评论或回复
        var content = $('#pingluan').val()
        comment_Reply(content)
    })
    function comment_Reply(content) {
        if(commentId != ''){
            commentId = parseInt(commentId)
        }    
        $.ajax({
            url: apiUrl + '/puman/api/seminar/comment',
            type: 'post',
            data: {
                openId:openId, seminarid:parseInt(GetRequest().id), content:content, id:commentId, isAnon:isAnon
            },
            dataType: 'json',
            success: res => {
                // console.log(res)
                $('#pingluan').val('')
                comments_list()
            }, 
            error: err => {
                // console.log(err)
            }
        })
    }
})