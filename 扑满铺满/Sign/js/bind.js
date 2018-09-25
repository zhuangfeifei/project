
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
        // alert(GetRequest().id)
        $('#fan').click(()=>{
            history.go(-1)
        })
        

        var names = $('#name').val()
        var phones = $('#phone').val()
        var yanzheng = $('#codes').val()
        $('#huoqu').click(()=>{
            $.ajax({
                url: 'http://www.homeamc.cn/puman/api/system/code',
                type: 'post',
                dataType: 'json',
                data: {
                    phone: phones, msgType:3
                },
                success: (res) => {
                    // console.log(res)
                    if (res.code == 200) {
                        $('#myModal').modal('show')
                        $('.modal-bodys').text(res.message)
                        setTimeout(()=>{
                            $('#myModal').modal('hide')
                        },2000)
                        // 倒计时
                        document.getElementById("huoqu").disabled = true
                        $('#huoqu').removeClass('blu')
                        var time = 60
                        let interval = window.setInterval(() => {
                            $('#times').text(time + '秒后获取')
                            if ((time--) <= 0) {
                                time = 60
                                document.getElementById("huoqu").disabled = false
                                $('#times').text('获取验证码')
                                $('#huoqu').addClass('blu')
                                window.clearInterval(interval)
                            }
                        }, 1000)
                    } else {
                        $('#myModal').modal('show')
                        $('.modal-bodys').text(res.message)
                        setTimeout(()=>{
                            $('#myModal').modal('hide')
                        },2000)
                    }
                },
                error: (er) => {
                    $('#myModal').modal('show')
                    $('.modal-bodys').text('服务器异常')
                    setTimeout(()=>{
                        $('#myModal').modal('hide')
                    },2000)
                }

            })
            
        })

        $('#quer').click(()=>{
            $.ajax({
                url: 'http://www.homeamc.cn/shopping/api/marketing/binding/'+GetRequest().id,
                type: 'post',
                dataType: 'json',
                data: {
                    phone: phones, vcode: yanzheng, realName: names
                },
                success: (res) => {
                    // console.log(res)
                    if (res.code == 200) {
                        window.location.href = "./redEnvelopes.html?id="+GetRequest().id+'&marketingId='+GetRequest().marketingId
                    } else {
                        $('#myModal').modal('show')
                        $('.modal-bodys').text(res.message)
                    }
                },
                error: (er) => {
                    $('#myModal').modal('show')
                    $('.modal-bodys').text('服务器异常')
                }

            })
            
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