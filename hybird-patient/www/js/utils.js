(function() {
    // global
    window.Native = window.Native || {};
    window.USERINFO = window.USERINFO || {};
    window.Timer = window.Timer || {};


    (function(Native) {
        // for normal
        Native.pageSize = 10;
        Native.isWeb = true;
        Native.isWeixin = /MicroMessenger/i.test(navigator.userAgent);

        Native.getIdentify = function(callback) {
            var _cb = function(arr) {
                var mac = _getIdentify(arr);
                callback.call(this, mac);
            }
            _nativeProxy('getIdentify', [], _cb);
        }

        Native.getAuth = function(prefix, callback) {
            var _cb = function(arr) {
                var userInfo = _getAuth(prefix, arr);
                callback.call(this, userInfo)
            }
            _nativeProxy('getAuth', [prefix], _cb);
        }

        Native.frameHistoryBack = function() {
            console.log('frameHistoryBack')
            clearTimeout(window.Timer);
        }

        Native.run = function(funcName, paramArr, callback) {
            _nativeProxy(funcName, paramArr, callback);
        }

        Native.frameLogin = function() {
            var appElement = document.querySelector('ion-view[nav-view=active]').querySelector('ion-content');
            var $scope = angular.element(appElement).scope();
            $scope.frameLogin();
        }

        Native.refresh = function(isSuccess) {
            var appElement = document.querySelector('ion-view[nav-view=active]').querySelector('ion-content');
            var $scope = angular.element(appElement).scope();
            $scope.doRefresh(isSuccess);
        }

        Native.frameRefresh = function(isSuccess) {
            window.frames[window.frames.length-1].postMessage({
                'func': 'doRefresh',
                'resp': {'isSuccess': isSuccess}
            }, '*');
        }

        function _nativeProxy(func, paramArr, callback) {
            switch (func) {
                case 'rate':
                    if (paramArr[3]) {
                        window.location.href = '#/tab/me/rate/' + paramArr[0] + '/' + paramArr[1] + '/' + paramArr[2];
                    } else {
                        window.location.href = '#/tab/home/rate/' + paramArr[0] + '/' + paramArr[1] + '/' + paramArr[2];
                    }
                    break;
                case 'changeDoctor':
                    if (paramArr[0]) {
                        window.location.href = '#/tab/me/doctor-search';
                    } else {
                        window.location.href = '#/tab/home/doctor-search';
                    }
                    break;
                case 'recharge':
                    //var appElement = document.querySelector('ion-view[nav-view=active]').querySelector('ion-content');

                    var $scope = angular.element(document.body).scope();
                    $scope.openRechargeModal();
                    break;
                case 'goBack':
                case 'historyBack':
                    //var appElement = document.querySelector('ion-view[nav-view=active]').querySelector('ion-content');
                    var $scope = angular.element(document.body).scope();
                    $scope.goBack();
                    break;
                case 'startChat':
                    window.location.href = "#/tab/chat";
                    setTimeout(function() {
                        window.location.href = "#/tab/chat/box/" + paramArr[0] + "/" + paramArr[1];
                    }, 300);
                    break;
                case 'login':
                    var $scope = angular.element(document.body).scope();
                    $scope.openLoginModal();
                    break;
                case 'share':
                    console.log(paramArr)
                    break;
                case 'redirect':
                console.log(paramArr[0])
                    window.location.href = paramArr[0];
                    break;
                case 'transfer':
                    if (paramArr[0] == 0) {
                        switch (paramArr[1]) {
                            case 'selectDoctor':
                                window.location.href = '#/tab/me/doctor-search'
                                break;
                        }
                    } else {
                        window.location.href = paramArr[1];
                    }
                    break;
                case 'pay':
                    window.localStorage.setItem('payAmount', paramArr[0]);
                    window.localStorage.setItem('payOrderCode', paramArr[1]);
                    window.localStorage.setItem('payProName', paramArr[3]);
                    window.location.href = '#/tab/me/pay';
                    break;

                 case 'updateIdCard':
                    window.localStorage.setItem("id_card", paramArr[0])
                    break;

            }
            if (typeof callback === 'function')
                callback();
        }

        function _getPlatform() {
            window.NativePlatform = window.NativePlatform || ionic ? ionic.Platform.platform() : 'webview'
            return window.NativePlatform;
        }


        function _getIdentify(arr) {
            var mac = '64D5A9B9-7D39-42F7-B297-1C1D9456F7D9';
            return mac;
        }

        function _getAuth(prefix, arr) {
            var userInfo = {};
            var loginState = window.localStorage.getItem('loginState') || '';
            if (loginState) {
                userInfo.auth = window.localStorage.getItem('auth');
                userInfo.patientId = window.localStorage.getItem('patientId');
                userInfo.patientName = window.localStorage.getItem('patientName');
                userInfo.patientNickName = window.localStorage.getItem('patientNickName');
                userInfo.patientRealName = window.localStorage.getItem('patientRealName');
                userInfo.doctorId = window.localStorage.getItem('doctorId');
                userInfo.doctorName = window.localStorage.getItem('doctorName');
                userInfo.doctorNickName = window.localStorage.getItem('doctorNickName');
                userInfo.assistantId = window.localStorage.getItem('assistantId');
                userInfo.assistantName = '';
                userInfo.assistantNickName = '';
                userInfo.doctorBed = window.localStorage.getItem('doctorBed');
                userInfo.canReserve = window.localStorage.getItem('canReserve');
                userInfo.id_card = window.localStorage.getItem('id_card');
                userInfo.hasPassword = window.localStorage.getItem('hasPassword');
            } else {
                userInfo.auth = '';
                userInfo.patientId = '';
                userInfo.patientName = '';
                userInfo.patientNickName = '';
                userInfo.patientRealName = '';
                userInfo.doctorId = '';
                userInfo.doctorName = '';
                userInfo.doctorNickName = '';
                userInfo.assistantId = '';
                userInfo.assistantName = '';
                userInfo.assistantNickName = '';
                userInfo.doctorBed = '';
                userInfo.canReserve = '';
                userInfo.hasPassword = '';
            }
            return userInfo;
        }
    })(Native)
})();

(function() {
    window.addEventListener('message', function(e) {
        e.data.params.push(function(resp) {
            window.frames['discoverIframe'].postMessage({
                'func': e.data.func + 'Callback',
                'resp': resp
            }, '*');
        })
        Native[e.data.func].apply(this, e.data.params);
    })
})();

(function() {

    Date.prototype.format = function(format) {
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(), //day
            "h+": this.getHours(), //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
            "S": this.getMilliseconds() //millisecond
        }

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    }
    Date.prototype.getDayString = function() {
        var day = this.getDay();
        switch (day) {
            case 0:
                return '星期日';
            case 1:
                return '星期一';
            case 2:
                return '星期二';
            case 3:
                return '星期三';
            case 4:
                return '星期四';
            case 5:
                return '星期五';
            case 6:
                return '星期六';
        }
    }

    Date.prototype.getToday = function() {
        var tempDay = this.getDay();
        var day;
        switch (tempDay) {
            case 0:
                day = '星期日';
                break;
            case 1:
                day = '星期一';
                break;
            case 2:
                day = '星期二';
                break;
            case 3:
                day = '星期三';
                break;
            case 4:
                day = '星期四';
                break;
            case 5:
                day = '星期五';
                break;
            case 6:
                day = '星期六';
                break;
        }
        return {
            year: this.getFullYear(),
            month: this.getMonth() + 1,
            date: this.getDate(),
            day: day
        }
    }

})();

(function(TOKEN) {
    if (TOKEN) {
        RongIMClient.init(RY_KEY);
        // 连接融云服务器。
        RongIMClient.connect(TOKEN, {
            onSuccess: function(userId) {
                console.log("Login successfully." + userId);
            },
            onTokenIncorrect: function() {
                //angular.element(document.body).scope().logout();
                console.log('token无效');
            },
            onError: function(errorCode) {
                var info = '';
                switch (errorCode) {
                    case RongIMLib.ErrorCode.TIMEOUT:
                        info = '超时';
                        break;
                    case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                        info = '未知错误';
                        break;
                    case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                        info = '不可接受的协议版本';
                        break;
                    case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                        info = 'appkey不正确';
                        break;
                    case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                        info = '服务器不可用';
                        break;
                }
                console.log(errorCode);
            }
        });
        // 设置连接监听状态 （ status 标识当前连接状态）
        // 连接状态监听器
        RongIMClient.setConnectionStatusListener({
            onChanged: function(status) {
                switch (status) {
                    //链接成功
                    case RongIMLib.ConnectionStatus.CONNECTED:
                        console.log('链接成功');
                        break;
                        //正在链接
                    case RongIMLib.ConnectionStatus.CONNECTING:
                        console.log('正在链接');
                        break;
                        //重新链接
                    case RongIMLib.ConnectionStatus.DISCONNECTED:
                        console.log('断开连接');
                        break;
                        //其他设备登陆
                    case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                        alert('您的帐号正在其他设备上登录');
                        angular.element(document.body).scope().logout();
                        console.log('其他设备登陆');
                        break;
                        //网络不可用
                    case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                        // alert('消息发送失败：网络不可用')
                        console.log('网络不可用');
                        break;
                }
            }
        });

        // 消息监听器
        var $scopeUitls, appElement;
        RongIMClient.setOnReceiveMessageListener({
            // 接收到的消息
            onReceived: function(message) {
                console.log(message);
                // 判断消息类型
                switch (message.messageType) {
                    case RongIMClient.MessageType.TextMessage:
                        appElement = document.getElementById('chatBoxContent');
                        $scopeUitls = angular.element(appElement).scope();
                        if (typeof $scopeUitls != 'undefined')
                            $scopeUitls.receiveMessage(message);
                        console.log(message.content.content);
                        //发送的消息内容将会被打印
                        break;
                    case RongIMClient.MessageType.ImageMessage:
                        appElement = document.getElementById('chatBoxContent');
                        $scopeUitls = angular.element(appElement).scope();
                        if (typeof $scopeUitls != 'undefined')
                            $scopeUitls.receiveMessage(message);
                        console.log(message.content.content);
                        // do something...
                        break;
                    case RongIMClient.MessageType.DiscussionNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.LocationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.RichContentMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.DiscussionNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.InformationNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.ContactNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.ProfileNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.CommandNotificationMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.CommandMessage:
                        // do something...
                        break;
                    case RongIMClient.MessageType.UnknownMessage:
                        // do something...
                        break;
                    default:
                        // 自定义消息
                        // do something...
                }
            }
        });
    }
})(window.localStorage.getItem('im_token'));


function scaleImg(ele) {
    var srcImg;

    var img = document.createElement('img');
    var cover = document.createElement('div');
    if (ele.tagName === 'IMG') {
        srcImg = ele
    } else {
        srcImg = ele.getElementsByTagName('img')[0];
    }
    img.src = srcImg.src;
    img.style.position = 'absolute'
    img.style.top = '40px';
    img.style.width = '100%';
    img.style.zIndex = '100';

    cover.style.position = 'absolute'
    cover.style.top = '0px';
    cover.style.right = '0px';
    cover.style.bottom = '0px';
    cover.style.left = '0px';
    cover.style.backgroundColor = '#eee';
    cover.style.zIndex = '100';
    cover.style.borderRadius = "10px";

    document.body.appendChild(cover);
    cover.appendChild(img)
    cover.addEventListener('click', function(e) {
        document.body.removeChild(cover);
    })
}


function UploadPic() {
    this.sw = 0;
    this.sh = 0;
    this.tw = 0;
    this.th = 0;
    this.scale = 0;
    this.maxWidth = 0;
    this.maxHeight = 0;
    this.maxSize = 0;
    this.fileSize = 0;
    this.fileDate = null;
    this.fileType = '';
    this.fileName = '';
    this.input = null;
    this.canvas = null;
    this.mime = {};
    this.type = '';
    this.base64 = null;
    this.callback = function() {};
    this.loading = function() {};
}

UploadPic.prototype.init = function(options) {
    this.maxWidth = options.maxWidth || 800;
    this.maxHeight = options.maxHeight || 600;
    this.maxSize = options.maxSize || 8 * 1024 * 1024;
    this.context = options.context;
    this.input = this.context.getElementsByClassName('picfile')[0];
    this.mime = {
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'bmp': 'image/bmp'
    };
    this.callback = options.callback || function() {};
    this.loading = options.loading || function() {};

    this._addEvent();
};

/**
 * @description 绑定事件
 * @param {Object} elm 元素
 * @param {Function} fn 绑定函数
 */
UploadPic.prototype._addEvent = function() {
    var _this = this;

    function tmpSelectFile(ev) {
        _this._handelSelectFile(ev);
    }
    this.input.addEventListener('change', tmpSelectFile, false);
};

/**
 * @description 绑定事件
 * @param {Object} elm 元素
 * @param {Function} fn 绑定函数
 */
UploadPic.prototype._handelSelectFile = function(ev) {
    var file = ev.target.files[0];
    /*
            this.type = file.type

            // 如果没有文件类型，则通过后缀名判断（解决微信及360浏览器无法获取图片类型问题）
            if (!this.type) {
                this.type = this.mime[file.name.match(/\.([^\.]+)$/i)[1]];
            }

            if (!/image.(png|jpg|jpeg|bmp)/.test(this.type)) {
                alert('选择的文件类型不是图片');
                return;
            }*/

    if (file.size > this.maxSize) {
        alert('选择文件大于' + this.maxSize / 1024 / 1024 + 'M，请重新选择');
        return;
    }

    this.fileName = file.name;
    this.fileSize = file.size;
    this.fileType = this.type;
    this.fileDate = file.lastModifiedDate;

    this._readImage(file);
};

/**
 * @description 读取图片文件
 * @param {Object} image 图片文件
 */
UploadPic.prototype._readImage = function(file) {
    var _this = this;

    function tmpCreateImage(uri) {
        _this._createImage(uri);
    }

    this.loading();

    this._getURI(file, tmpCreateImage);
};

/**
 * @description 通过文件获得URI
 * @param {Object} file 文件
 * @param {Function} callback 回调函数，返回文件对应URI
 * return {Bool} 返回false
 */
UploadPic.prototype._getURI = function(file, callback) {
    var reader = new FileReader();
    var _this = this;

    function tmpLoad() {
        // 头不带图片格式，需填写格式
        var re = /^data:base64,/;
        var ret = this.result + '';

        if (re.test(ret)) ret = ret.replace(re, 'data:' + _this.mime[_this.fileType] + ';base64,');

        callback && callback(ret);
    }

    reader.onload = tmpLoad;

    reader.readAsDataURL(file);

    return false;
};

/**
 * @description 创建图片
 * @param {Object} image 图片文件
 */
UploadPic.prototype._createImage = function(uri) {
    var img = new Image();
    var _this = this;

    function tmpLoad() {
        _this._drawImage(this);
    }

    img.onload = tmpLoad;

    img.src = uri;
};

/**
 * @description 创建Canvas将图片画至其中，并获得压缩后的文件
 * @param {Object} img 图片文件
 * @param {Number} width 图片最大宽度
 * @param {Number} height 图片最大高度
 * @param {Function} callback 回调函数，参数为图片base64编码
 * return {Object} 返回压缩后的图片
 */
UploadPic.prototype._drawImage = function(img, callback) {
    this.sw = img.width;
    this.sh = img.height;
    this.tw = img.width;
    this.th = img.height;

    this.scale = (this.tw / this.th).toFixed(2);

    if (this.sw > this.maxWidth) {
        this.sw = this.maxWidth;
        this.sh = Math.round(this.sw / this.scale);
    }

    if (this.sh > this.maxHeight) {
        this.sh = this.maxHeight;
        this.sw = Math.round(this.sh * this.scale);
    }


    this.canvas = document.createElement('canvas');
    var ctx = this.canvas.getContext('2d');

    this.canvas.width = this.sw;
    this.canvas.height = this.sh;

    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, this.sw, this.sh);

    this.callback(this.canvas.toDataURL(this.type));

    ctx.clearRect(0, 0, this.tw, this.th);
    this.canvas.width = 0;
    this.canvas.height = 0;
    this.canvas = null;

    this.canvasPreview = document.createElement('canvas');
    var ctxPreview = this.canvasPreview.getContext('2d');
    ctxPreview.drawImage(img, 0, 0, img.width, img.height, 0, 0, 82, 78);
    var imgzip = this.context.getElementsByClassName('imgzip')[0],
        picfile = this.context.getElementsByClassName('picfile')[0],
        btnfile = this.context.getElementsByClassName('btnfile')[0];

    for (var i = imgzip.childNodes.length - 1; i >= 0; i--) {
        imgzip.removeChild(imgzip.childNodes[i]);
    }
    img.width = 82;
    img.height = 78;
    imgzip.appendChild(img);
    imgzip.style.zIndex = 2;
    picfile.style.left = '100px';
    btnfile.style.left = '100px';
    btnfile.innerText = '重新上传';
};


var division = {
    "北京市": {
        "北京市": ["东城区", "西城区", "崇文区", "宣武区", "朝阳区", "丰台区", "石景山区", "海淀区", "门头沟区", "房山区", "通州区", "顺义区", "昌平区", "大兴区", "怀柔区", "平谷区", "密云县", "延庆县"]
    },
    "上海市": {
        "上海市": ["黄浦区", "卢湾区", "徐汇区", "长宁区", "静安区", "普陀区", "闸北区", "虹口区", "杨浦区", "闵行区", "宝山区", "嘉定区", "浦东新区", "金山区", "松江区", "青浦区", "南汇区", "奉贤区", "崇明县"]
    },
    "天津市": {
        "天津市": ["和平区", "河东区", "河西区", "南开区", "河北区", "红桥区", "塘沽区", "汉沽区", "大港区", "东丽区", "西青区", "津南区", "北辰区", "武清区", "宝坻区", "宁河县", "静海县", "蓟县"]
    },
    "重庆市": {
        "重庆市": ["万州区", "涪陵区", "渝中区", "大渡口区", "江北区", "沙坪坝区", "九龙坡区", "南岸区", "北碚区", "万盛区", "双桥区", "渝北区", "巴南区", "黔江区", "长寿区", "綦江县", "潼南县", "铜梁县", "大足县", "荣昌县", "璧山县", "梁平县", "城口县", "丰都县", "垫江县", "武隆县", "忠县", "开县", "云阳县", "奉节县", "巫山县", "巫溪县", "石柱土家族自治县", "秀山土家族苗族自治县", "酉阳土家族苗族自治县", "彭水苗族土家族自治县", "江津市", "合川市", "永川市", "南川市"]
    },
    "四川省": {
        "成都市": ["锦江区", "青羊区", "金牛区", "武侯区", "成华区", "龙泉驿区", "青白江区", "新都区", "温江县", "金堂县", "双流县", "郫县", "大邑县", "蒲江县", "新津县", "都江堰市", "彭州市", "邛崃市", "崇州市"],
        "自贡市": ["自流井区", "贡井区", "大安区", "沿滩区", "荣县", "富顺县"],
        "攀枝花市": ["东区", "西区", "仁和区", "米易县", "盐边县"],
        "泸州市": ["江阳区", "纳溪区", "龙马潭区", "泸县", "合江县", "叙永县", "古蔺县"],
        "德阳市": ["旌阳区", "中江县", "罗江县", "广汉市", "什邡市", "绵竹市"],
        "绵阳市": ["涪城区", "游仙区", "三台县", "盐亭县", "安县", "梓潼县", "北川羌族自治县", "平武县", "江油市"],
        "广元市": ["市中区", "元坝区", "朝天区", "旺苍县", "青川县", "剑阁县", "苍溪县"],
        "遂宁市": ["船山区", "安居区", "蓬溪县", "射洪县", "大英县"],
        "内江市": ["市中区", "东兴区", "威远县", "资中县", "隆昌县"],
        "乐山市": ["市中区", "沙湾区", "五通桥区", "金口河区", "犍为县", "井研县", "夹江县", "沐川县", "峨边彝族自治县", "马边彝族自治县", "峨眉山市"],
        "南充市": ["顺庆区", "高坪区", "嘉陵区", "南部县", "营山县", "蓬安县", "仪陇县", "西充县", "阆中市"],
        "眉山市": ["东坡区", "仁寿县", "彭山县", "洪雅县", "丹棱县", "青神县"],
        "宜宾市": ["翠屏区", "宜宾县", "南溪县", "江安县", "长宁县", "高县", "珙县", "筠连县", "兴文县", "屏山县"],
        "广安市": ["广安区", "岳池县", "武胜县", "邻水县", "华莹市"],
        "达州市": ["通川区", "达县", "宣汉县", "开江县", "大竹县", "渠县", "万源市"],
        "雅安市": ["雨城区", "名山县", "荥经县", "汉源县", "石棉县", "天全县", "芦山县", "宝兴县"],
        "巴中市": ["巴州区", "通江县", "南江县", "平昌县"],
        "资阳市": ["雁江区", "安岳县", "乐至县", "简阳市"],
        "阿坝藏族羌族自治州": ["汶川县", "理县", "茂县", "松潘县", "九寨沟县", "金川县", "小金县", "黑水县", "马尔康县", "壤塘县", "阿坝县", "若尔盖县", "红原县"],
        "甘孜藏族自治州": ["康定县", "泸定县", "丹巴县", "九龙县", "雅江县", "道孚县", "炉霍县", "甘孜县", "新龙县", "德格县", "白玉县", "石渠县", "色达县", "理塘县", "巴塘县", "乡城县", "稻城县", "得荣县"],
        "凉山彝族自治州": ["西昌市", "木里藏族自治县", "盐源县", "德昌县", "会理县", "会东县", "宁南县", "普格县", "布拖县", "金阳县", "昭觉县", "喜德县", "冕宁县", "越西县", "甘洛县", "美姑县", "雷波县"]
    },
    "贵州省": {
        "贵阳市": ["南明区", "云岩区", "花溪区", "乌当区", "白云区", "小河区", "开阳县", "息烽县", "修文县", "清镇市"],
        "六盘水市": ["钟山区", "六枝特区", "水城县", "盘县"],
        "遵义市": ["红花岗区", "汇川区", "遵义县", "桐梓县", "绥阳县", "正安县", "道真仡佬族苗族自治县", "务川仡佬族苗族自治县", "凤冈县", "湄潭县", "余庆县", "习水县", "赤水市", "仁怀市"],
        "安顺市": ["西秀区", "平坝县", "普定县", "镇宁布依族苗族自治县", "关岭布依族苗族自治县", "紫云苗族布依族自治县"],
        "铜仁地区": ["铜仁市", "江口县", "玉屏侗族自治县", "石阡县", "思南县", "印江土家族苗族自治县", "德江县", "沿河土家族自治县", "松桃苗族自治县", "万山特区"],
        "黔西南布依族苗族自治州": ["兴义市", "兴仁县", "普安县", "晴隆县", "贞丰县", "望谟县", "册亨县", "安龙县"],
        "毕节地区": ["毕节市", "大方县", "黔西县", "金沙县", "织金县", "纳雍县", "威宁彝族回族苗族自治县", "赫章县"],
        "黔东南苗族侗族自治州": ["凯里市", "黄平县", "施秉县", "三穗县", "镇远县", "岑巩县", "天柱县", "锦屏县", "剑河县", "台江县", "黎平县", "榕江县", "从江县", "雷山县", "麻江县", "丹寨县"],
        "黔南布依族苗族自治州": ["都匀市", "福泉市", "荔波县", "贵定县", "瓮安县", "独山县", "平塘县", "罗甸县", "长顺县", "龙里县", "惠水县", "三都水族自治县"]
    },
    "云南省": {
        "昆明市": ["五华区", "盘龙区", "官渡区", "西山区", "东川区", "呈贡县", "晋宁县", "富民县", "宜良县", "石林彝族自治县", "嵩明县", "禄劝彝族苗族自治县", "寻甸回族彝族自治县", "安宁市"],
        "曲靖市": ["麒麟区", "马龙县", "陆良县", "师宗县", "罗平县", "富源县", "会泽县", "沾益县", "宣威市"],
        "玉溪市": ["红塔区", "江川县", "澄江县", "通海县", "华宁县", "易门县", "峨山彝族自治县", "新平彝族傣族自治县", "元江哈尼族彝族傣族自治县"],
        "保山市": ["隆阳区", "施甸县", "腾冲县", "龙陵县", "昌宁县"],
        "昭通市": ["昭阳区", "鲁甸县", "巧家县", "盐津县", "大关县", "永善县", "绥江县", "镇雄县", "彝良县", "威信县", "水富县"],
        "丽江市": ["古城区", "玉龙纳西族自治县", "永胜县", "华坪县", "宁蒗彝族自治县"],
        "思茅市": ["翠云区", "普洱哈尼族彝族自治县", "墨江哈尼族自治县", "景东彝族自治县", "景谷傣族彝族自治县", "镇沅彝族哈尼族拉祜族自治县", "江城哈尼族彝族自治县", "孟连傣族拉祜族佤族自治县", "澜沧拉祜族自治县", "西盟佤族自治县"],
        "临沧市": ["临翔区", "凤庆县", "云县", "永德县", "镇康县", "双江拉祜族佤族布朗族傣族自治县", "耿马傣族佤族自治县", "沧源佤族自治县"],
        "楚雄彝族自治州": ["楚雄市", "双柏县", "牟定县", "南华县", "姚安县", "大姚县", "永仁县", "元谋县", "武定县", "禄丰县"],
        "红河哈尼族彝族自治州": ["个旧市", "开远市", "蒙自县", "屏边苗族自治县", "建水县", "石屏县", "弥勒县", "泸西县", "元阳县", "红河县", "金平苗族瑶族傣族自治县", "绿春县", "河口瑶族自治县"],
        "文山壮族苗族自治州": ["文山县", "砚山县", "西畴县", "麻栗坡县", "马关县", "丘北县", "广南县", "富宁县"],
        "西双版纳傣族自治州": ["景洪市", "勐海县", "勐腊县"],
        "大理白族自治州": ["大理市", "漾濞彝族自治县", "祥云县", "宾川县", "弥渡县", "南涧彝族自治县", "巍山彝族回族自治县", "永平县", "云龙县", "洱源县", "剑川县", "鹤庆县"],
        "德宏傣族景颇族自治州": ["瑞丽市", "潞西市", "梁河县", "盈江县", "陇川县"],
        "怒江傈僳族自治州": ["泸水县", "福贡县", "贡山独龙族怒族自治县", "兰坪白族普米族自治县"],
        "迪庆藏族自治州": ["香格里拉县", "德钦县", "维西傈僳族自治县"]
    },
    "西藏省": {
        "拉萨市": ["城关区", "林周县", "当雄县", "尼木县", "曲水县", "堆龙德庆县", "达孜县", "墨竹工卡县"],
        "昌都地区": ["昌都县", "江达县", "贡觉县", "类乌齐县", "丁青县", "察雅县", "八宿县", "左贡县", "芒康县", "洛隆县", "边坝县"],
        "山南地区": ["乃东县", "扎囊县", "贡嘎县", "桑日县", "琼结县", "曲松县", "措美县", "洛扎县", "加查县", "隆子县", "错那县", "浪卡子县"],
        "日喀则地区": ["日喀则市", "南木林县", "江孜县", "定日县", "萨迦县", "拉孜县", "昂仁县", "谢通门县", "白朗县", "仁布县", "康马县", "定结县", "仲巴县", "亚东县", "吉隆县", "聂拉木县", "萨嘎县", "岗巴县"],
        "那曲地区": ["那曲县", "嘉黎县", "比如县", "聂荣县", "安多县", "申扎县", "索县", "班戈县", "巴青县", "尼玛县"],
        "阿里地区": ["普兰县", "札达县", "噶尔县", "日土县", "革吉县", "改则县", "措勤县"],
        "林芝地区": ["林芝县", "工布江达县", "米林县", "墨脱县", "波密县", "察隅县", "朗县"]
    },
    "河南省": {
        "郑州市": ["中原区", "二七区", "管城回族区", "金水区", "上街区", "邙山区", "中牟县", "巩义市", "荥阳市", "新密市", "新郑市", "登封市"],
        "开封市": ["龙亭区", "顺河回族区", "鼓楼区", "南关区", "郊区", "杞县", "通许县", "尉氏县", "开封县", "兰考县"],
        "洛阳市": ["老城区", "西工区", "廛河回族区", "涧西区", "吉利区", "洛龙区", "孟津县", "新安县", "栾川县", "嵩县", "汝阳县", "宜阳县", "洛宁县", "伊川县", "偃师市"],
        "平顶山市": ["新华区", "卫东区", "石龙区", "湛河区", "宝丰县", "叶县", "鲁山县", "郏县", "舞钢市", "汝州市"],
        "安阳市": ["文峰区", "北关区", "殷都区", "龙安区", "安阳县", "汤阴县", "滑县", "内黄县", "林州市"],
        "鹤壁市": ["鹤山区", "山城区", "淇滨区", "浚县", "淇县"],
        "新乡市": ["红旗区", "卫滨区", "凤泉区", "牧野区", "新乡县", "获嘉县", "原阳县", "延津县", "封丘县", "长垣县", "卫辉市", "辉县市"],
        "焦作市": ["解放区", "中站区", "马村区", "山阳区", "修武县", "博爱县", "武陟县", "温县", "济源市", "沁阳市", "孟州市"],
        "濮阳市": ["华龙区", "清丰县", "南乐县", "范县", "台前县", "濮阳县"],
        "许昌市": ["魏都区", "许昌县", "鄢陵县", "襄城县", "禹州市", "长葛市"],
        "漯河市": ["源汇区", "郾城区", "召陵区", "舞阳县", "临颍县"],
        "三门峡市": ["湖滨区", "渑池县", "陕县", "卢氏县", "义马市", "灵宝市"],
        "南阳市": ["宛城区", "卧龙区", "南召县", "方城县", "西峡县", "镇平县", "内乡县", "淅川县", "社旗县", "唐河县", "新野县", "桐柏县", "邓州市"],
        "商丘市": ["梁园区", "睢阳区", "民权县", "睢县", "宁陵县", "柘城县", "虞城县", "夏邑县", "永城市"],
        "信阳市": ["师河区", "平桥区", "罗山县", "光山县", "新县", "商城县", "固始县", "潢川县", "淮滨县", "息县"],
        "周口市": ["川汇区", "扶沟县", "西华县", "商水县", "沈丘县", "郸城县", "淮阳县", "太康县", "鹿邑县", "项城市"],
        "驻马店市": ["驿城区", "西平县", "上蔡县", "平舆县", "正阳县", "确山县", "泌阳县", "汝南县", "遂平县", "新蔡县"]
    },
    "湖北省": {
        "武汉市": ["江岸区", "江汉区", "乔口区", "汉阳区", "武昌区", "青山区", "洪山区", "东西湖区", "汉南区", "蔡甸区", "江夏区", "黄陂区", "新洲区"],
        "黄石市": ["黄石港区", "西塞山区", "下陆区", "铁山区", "阳新县", "大冶市"],
        "十堰市": ["茅箭区", "张湾区", "郧县", "郧西县", "竹山县", "竹溪县", "房县", "丹江口市"],
        "宜昌市": ["西陵区", "伍家岗区", "点军区", "猇亭区", "夷陵区", "远安县", "兴山县", "秭归县", "长阳土家族自治县", "五峰土家族自治县", "宜都市", "当阳市", "枝江市"],
        "襄樊市": ["襄城区", "樊城区", "襄阳区", "南漳县", "谷城县", "保康县", "老河口市", "枣阳市", "宜城市"],
        "鄂州市": ["梁子湖区", "华容区", "鄂城区"],
        "荆门市": ["东宝区", "掇刀区", "京山县", "沙洋县", "钟祥市"],
        "孝感市": ["孝南区", "孝昌县", "大悟县", "云梦县", "应城市", "安陆市", "汉川市"],
        "荆州市": ["沙市区", "荆州区", "公安县", "监利县", "江陵县", "石首市", "洪湖市", "松滋市"],
        "黄冈市": ["黄州区", "团风县", "红安县", "罗田县", "英山县", "浠水县", "蕲春县", "黄梅县", "麻城市", "武穴市"],
        "咸宁市": ["咸安区", "嘉鱼县", "通城县", "崇阳县", "通山县", "赤壁市"],
        "随州市": ["曾都区", "广水市"],
        "恩施土家族苗族自治州": ["恩施市", "利川市", "建始县", "巴东县", "宣恩县", "咸丰县", "来凤县", "鹤峰县"],
        "省直辖行政单位": ["仙桃市", "潜江市", "天门市", "神农架林区"]
    },
    "湖南省": {
        "长沙市": ["芙蓉区", "天心区", "岳麓区", "开福区", "雨花区", "长沙县", "望城县", "宁乡县", "浏阳市"],
        "株洲市": ["荷塘区", "芦淞区", "石峰区", "天元区", "株洲县", "攸县", "茶陵县", "炎陵县", "醴陵市"],
        "湘潭市": ["雨湖区", "岳塘区", "湘潭县", "湘乡市", "韶山市"],
        "衡阳市": ["珠晖区", "雁峰区", "石鼓区", "蒸湘区", "南岳区", "衡阳县", "衡南县", "衡山县", "衡东县", "祁东县", "耒阳市", "常宁市"],
        "邵阳市": ["双清区", "大祥区", "北塔区", "邵东县", "新邵县", "邵阳县", "隆回县", "洞口县", "绥宁县", "新宁县", "城步苗族自治县", "武冈市"],
        "岳阳市": ["岳阳楼区", "云溪区", "君山区", "岳阳县", "华容县", "湘阴县", "平江县", "汨罗市", "临湘市"],
        "常德市": ["武陵区", "鼎城区", "安乡县", "汉寿县", "澧县", "临澧县", "桃源县", "石门县", "津市市"],
        "张家界市": ["永定区", "武陵源区", "慈利县", "桑植县"],
        "益阳市": ["资阳区", "赫山区", "南县", "桃江县", "安化县", "沅江市"],
        "郴州市": ["北湖区", "苏仙区", "桂阳县", "宜章县", "永兴县", "嘉禾县", "临武县", "汝城县", "桂东县", "安仁县", "资兴市"],
        "永州市": ["芝山区", "冷水滩区", "祁阳县", "东安县", "双牌县", "道县", "江永县", "宁远县", "蓝山县", "新田县", "江华瑶族自治县"],
        "怀化市": ["鹤城区", "中方县", "沅陵县", "辰溪县", "溆浦县", "会同县", "麻阳苗族自治县", "新晃侗族自治县", "芷江侗族自治县", "靖州苗族侗族自治县", "通道侗族自治县", "洪江市"],
        "娄底市": ["娄星区", "双峰县", "新化县", "冷水江市", "涟源市"],
        "湘西土家族苗族自治州": ["吉首市", "泸溪县", "凤凰县", "花垣县", "保靖县", "古丈县", "永顺县", "龙山县"]
    },
    "广东省": {
        "广州市": ["东山区", "荔湾区", "越秀区", "海珠区", "天河区", "芳村区", "白云区", "黄埔区", "番禺区", "花都区", "增城市", "从化市"],
        "韶关市": ["武江区", "浈江区", "曲江区", "始兴县", "仁化县", "翁源县", "乳源瑶族自治县", "新丰县", "乐昌市", "南雄市"],
        "深圳市": ["罗湖区", "福田区", "南山区", "宝安区", "龙岗区", "盐田区"],
        "珠海市": ["香洲区", "斗门区", "金湾区"],
        "汕头市": ["龙湖区", "金平区", "濠江区", "潮阳区", "潮南区", "澄海区", "南澳县"],
        "佛山市": ["禅城区", "南海区", "顺德区", "三水区", "高明区"],
        "江门市": ["蓬江区", "江海区", "新会区", "台山市", "开平市", "鹤山市", "恩平市"],
        "湛江市": ["赤坎区", "霞山区", "坡头区", "麻章区", "遂溪县", "徐闻县", "廉江市", "雷州市", "吴川市"],
        "茂名市": ["茂南区", "茂港区", "电白县", "高州市", "化州市", "信宜市"],
        "肇庆市": ["端州区", "鼎湖区", "广宁县", "怀集县", "封开县", "德庆县", "高要市", "四会市"],
        "惠州市": ["惠城区", "惠阳区", "博罗县", "惠东县", "龙门县"],
        "梅州市": ["梅江区", "梅县", "大埔县", "丰顺县", "五华县", "平远县", "蕉岭县", "兴宁市"],
        "汕尾市": ["城区", "海丰县", "陆河县", "陆丰市"],
        "河源市": ["源城区", "紫金县", "龙川县", "连平县", "和平县", "东源县"],
        "阳江市": ["江城区", "阳西县", "阳东县", "阳春市"],
        "清远市": ["清城区", "佛冈县", "阳山县", "连山壮族瑶族自治县", "连南瑶族自治县", "清新县", "英德市", "连州市"],
        "东莞市": ["东莞市"],
        "中山市": ["中山市"],
        "潮州市": ["湘桥区", "潮安县", "饶平县"],
        "揭阳市": ["榕城区", "揭东县", "揭西县", "惠来县", "普宁市"],
        "云浮市": ["云城区", "新兴县", "郁南县", "云安县", "罗定市"]
    },
    "广西省": {
        "南宁市": ["兴宁区", "青秀区", "江南区", "西乡塘区", "良庆区", "邕宁区", "武鸣县", "隆安县", "马山县", "上林县", "宾阳县", "横县"],
        "柳州市": ["城中区", "鱼峰区", "柳南区", "柳北区", "柳江县", "柳城县", "鹿寨县", "融安县", "融水苗族自治县", "三江侗族自治县"],
        "桂林市": ["秀峰区", "叠彩区", "象山区", "七星区", "雁山区", "阳朔县", "临桂县", "灵川县", "全州县", "兴安县", "永福县", "灌阳县", "龙胜各族自治县", "资源县", "平乐县", "荔蒲县", "恭城瑶族自治县"],
        "梧州市": ["万秀区", "蝶山区", "长洲区", "苍梧县", "藤县", "蒙山县", "岑溪市"],
        "北海市": ["海城区", "银海区", "铁山港区", "合浦县"],
        "防城港市": ["港口区", "防城区", "上思县", "东兴市"],
        "钦州市": ["钦南区", "钦北区", "灵山县", "浦北县"],
        "贵港市": ["港北区", "港南区", "覃塘区", "平南县", "桂平市"],
        "玉林市": ["玉州区", "容县", "陆川县", "博白县", "兴业县", "北流市"],
        "百色市": ["右江区", "田阳县", "田东县", "平果县", "德保县", "靖西县", "那坡县", "凌云县", "乐业县", "田林县", "西林县", "隆林各族自治县"],
        "贺州市": ["八步区", "昭平县", "钟山县", "富川瑶族自治县"],
        "河池市": ["金城江区", "南丹县", "天峨县", "凤山县", "东兰县", "罗城仫佬族自治县", "环江毛南族自治县", "巴马瑶族自治县", "都安瑶族自治县", "大化瑶族自治县", "宜州市"],
        "来宾市": ["兴宾区", "忻城县", "象州县", "武宣县", "金秀瑶族自治县", "合山市"],
        "崇左市": ["江洲区", "扶绥县", "宁明县", "龙州县", "大新县", "天等县", "凭祥市"]
    },
    "陕西省": {
        "西安市": ["新城区", "碑林区", "莲湖区", "灞桥区", "未央区", "雁塔区", "阎良区", "临潼区", "长安区", "蓝田县", "周至县", "户县", "高陵县"],
        "铜川市": ["王益区", "印台区", "耀州区", "宜君县"],
        "宝鸡市": ["渭滨区", "金台区", "陈仓区", "凤翔县", "岐山县", "扶风县", "眉县", "陇县", "千阳县", "麟游县", "凤县", "太白县"],
        "咸阳市": ["秦都区", "杨凌区", "渭城区", "三原县", "泾阳县", "乾县", "礼泉县", "永寿县", "彬县", "长武县", "旬邑县", "淳化县", "武功县", "兴平市"],
        "渭南市": ["临渭区", "华县", "潼关县", "大荔县", "合阳县", "澄城县", "蒲城县", "白水县", "富平县", "韩城市", "华阴市"],
        "延安市": ["宝塔区", "延长县", "延川县", "子长县", "安塞县", "志丹县", "吴旗县", "甘泉县", "富县", "洛川县", "宜川县", "黄龙县", "黄陵县"],
        "汉中市": ["汉台区", "南郑县", "城固县", "洋县", "西乡县", "勉县", "宁强县", "略阳县", "镇巴县", "留坝县", "佛坪县"],
        "榆林市": ["榆阳区", "神木县", "府谷县", "横山县", "靖边县", "定边县", "绥德县", "米脂县", "佳县", "吴堡县", "清涧县", "子洲县"],
        "安康市": ["汉滨区", "汉阴县", "石泉县", "宁陕县", "紫阳县", "岚皋县", "平利县", "镇坪县", "旬阳县", "白河县"],
        "商洛市": ["商州区", "洛南县", "丹凤县", "商南县", "山阳县", "镇安县", "柞水县"]
    },
    "甘肃省": {
        "兰州市": ["城关区", "七里河区", "西固区", "安宁区", "红古区", "永登县", "皋兰县", "榆中县"],
        "嘉峪关市": ["市辖区"],
        "金昌市": ["金川区", "永昌县"],
        "白银市": ["白银区", "平川区", "靖远县", "会宁县", "景泰县"],
        "天水市": ["秦城区", "北道区", "清水县", "秦安县", "甘谷县", "武山县", "张家川回族自治县"],
        "武威市": ["凉州区", "民勤县", "古浪县", "天祝藏族自治县"],
        "张掖市": ["甘州区", "肃南裕固族自治县", "民乐县", "临泽县", "高台县", "山丹县"],
        "平凉市": ["崆峒区", "泾川县", "灵台县", "崇信县", "华亭县", "庄浪县", "静宁县"],
        "酒泉市": ["肃州区", "金塔县", "安西县", "肃北蒙古族自治县", "阿克塞哈萨克族自治县", "玉门市", "敦煌市"],
        "庆阳市": ["西峰区", "庆城县", "环县", "华池县", "合水县", "正宁县", "宁县", "镇原县"],
        "定西市": ["安定区", "通渭县", "陇西县", "渭源县", "临洮县", "漳县", "岷县"],
        "陇南市": ["武都区", "成县", "文县", "宕昌县", "康县", "西和县", "礼县", "徽县", "两当县"],
        "临夏回族自治州": ["临夏市", "临夏县", "康乐县", "永靖县", "广河县", "和政县", "东乡族自治县", "积石山保安族东乡族撒拉族自治县"],
        "甘南藏族自治州": ["合作市", "临潭县", "卓尼县", "舟曲县", "迭部县", "玛曲县", "碌曲县", "夏河县"]
    },
    "青海省": {
        "西宁市": ["城东区", "城中区", "城西区", "城北区", "大通回族土族自治县", "湟中县", "湟源县"],
        "海东地区": ["平安县", "民和回族土族自治县", "乐都县", "互助土族自治县", "化隆回族自治县", "循化撒拉族自治县"],
        "海北藏族自治州": ["门源回族自治县", "祁连县", "海晏县", "刚察县"],
        "黄南藏族自治州": ["同仁县", "尖扎县", "泽库县", "河南蒙古族自治县"],
        "海南藏族自治州": ["共和县", "同德县", "贵德县", "兴海县", "贵南县"],
        "果洛藏族自治州": ["玛沁县", "班玛县", "甘德县", "达日县", "久治县", "玛多县"],
        "玉树藏族自治州": ["玉树县", "杂多县", "称多县", "治多县", "囊谦县", "曲麻莱县"],
        "海西蒙古族藏族自治州": ["格尔木市", "德令哈市", "乌兰县", "都兰县", "天峻县"]
    },
    "宁夏省": {
        "银川市": ["兴庆区", "西夏区", "金凤区", "永宁县", "贺兰县", "灵武市"],
        "石嘴山市": ["大武口区", "惠农区", "平罗县"],
        "吴忠市": ["利通区", "盐池县", "同心县", "青铜峡市"],
        "固原市": ["原州区", "西吉县", "隆德县", "泾源县", "彭阳县", "海原县"],
        "中卫市": ["沙坡头区", "中宁县"]
    },
    "新疆省": {
        "乌鲁木齐市": ["天山区", "沙依巴克区", "新市区", "水磨沟区", "头屯河区", "达坂城区", "东山区", "乌鲁木齐县"],
        "克拉玛依市": ["独山子区", "克拉玛依区", "白碱滩区", "乌尔禾区"],
        "吐鲁番地区": ["吐鲁番市", "鄯善县", "托克逊县"],
        "哈密地区": ["哈密市", "巴里坤哈萨克自治县", "伊吾县"],
        "昌吉回族自治州": ["昌吉市", "阜康市", "米泉市", "呼图壁县", "玛纳斯县", "奇台县", "吉木萨尔县", "木垒哈萨克自治县"],
        "博尔塔拉蒙古自治州": ["博乐市", "精河县", "温泉县"],
        "巴音郭楞蒙古自治州": ["库尔勒市", "轮台县", "尉犁县", "若羌县", "且末县", "焉耆回族自治县", "和静县", "和硕县", "博湖县"],
        "阿克苏地区": ["阿克苏市", "温宿县", "库车县", "沙雅县", "新和县", "拜城县", "乌什县", "阿瓦提县", "柯坪县"],
        "克孜勒苏柯尔克孜自治州": ["阿图什市", "阿克陶县", "阿合奇县", "乌恰县"],
        "喀什地区": ["喀什市", "疏附县", "疏勒县", "英吉沙县", "泽普县", "莎车县", "叶城县", "麦盖提县", "岳普湖县", "伽师县", "巴楚县", "塔什库尔干塔吉克自治县"],
        "和田地区": ["和田市", "和田县", "墨玉县", "皮山县", "洛浦县", "策勒县", "于田县", "民丰县"],
        "伊犁哈萨克自治州": ["伊宁市", "奎屯市", "伊宁县", "察布查尔锡伯自治县", "霍城县", "巩留县", "新源县", "昭苏县", "特克斯县", "尼勒克县"],
        "塔城地区": ["塔城市", "乌苏市", "额敏县", "沙湾县", "托里县", "裕民县", "和布克赛尔蒙古自治县"],
        "阿勒泰地区": ["阿勒泰市", "布尔津县", "富蕴县", "福海县", "哈巴河县", "青河县", "吉木乃县"],
        "省直辖行政单位": ["石河子市", "阿拉尔市", "图木舒克市", "五家渠市"]
    },
    "河北省": {
        "石家庄市": ["长安区", "桥东区", "桥西区", "新华区", "井陉矿区", "裕华区", "井陉县", "正定县", "栾城县", "行唐县", "灵寿县", "高邑县", "深泽县", "赞皇县", "无极县", "平山县", "元氏县", "赵县", "辛集市", "藁城市", "晋州市", "新乐市", "鹿泉市"],
        "唐山市": ["路南区", "路北区", "古冶区", "开平区", "丰南区", "丰润区", "滦县", "滦南县", "乐亭县", "迁西县", "玉田县", "唐海县", "遵化市", "迁安市"],
        "秦皇岛市": ["海港区", "山海关区", "北戴河区", "青龙满族自治县", "昌黎县", "抚宁县", "卢龙县"],
        "邯郸市": ["邯山区", "丛台区", "复兴区", "峰峰矿区", "邯郸县", "临漳县", "成安县", "大名县", "涉县", "磁县", "肥乡县", "永年县", "邱县", "鸡泽县", "广平县", "馆陶县", "魏县", "曲周县", "武安市"],
        "邢台市": ["桥东区", "桥西区", "邢台县", "临城县", "内丘县", "柏乡县", "隆尧县", "任县", "南和县", "宁晋县", "巨鹿县", "新河县", "广宗县", "平乡县", "威县", "清河县", "临西县", "南宫市", "沙河市"],
        "保定市": ["新市区", "北市区", "南市区", "满城县", "清苑县", "涞水县", "阜平县", "徐水县", "定兴县", "唐县", "高阳县", "容城县", "涞源县", "望都县", "安新县", "易县", "曲阳县", "蠡县", "顺平县", "博野县", "雄县", "涿州市", "定州市", "安国市", "高碑店市"],
        "张家口市": ["桥东区", "桥西区", "宣化区", "下花园区", "宣化县", "张北县", "康保县", "沽源县", "尚义县", "蔚县", "阳原县", "怀安县", "万全县", "怀来县", "涿鹿县", "赤城县", "崇礼县"],
        "承德市": ["双桥区", "双滦区", "鹰手营子矿区", "承德县", "兴隆县", "平泉县", "滦平县", "隆化县", "丰宁满族自治县", "宽城满族自治县", "围场满族蒙古族自治县"],
        "沧州市": ["新华区", "运河区", "沧县", "青县", "东光县", "海兴县", "盐山县", "肃宁县", "南皮县", "吴桥县", "献县", "孟村回族自治县", "泊头市", "任丘市", "黄骅市", "河间市"],
        "廊坊市": ["安次区", "广阳区", "固安县", "永清县", "香河县", "大城县", "文安县", "大厂回族自治县", "霸州市", "三河市"],
        "衡水市": ["桃城区", "枣强县", "武邑县", "武强县", "饶阳县", "安平县", "故城县", "景县", "阜城县", "冀州市", "深州市"]
    },
    "山西省": {
        "太原市": ["小店区", "迎泽区", "杏花岭区", "尖草坪区", "万柏林区", "晋源区", "清徐县", "阳曲县", "娄烦县", "古交市"],
        "大同市": ["城区", "矿区", "南郊区", "新荣区", "阳高县", "天镇县", "广灵县", "灵丘县", "浑源县", "左云县", "大同县"],
        "阳泉市": ["城区", "矿区", "郊区", "平定县", "盂县"],
        "长治市": ["城区", "郊区", "长治县", "襄垣县", "屯留县", "平顺县", "黎城县", "壶关县", "长子县", "武乡县", "沁县", "沁源县", "潞城市"],
        "晋城市": ["城区", "沁水县", "阳城县", "陵川县", "泽州县", "高平市"],
        "朔州市": ["朔城区", "平鲁区", "山阴县", "应县", "右玉县", "怀仁县"],
        "晋中市": ["榆次区", "榆社县", "左权县", "和顺县", "昔阳县", "寿阳县", "太谷县", "祁县", "平遥县", "灵石县", "介休市"],
        "运城市": ["盐湖区", "临猗县", "万荣县", "闻喜县", "稷山县", "新绛县", "绛县", "垣曲县", "夏县", "平陆县", "芮城县", "永济市", "河津市"],
        "忻州市": ["忻府区", "定襄县", "五台县", "代县", "繁峙县", "宁武县", "静乐县", "神池县", "五寨县", "岢岚县", "河曲县", "保德县", "偏关县", "原平市"],
        "临汾市": ["尧都区", "曲沃县", "翼城县", "襄汾县", "洪洞县", "古县", "安泽县", "浮山县", "吉县", "乡宁县", "大宁县", "隰县", "永和县", "蒲县", "汾西县", "侯马市", "霍州市"],
        "吕梁市": ["离石区", "文水县", "交城县", "兴县", "临县", "柳林县", "石楼县", "岚县", "方山县", "中阳县", "交口县", "孝义市", "汾阳市"]
    },
    "内蒙古省": {
        "呼和浩特市": ["新城区", "回民区", "玉泉区", "赛罕区", "土默特左旗", "托克托县", "和林格尔县", "清水河县", "武川县"],
        "包头市": ["东河区", "昆都仑区", "青山区", "石拐区", "白云矿区", "九原区", "土默特右旗", "固阳县", "达尔罕茂明安联合旗"],
        "乌海市": ["海勃湾区", "海南区", "乌达区"],
        "赤峰市": ["红山区", "元宝山区", "松山区", "阿鲁科尔沁旗", "巴林左旗", "巴林右旗", "林西县", "克什克腾旗", "翁牛特旗", "喀喇沁旗", "宁城县", "敖汉旗"],
        "通辽市": ["科尔沁区", "科尔沁左翼中旗", "科尔沁左翼后旗", "开鲁县", "库伦旗", "奈曼旗", "扎鲁特旗", "霍林郭勒市"],
        "鄂尔多斯市": ["东胜区", "达拉特旗", "准格尔旗", "鄂托克前旗", "鄂托克旗", "杭锦旗", "乌审旗", "伊金霍洛旗"],
        "呼伦贝尔市": ["海拉尔区", "阿荣旗", "莫力达瓦达斡尔族自治旗", "鄂伦春自治旗", "鄂温克族自治旗", "陈巴尔虎旗", "新巴尔虎左旗", "新巴尔虎右旗", "满洲里市", "牙克石市", "扎兰屯市", "额尔古纳市", "根河市"],
        "巴彦淖尔市": ["临河区", "五原县", "磴口县", "乌拉特前旗", "乌拉特中旗", "乌拉特后旗", "杭锦后旗"],
        "乌兰察布市": ["集宁区", "卓资县", "化德县", "商都县", "兴和县", "凉城县", "察哈尔右翼前旗", "察哈尔右翼中旗", "察哈尔右翼后旗", "四子王旗", "丰镇市"],
        "兴安盟": ["乌兰浩特市", "阿尔山市", "科尔沁右翼前旗", "科尔沁右翼中旗", "扎赉特旗", "突泉县"],
        "锡林郭勒盟": ["二连浩特市", "锡林浩特市", "阿巴嘎旗", "苏尼特左旗", "苏尼特右旗", "东乌珠穆沁旗", "西乌珠穆沁旗", "太仆寺旗", "镶黄旗", "正镶白旗", "正蓝旗", "多伦县"],
        "阿拉善盟": ["阿拉善左旗", "阿拉善右旗", "额济纳旗"]
    },
    "江苏省": {
        "南京市": ["玄武区", "白下区", "秦淮区", "建邺区", "鼓楼区", "下关区", "浦口区", "栖霞区", "雨花台区", "江宁区", "六合区", "溧水县", "高淳县"],
        "无锡市": ["崇安区", "南长区", "北塘区", "锡山区", "惠山区", "滨湖区", "江阴市", "宜兴市"],
        "徐州市": ["鼓楼区", "云龙区", "九里区", "贾汪区", "泉山区", "丰县", "沛县", "铜山县", "睢宁县", "新沂市", "邳州市"],
        "常州市": ["天宁区", "钟楼区", "戚墅堰区", "新北区", "武进区", "溧阳市", "金坛市"],
        "苏州市": ["沧浪区", "平江区", "金阊区", "虎丘区", "吴中区", "相城区", "常熟市", "张家港市", "昆山市", "吴江市", "太仓市"],
        "南通市": ["崇川区", "港闸区", "海安县", "如东县", "启东市", "如皋市", "通州市", "海门市"],
        "连云港市": ["连云区", "新浦区", "海州区", "赣榆县", "东海县", "灌云县", "灌南县"],
        "淮安市": ["清河区", "楚州区", "淮阴区", "清浦区", "涟水县", "洪泽县", "盱眙县", "金湖县"],
        "盐城市": ["亭湖区", "盐都区", "响水县", "滨海县", "阜宁县", "射阳县", "建湖县", "东台市", "大丰市"],
        "扬州市": ["广陵区", "邗江区", "郊区", "宝应县", "仪征市", "高邮市", "江都市"],
        "镇江市": ["京口区", "润州区", "丹徒区", "丹阳市", "扬中市", "句容市"],
        "泰州市": ["海陵区", "高港区", "兴化市", "靖江市", "泰兴市", "姜堰市"],
        "宿迁市": ["宿城区", "宿豫区", "沭阳县", "泗阳县", "泗洪县"]
    },
    "浙江省": {
        "杭州市": ["上城区", "下城区", "江干区", "拱墅区", "西湖区", "滨江区", "萧山区", "余杭区", "桐庐县", "淳安县", "建德市", "富阳市", "临安市"],
        "宁波市": ["海曙区", "江东区", "江北区", "北仑区", "镇海区", "鄞州区", "象山县", "宁海县", "余姚市", "慈溪市", "奉化市"],
        "温州市": ["鹿城区", "龙湾区", "瓯海区", "洞头县", "永嘉县", "平阳县", "苍南县", "文成县", "泰顺县", "瑞安市", "乐清市"],
        "嘉兴市": ["秀城区", "秀洲区", "嘉善县", "海盐县", "海宁市", "平湖市", "桐乡市"],
        "湖州市": ["吴兴区", "南浔区", "德清县", "长兴县", "安吉县"],
        "绍兴市": ["越城区", "绍兴县", "新昌县", "诸暨市", "上虞市", "嵊州市"],
        "金华市": ["婺城区", "金东区", "武义县", "浦江县", "磐安县", "兰溪市", "义乌市", "东阳市", "永康市"],
        "衢州市": ["柯城区", "衢江区", "常山县", "开化县", "龙游县", "江山市"],
        "舟山市": ["定海区", "普陀区", "岱山县", "嵊泗县"],
        "台州市": ["椒江区", "黄岩区", "路桥区", "玉环县", "三门县", "天台县", "仙居县", "温岭市", "临海市"],
        "丽水市": ["莲都区", "青田县", "缙云县", "遂昌县", "松阳县", "云和县", "庆元县", "景宁畲族自治县", "龙泉市"]
    },
    "安徽省": {
        "合肥市": ["瑶海区", "庐阳区", "蜀山区", "包河区", "长丰县", "肥东县", "肥西县"],
        "芜湖市": ["镜湖区", "马塘区", "新芜区", "鸠江区", "芜湖县", "繁昌县", "南陵县"],
        "蚌埠市": ["龙子湖区", "蚌山区", "禹会区", "淮上区", "怀远县", "五河县", "固镇县"],
        "淮南市": ["大通区", "田家庵区", "谢家集区", "八公山区", "潘集区", "凤台县"],
        "马鞍山市": ["金家庄区", "花山区", "雨山区", "当涂县"],
        "淮北市": ["杜集区", "相山区", "烈山区", "濉溪县"],
        "铜陵市": ["铜官山区", "狮子山区", "郊区", "铜陵县"],
        "安庆市": ["迎江区", "大观区", "郊区", "怀宁县", "枞阳县", "潜山县", "太湖县", "宿松县", "望江县", "岳西县", "桐城市"],
        "黄山市": ["屯溪区", "黄山区", "徽州区", "歙县", "休宁县", "黟县", "祁门县"],
        "滁州市": ["琅琊区", "南谯区", "来安县", "全椒县", "定远县", "凤阳县", "天长市", "明光市"],
        "阜阳市": ["颍州区", "颍东区", "颍泉区", "临泉县", "太和县", "阜南县", "颍上县", "界首市"],
        "宿州市": ["墉桥区", "砀山县", "萧县", "灵璧县", "泗县"],
        "巢湖市": ["居巢区", "庐江县", "无为县", "含山县", "和县"],
        "六安市": ["金安区", "裕安区", "寿县", "霍邱县", "舒城县", "金寨县", "霍山县"],
        "亳州市": ["谯城区", "涡阳县", "蒙城县", "利辛县"],
        "池州市": ["贵池区", "东至县", "石台县", "青阳县"],
        "宣城市": ["宣州区", "郎溪县", "广德县", "泾县", "绩溪县", "旌德县", "宁国市"]
    },
    "福建省": {
        "福州市": ["鼓楼区", "台江区", "仓山区", "马尾区", "晋安区", "闽侯县", "连江县", "罗源县", "闽清县", "永泰县", "平潭县", "福清市", "长乐市"],
        "厦门市": ["思明区", "海沧区", "湖里区", "集美区", "同安区", "翔安区"],
        "莆田市": ["城厢区", "涵江区", "荔城区", "秀屿区", "仙游县"],
        "三明市": ["梅列区", "三元区", "明溪县", "清流县", "宁化县", "大田县", "尤溪县", "沙县", "将乐县", "泰宁县", "建宁县", "永安市"],
        "泉州市": ["鲤城区", "丰泽区", "洛江区", "泉港区", "惠安县", "安溪县", "永春县", "德化县", "金门县", "石狮市", "晋江市", "南安市"],
        "漳州市": ["芗城区", "龙文区", "云霄县", "漳浦县", "诏安县", "长泰县", "东山县", "南靖县", "平和县", "华安县", "龙海市"],
        "南平市": ["延平区", "顺昌县", "浦城县", "光泽县", "松溪县", "政和县", "邵武市", "武夷山市", "建瓯市", "建阳市"],
        "龙岩市": ["新罗区", "长汀县", "永定县", "上杭县", "武平县", "连城县", "漳平市"],
        "宁德市": ["蕉城区", "霞浦县", "古田县", "屏南县", "寿宁县", "周宁县", "柘荣县", "福安市", "福鼎市"]
    },
    "江西省": {
        "南昌市": ["东湖区", "西湖区", "青云谱区", "湾里区", "青山湖区", "南昌县", "新建县", "安义县", "进贤县"],
        "景德镇市": ["昌江区", "珠山区", "浮梁县", "乐平市"],
        "萍乡市": ["安源区", "湘东区", "莲花县", "上栗县", "芦溪县"],
        "九江市": ["庐山区", "浔阳区", "九江县", "武宁县", "修水县", "永修县", "德安县", "星子县", "都昌县", "湖口县", "彭泽县", "瑞昌市"],
        "新余市": ["渝水区", "分宜县"],
        "鹰潭市": ["月湖区", "余江县", "贵溪市"],
        "赣州市": ["章贡区", "赣县", "信丰县", "大余县", "上犹县", "崇义县", "安远县", "龙南县", "定南县", "全南县", "宁都县", "于都县", "兴国县", "会昌县", "寻乌县", "石城县", "瑞金市", "南康市"],
        "吉安市": ["吉州区", "青原区", "吉安县", "吉水县", "峡江县", "新干县", "永丰县", "泰和县", "遂川县", "万安县", "安福县", "永新县", "井冈山市"],
        "宜春市": ["袁州区", "奉新县", "万载县", "上高县", "宜丰县", "靖安县", "铜鼓县", "丰城市", "樟树市", "高安市"],
        "抚州市": ["临川区", "南城县", "黎川县", "南丰县", "崇仁县", "乐安县", "宜黄县", "金溪县", "资溪县", "东乡县", "广昌县"],
        "上饶市": ["信州区", "上饶县", "广丰县", "玉山县", "铅山县", "横峰县", "弋阳县", "余干县", "鄱阳县", "万年县", "婺源县", "德兴市"]
    },
    "山东省": {
        "济南市": ["历下区", "市中区", "槐荫区", "天桥区", "历城区", "长清区", "平阴县", "济阳县", "商河县", "章丘市"],
        "青岛市": ["市南区", "市北区", "四方区", "黄岛区", "崂山区", "李沧区", "城阳区", "胶州市", "即墨市", "平度市", "胶南市", "莱西市"],
        "淄博市": ["淄川区", "张店区", "博山区", "临淄区", "周村区", "桓台县", "高青县", "沂源县"],
        "枣庄市": ["市中区", "薛城区", "峄城区", "台儿庄区", "山亭区", "滕州市"],
        "东营市": ["东营区", "河口区", "垦利县", "利津县", "广饶县"],
        "烟台市": ["芝罘区", "福山区", "牟平区", "莱山区", "长岛县", "龙口市", "莱阳市", "莱州市", "蓬莱市", "招远市", "栖霞市", "海阳市"],
        "潍坊市": ["潍城区", "寒亭区", "坊子区", "奎文区", "临朐县", "昌乐县", "青州市", "诸城市", "寿光市", "安丘市", "高密市", "昌邑市"],
        "济宁市": ["市中区", "任城区", "微山县", "鱼台县", "金乡县", "嘉祥县", "汶上县", "泗水县", "梁山县", "曲阜市", "兖州市", "邹城市"],
        "泰安市": ["泰山区", "岱岳区", "宁阳县", "东平县", "新泰市", "肥城市"],
        "威海市": ["环翠区", "文登市", "荣成市", "乳山市"],
        "日照市": ["东港区", "岚山区", "五莲县", "莒县"],
        "莱芜市": ["莱城区", "钢城区"],
        "临沂市": ["兰山区", "罗庄区", "河东区", "沂南县", "郯城县", "沂水县", "苍山县", "费县", "平邑县", "莒南县", "蒙阴县", "临沭县"],
        "德州市": ["德城区", "陵县", "宁津县", "庆云县", "临邑县", "齐河县", "平原县", "夏津县", "武城县", "乐陵市", "禹城市"],
        "聊城市": ["东昌府区", "阳谷县", "莘县", "茌平县", "东阿县", "冠县", "高唐县", "临清市"],
        "滨州市": ["滨城区", "惠民县", "阳信县", "无棣县", "沾化县", "博兴县", "邹平县"],
        "荷泽市": ["牡丹区", "曹县", "单县", "成武县", "巨野县", "郓城县", "鄄城县", "定陶县", "东明县"]
    },
    "辽宁省": {
        "沈阳市": ["和平区", "沈河区", "大东区", "皇姑区", "铁西区", "苏家屯区", "东陵区", "新城子区", "于洪区", "辽中县", "康平县", "法库县", "新民市"],
        "大连市": ["中山区", "西岗区", "沙河口区", "甘井子区", "旅顺口区", "金州区", "长海县", "瓦房店市", "普兰店市", "庄河市"],
        "鞍山市": ["铁东区", "铁西区", "立山区", "千山区", "台安县", "岫岩满族自治县", "海城市"],
        "抚顺市": ["新抚区", "东洲区", "望花区", "顺城区", "抚顺县", "新宾满族自治县", "清原满族自治县"],
        "本溪市": ["平山区", "溪湖区", "明山区", "南芬区", "本溪满族自治县", "桓仁满族自治县"],
        "丹东市": ["元宝区", "振兴区", "振安区", "宽甸满族自治县", "东港市", "凤城市"],
        "锦州市": ["古塔区", "凌河区", "太和区", "黑山县", "义县", "凌海市", "北宁市"],
        "营口市": ["站前区", "西市区", "鲅鱼圈区", "老边区", "盖州市", "大石桥市"],
        "阜新市": ["海州区", "新邱区", "太平区", "清河门区", "细河区", "阜新蒙古族自治县", "彰武县"],
        "辽阳市": ["白塔区", "文圣区", "宏伟区", "弓长岭区", "太子河区", "辽阳县", "灯塔市"],
        "盘锦市": ["双台子区", "兴隆台区", "大洼县", "盘山县"],
        "铁岭市": ["银州区", "清河区", "铁岭县", "西丰县", "昌图县", "调兵山市", "开原市"],
        "朝阳市": ["双塔区", "龙城区", "朝阳县", "建平县", "喀喇沁左翼蒙古族自治县", "北票市", "凌源市"],
        "葫芦岛市": ["连山区", "龙港区", "南票区", "绥中县", "建昌县", "兴城市"]
    },
    "吉林省": {
        "长春市": ["南关区", "宽城区", "朝阳区", "二道区", "绿园区", "双阳区", "农安县", "九台市", "榆树市", "德惠市"],
        "吉林市": ["昌邑区", "龙潭区", "船营区", "丰满区", "永吉县", "蛟河市", "桦甸市", "舒兰市", "磐石市"],
        "四平市": ["铁西区", "铁东区", "梨树县", "伊通满族自治县", "公主岭市", "双辽市"],
        "辽源市": ["龙山区", "西安区", "东丰县", "东辽县"],
        "通化市": ["东昌区", "二道江区", "通化县", "辉南县", "柳河县", "梅河口市", "集安市"],
        "白山市": ["八道江区", "抚松县", "靖宇县", "长白朝鲜族自治县", "江源县", "临江市"],
        "松原市": ["宁江区", "前郭尔罗斯蒙古族自治县", "长岭县", "乾安县", "扶余县"],
        "白城市": ["洮北区", "镇赉县", "通榆县", "洮南市", "大安市"],
        "延边朝鲜族自治州": ["延吉市", "图们市", "敦化市", "珲春市", "龙井市", "和龙市", "汪清县", "安图县"]
    },
    "黑龙江省": {
        "哈尔滨市": ["道里区", "南岗区", "道外区", "香坊区", "动力区", "平房区", "松北区", "呼兰区", "依兰县", "方正县", "宾县", "巴彦县", "木兰县", "通河县", "延寿县", "阿城市", "双城市", "尚志市", "五常市"],
        "齐齐哈尔市": ["龙沙区", "建华区", "铁锋区", "昂昂溪区", "富拉尔基区", "碾子山区", "梅里斯达斡尔族区", "龙江县", "依安县", "泰来县", "甘南县", "富裕县", "克山县", "克东县", "拜泉县", "讷河市"],
        "鸡西市": ["鸡冠区", "恒山区", "滴道区", "梨树区", "城子河区", "麻山区", "鸡东县", "虎林市", "密山市"],
        "鹤岗市": ["向阳区", "工农区", "南山区", "兴安区", "东山区", "兴山区", "萝北县", "绥滨县"],
        "双鸭山市": ["尖山区", "岭东区", "四方台区", "宝山区", "集贤县", "友谊县", "宝清县", "饶河县"],
        "大庆市": ["萨尔图区", "龙凤区", "让胡路区", "红岗区", "大同区", "肇州县", "肇源县", "林甸县", "杜尔伯特蒙古族自治县"],
        "伊春市": ["伊春区", "南岔区", "友好区", "西林区", "翠峦区", "新青区", "美溪区", "金山屯区", "五营区", "乌马河区", "汤旺河区", "带岭区", "乌伊岭区", "红星区", "上甘岭区", "嘉荫县", "铁力市"],
        "佳木斯市": ["永红区", "向阳区", "前进区", "东风区", "郊区", "桦南县", "桦川县", "汤原县", "抚远县", "同江市", "富锦市"],
        "七台河市": ["新兴区", "桃山区", "茄子河区", "勃利县"],
        "牡丹江市": ["东安区", "阳明区", "爱民区", "西安区", "东宁县", "林口县", "绥芬河市", "海林市", "宁安市", "穆棱市"],
        "黑河市": ["爱辉区", "嫩江县", "逊克县", "孙吴县", "北安市", "五大连池市"],
        "绥化市": ["北林区", "望奎县", "兰西县", "青冈县", "庆安县", "明水县", "绥棱县", "安达市", "肇东市", "海伦市"],
        "大兴安岭地区": ["呼玛县", "塔河县", "漠河县"]
    },
    "海南省": {
        "海口市": ["秀英区", "龙华区", "琼山区", "美兰区"],
        "三亚市": ["三亚市"],
        "省直辖县级行政单位": ["五指山市", "琼海市", "儋州市", "文昌市", "万宁市", "东方市", "定安县", "屯昌县", "澄迈县", "临高县", "白沙黎族自治县", "昌江黎族自治县", "乐东黎族自治县", "陵水黎族自治县", "保亭黎族苗族自治县", "琼中黎族苗族自治县", "西沙群岛", "南沙群岛", "中沙群岛的岛礁及其海域"]
    }
};
