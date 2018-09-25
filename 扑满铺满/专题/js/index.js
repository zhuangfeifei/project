document.write("<script type='text/javascript' src='./js/api.js'></script>")
document.write("<script type='text/javascript' src='./js/fetch.js'></script>")

$(document).ready(() => {

    


    let s = 0 // 默认第一个推荐
    var title_name = ''  // 标题分类
    var page = 1   // 第一页
    var off_on = true //分页开关(滚动加载方法 1 中用的)
    var results = [] // 列表数组
    
    getList(title_name, s)
    function getList(name, s) {
        $.ajax({
            url: apiUrl + '/puman/api/seminar/list',
            type: 'post',
            data: {
                limit: 6, current: page, type: name, openId:openId
            },
            dataType: 'json',
            beforeSend:function(){  
                
            }, 
            success: res => {
                console.log(res)
                if(res.data.list.length > 0){
                    sign(res.data, s)
                }else{
                    stop()  // 停止滚动请求
                    $('.login>p').show()
                }
            },
            complete:function(){  
                $('.login>img').hide()
            },  
            error: err => {
                // console.log(err)
            }
        })
    }
    
    function stop(){
        off_on = false
    }

    function sign(data, g) {
        $('ul').empty()              // 清除标题，重新渲染
        $('#content').empty()        // 清除列表，重新渲染

        data.titles.unshift('推荐')
        $.each(data.titles, function (i) {    // 标题
            var title = '<li>' + data.titles[i] + '</li>'
            $('ul').append(title)
        })
        $('header').show()

        var list = sorts(data.list.reverse())  // 重排数据结构
        
        $.each(list, function (n) {           // 列表
            var content_lists = '<div class="content_list content_list' + n + '"></div>'
            $('#content').append(content_lists)
            $.each(list[n], function (k) {
                if (k == 0) {
                    var list_child1 = '<div ids="' + list[n][k].id + '" isThumbs="' + list[n][k].isThumb + '"><img src="' + imgUrl + list[n][k].PICTURE_NAME + '" alt="">'+
                        '<img src="./img/juxing.png" alt=""> <div><p>' + list[n][k].TITLE + '</p><p>' + list[n][k].DESCRIPTION + '</p></div> </div>'
                    $('.content_list' + n + '').append(list_child1)
                } else {
                    var list_child2 = '<div ids="' + list[n][k].id + '" isThumbs="' + list[n][k].isThumb + '"><div><img src="' + imgUrl + list[n][k].PICTURE_NAME + '" alt=""></div>'+
                        '<div><div>' + list[n][k].TITLE + '</div><div>' + list[n][k].DESCRIPTION + '</div> <div><span>' + list[n][k].CREATE_TIME.substring(0, 10) + '</span><span>' + 
                        list[n][k].BE_LIKED_NUM + '</span><img src="./img/zan'+list[n][k].isThumb+'.png" alt=""><span>' + list[n][k].COMMENT_NUM + '</span><img src="./img/pinglun@2x.png" alt=""></div></div> </div>'
                    $('.content_list' + n + '').append(list_child2)
                }
            })
        })

        $('.content_list>div').click(function () {
            window.location.href = './detils.html?id='+$(this).attr('ids')+'&isThumb='+$(this).attr('isThumbs')
        })

        $('ul>li:nth-child(' + (g + 1) + ')').addClass('active')  // 当前分类

        $('ul>li').click(function () {
            document.body.scrollTop = 0
            document.documentElement.scrollTop = 0 
            var i = $(this).index()
            page = 1   // 重新开始第一页
            results = []  // 清空列表
            off_on = true;  // 开启滚动
            $('.login>p').hide()
            if (i == 0) {
                getList('', i)
                title_name = ''
                s = i
            } else {
                getList(data.titles[i], i)
                title_name = data.titles[i]
                s = i    // 当前分类
            }
        })
    }

    function sorts(zhuanti) {
        var b = []
        var result = []
        var k = 0
        for (var i = 0; i < zhuanti.length; ++i) {
            if (i % 3 == 0) {
                b = []
                for (var j = 0; j < 3; ++j) {
                    if (zhuanti[i + j] == undefined) {
                        continue
                    } else {
                        b[j] = zhuanti[i + j]
                    }
                }
                result[k] = b
                k ++
            }
        }
        results = results.concat(result)  // 每次请求拼接数组
        return results
    }

    var timers = null
    $(window).scroll(function () {
        //获取网页的总高度
        var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
        //clientHeight是网页在浏览器中的可视高度， 
        var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
        //scrollTop是浏览器滚动条的top位置， 
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        if (scrollTop + clientHeight >= htmlHeight - 10) {
            if (off_on) {
                $('.login>img').show() 
                clearTimeout(timers)        // 防止一次加载完
                timers = setTimeout(function() {
                    page++
                    getList(title_name, s)
                }, 300)
            }
        }
    })
})

