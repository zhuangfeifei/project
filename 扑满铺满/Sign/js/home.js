        var map, geolocation;
        //加载地图，调用浏览器定位服务
        map = new AMap.Map('container', {
            resizeEnable: true
        });
        map.plugin('AMap.Geolocation', function() {
            geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                buttonPosition:'RB'
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition();
            AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
            AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
        });

        var str = []
        //解析定位结果
        function onComplete(data) {
            str.push(data.position.getLng());
            str.push(data.position.getLat());
            // alert(str)
        }
        //解析定位错误信息
        function onError(data) {
            // console.log('定位失败');
        }



        var a = GetRequest().startTime.substring(0,4)
        var b = GetRequest().startTime.substring(5,7)
        var c = GetRequest().startTime.substring(8,10)
        var d = GetRequest().startTime.substring(11,13)
        var e = GetRequest().startTime.substring(14,16)
        var f = GetRequest().startTime.substring(17,19)
        // console.log(a,b,c,d,e,f)
        var set = setInterval(function () { 
            ShowCountDown(a, b, c, d, e, f);
        }, 1000);

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
        

        function ShowCountDown(year, month, day, hour, minute, second) {
            var now = new Date();
            // console.log(now+'-----')
            var endDate = new Date(year, month - 1, day, hour, minute, second);
            // console.log(endDate+'====')
            if(endDate.getTime() < now.getTime()){
                Sign()
                return
            }
            var leftTime = endDate.getTime() - now.getTime();
            var leftsecond = parseInt(leftTime / 1000);
            // var day1=parseInt(leftsecond/(24*60*60*6)); 
            // console.log(leftsecond)
            var day1 = Math.floor(leftsecond / (60 * 60 * 24));
            var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
            var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
            var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
            //var cc = document.getElementById('divdown1');
            // cc.innerHTML = "倒计时" + year + "年" + month + "月" + day + "日还有：" + day1 + "天" + hour + "小时" + minute + "分" + second + "秒";

            var time = '倒计时' + jialing(hour) + "小时" + jialing(minute) + "分" + jialing(second) + "秒";
            $('#times').text(time)
            var val = [ jialing(hour), jialing(minute), jialing(second) ]
            if(val[0] == '00' && val[1] == '00' && val[2] == '00'){
                Sign()
            }
        }
        

        function Sign(){
            clearInterval(set)
            $('#times').text('开始签到啦！')
            $('#qiandaos').addClass('signs')
            $('#qiandaos').click(() => {
                $.ajax({
                    url:'http://www.homeamc.cn/shopping/api/marketing/join/'+GetRequest().marketingId,
                    type:'post',
                    dataType:'json',
                    data:{
                        marketingId:1, longitude:120.629648, latitude:31.375108, openId:'oLCKIwOtSoGIY6AE5iMe4U1oW-iA', result:'签到'
                    },
                    success:(res)=>{
                        // console.log(res)
						if(res.code == 200){
                            bangding()
                            $('.modal-bodys').text('签到成功')
                            $('.guanbi').click(()=>{
                                window.location.href = './bind.html?id='+res.data+'&marketingId='+GetRequest().marketingId
                            })
                        }else if(res.code == 204){
                            bangding()
                            $('.modal-bodys').text(res.message)
                            $('.guanbi').click(()=>{
                                window.location.href = './bind.html?id='+res.data+'&marketingId='+GetRequest().marketingId
                            })
                        }else{
                            bangding()
                            $('.modal-bodys').text(res.message)
                            $('.guanbi').text('关闭')
                            $('.guanbi').click(()=>{
                                $('#myModal').modal('hide')
                            })
                        }
					},
					error:(er)=>{
						
					}

                })
                
            })
        }

        function jialing(times) {
            if (times < 10) {
                return String(String(0) + String(times))
            } else {
                return times
            }
        }

        
        function bangding(){
            $('#myModal').modal('show')
            $('#myModal').css('margin-top', '35vh')
            $('.modal-bodys').show()
            $('.modal-body').hide()
            $('.modal-footer').show()
            $('.imgs').hide()
        }
        
        var divs = '<p>活动规则：</p><p>1.必须本人亲自到公司签到，不可他人代替</p><p>2.抽中奖品后。请至财务部领取对应奖品</p><p>3.每人仅限一个奖品</p><p>4.签到领奖有效时间为2018年2月22日早上8:00至11:30</p><p>5.最终解释权归本公司所有</p><img>'
        $('#guizes').click(()=>{
            $('#myModal').modal('show')
            $('#myModal').css('margin-top','25vh')
            $('.modal-body').html(divs)
            $('.modal-body').show()
            $('.imgs').show()
            $('.modal-bodys').hide()
            $('.modal-footer').hide()
        })

        $('.imgs').click(()=>{
            $('#myModal').modal('hide')
        })