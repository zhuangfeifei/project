$(document).ready(()=>{

        function GetRequest() {
            var url = location.search; //获取url中"?"符后的字串,如"?p=1"  
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        }

        var a = 0
        $('#chakan').click( function(e){
            if(a == 0){
                $('.qiandaos').addClass('a-ring')
                setTimeout(()=>{
                    $('.qiandaos').removeClass('a-ring')
                    setTimeout(()=>{
                        // window.location.href = "./Prize.html"
                        $(this).css('background-image','url(./img/open_pocket.png)')
                        // $(this).unbind(e)
                        $.ajax({
                            url: 'http://www.homeamc.cn/shopping/api/marketing/winprize/'+GetRequest().id+'/'+GetRequest().marketingId,
                            type: 'post',
                            dataType: 'json',
                            data: {},
                            success: (res) => {
                                // console.log(res)
                                if (res.code == 200) {
                                    
                                } else {

                                }
                            },
                            error: (er) => {

                            }

                        })
                        a ++
                    },1000)
                },1000)
            }else{
                window.location.href = "./index.html"
            }
        })


        // 设置HTML字体    rem
        function fontSize() {
            var deviceWidth = document.documentElement.clientWidth;
            if (deviceWidth > 600) {
                deviceWidth = 600;
            }
            document.documentElement.style.fontSize = deviceWidth / 100 + 'px'
        }
        fontSize()
        window.onresize = function () {
            fontSize()
        }
    })