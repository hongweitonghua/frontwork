(function(win,resultInfoObj,radioName) {
    function GesturePwd(obj) {
        this.canvas = obj.canvas; //canvas元素
        this.width = obj.width;
        this.height = obj.height;
        this.matrixOrder = obj.matrixOrder; //密码矩阵阶数
        this.pwdStyle = obj.pwdStyle; //密码盘样式，如果用户不设置，则为默认值
    }
    GesturePwd.prototype = {
            init: function() {
                this.ctx = this.canvas.getContext("2d");
                if (win.devicePixelRatio) {
                    this.canvas.style.width = this.width + "px";
                    this.canvas.style.height = this.height + "px";
                    this.canvas.height = this.height * win.devicePixelRatio;
                    this.canvas.width = this.width * win.devicePixelRatio;
                    this.ctx.scale(win.devicePixelRatio, win.devicePixelRatio);
                }
                this.selectPoint = []; //存储选中密码点的集合
                this.allPoint = []; //存储所有密码点集合
                this.count = 0; //记录保存密码的次数
                if(!this.pwdStyle){
                    this.pwdStyle = this.defaultStyle;
                }
                this.createPwdPanel();
                this.bindEvent();

            },
            //密码面板默认样式
            defaultStyle:{
                genericStyle:{
                    strokeStyle : "#c8c8c8",
                    fillStyle : '#ffffff',
                    lineWidth : 2
                },
                errorStyle:{
                    strokeStyle : "#000000",
                    fillStyle : '#ffa726',
                    lineWidth : 4
                },
                selectStyle:{    
                    strokeStyle : "#fa8f09",
                    fillStyle : '#ffa726',
                    lineWidth : 2
                },
                lineStyle:{
                    strokeStyle : "#df3134",
                    fillStyle : '',
                    lineWidth : 4
                }
            },
            //生成密码面板，根据矩阵阶数动态计算半径大小，创建密码矩阵坐标数组
            createPwdPanel: function() {
                var n = this.matrixOrder;
                var index = 0;
                this.radius = this.width / (2 + 4 * n);
                var radius = this.radius;
                var point = {};
                //创建点数组
                for (var i = 0; i < n; i++) {
                    for (var j = 0; j < n; j++) {
                        index++; //用于记录编号
                        point = {
                            x: j * 4 * radius + 3 * radius,
                            y: i * 4 * radius + 3 * radius,
                            index: index
                        }
                        this.allPoint.push(point);
                    }
                }
                this.ctx.clearRect(0, 0, this.width, this.height);
                for (var i = 0; i < this.allPoint.length; i++) {
                    var setObj = this.pwdStyle.genericStyle;
                    this.drawCircle(this.allPoint[i].x, this.allPoint[i].y, setObj);
                }
            },
            //更新密码面板状态，touchmove调用
            updatePwdPanel: function(_allPoint, _selectPoint, _touchPoint, isError) {
                this.ctx.clearRect(0, 0, this.width, this.height);
                this.drawPointCircle(_allPoint, _selectPoint, isError);
                this.drawLine(_selectPoint, _touchPoint);
            },
            //绘画圆圈和填充色
            drawPointCircle: function(_allPoint, _selectPoint, isError) {
                for (var i = 0, len = _allPoint.length; i < len; i++) {
                    var setObj = {};
                    if (this.isExistPoint(_allPoint[i], _selectPoint)) {
                        setObj = this.pwdStyle.selectStyle;
                        if (isError) {
                            setObj = this.pwdStyle.errorStyle;
                        }
                    } else {
                        setObj = this.pwdStyle.genericStyle;
                    }
                    this.drawCircle(_allPoint[i].x, _allPoint[i].y, setObj);
                }
            },
            //按照顺序描线
            drawLine: function(_selectPoint, touchPoint) {
                if (_selectPoint.length > 0) {
                    this.ctx.beginPath();
                    this.ctx.lineWidth = this.pwdStyle.lineStyle.lineWidth;
                    this.ctx.strokeStyle = this.pwdStyle.lineStyle.strokeStyle;
                    this.ctx.moveTo(_selectPoint[0].x, _selectPoint[0].y);
                    for (var i = 0; i < _selectPoint.length; i++) {
                        this.ctx.lineTo(_selectPoint[i].x, _selectPoint[i].y);
                    }
                    this.ctx.stroke();
                    this.ctx.closePath();
                    if (touchPoint) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(_selectPoint[_selectPoint.length - 1].x, _selectPoint[_selectPoint.length - 1].y);
                        this.ctx.lineTo(touchPoint.x, touchPoint.y);
                        this.ctx.stroke();
                        this.ctx.closePath();
                    }
                }
            },
            //根据x,y坐标及setObj属性设置 绘画密码圆圈
            drawCircle: function(x, y, setObj) {
                //为了防止重绘之前的路径，故把之前的路径清除掉
                this.ctx.beginPath();
                this.ctx.arc(x, y, this.radius, 0, Math.PI * 2, true);
                this.ctx.closePath();
                this.ctx.lineWidth = setObj.lineWidth;
                this.ctx.strokeStyle = setObj.strokeStyle;
                this.ctx.stroke();
                if (setObj.fillStyle) {
                    this.ctx.fillStyle = setObj.fillStyle;
                    this.ctx.fill();
                }
            },
            //监听事件
            bindEvent: function() {
                var that = this;
                this.canvas.addEventListener('touchstart', function(e) {
                    e.preventDefault(); //清除默认事件，重要
                    var touches = e.touches[0];
                    if(that.isSelectPoint(touches, that.allPoint)){
                      that.drawPointCircle(that.allPoint, that.selectPoint,false);
                    }
                }, false);
                this.canvas.addEventListener('touchmove', function(e) {
                    e.preventDefault();
                    var touches = e.touches[0];
                    var point = null;
                    that.isSelectPoint(touches, that.allPoint);
                    var touchPoint = that.getPointPosition(touches);
                    that.updatePwdPanel(that.allPoint, that.selectPoint, touchPoint);
                }, false);
                this.canvas.addEventListener('touchend', function(e) {
                    that.updatePwdPanel(that.allPoint, that.selectPoint, null);
                    var curPwdStr = that.getPwdStr(that.selectPoint);
                    console.log(curPwdStr);
                    if (that.judgePwdResult(that.selectPoint, curPwdStr)) {
                        that.updatePwdPanel(that.allPoint, that.selectPoint, null, true);
                    }
                    that.selectPoint = [];
                    setTimeout(function() {
                        that.updatePwdPanel(that.allPoint, that.selectPoint, null);
                    }, 500);
                }, false);
            },
            //根据触摸点与原点间距离是否小于半径，判断是否选中点
            isSelectPoint: function(touches, _allPoint) {
                var curPoint = this.getPointPosition(touches);
                for (var i = 0, len = _allPoint.length; i < len; i++) {
                    var perPoint = _allPoint[i];
                    var x_dis = Math.abs(curPoint.x - perPoint.x);
                    var y_dis = Math.abs(curPoint.y - perPoint.y);
                    var dis = Math.pow(x_dis * x_dis + y_dis * y_dis, 0.5);
                    if (dis < this.radius) {
                        if (!this.isExistPoint(perPoint, this.selectPoint)) {
                            this.selectPoint.push(perPoint);
                        }
                        return _allPoint[i];
                    }
                }
                return null;
            },
            //判断点集合中是否已经存在某个点
            isExistPoint: function(point, pointarr) {
                if (pointarr) {
                    for (var i = 0; i < pointarr.length; i++) {
                        if (pointarr[i].index == point.index) {
                            return true;
                        }
                    }
                    return false;
                }
            },
            //得到触控点的位置（相对于canvas）
            getPointPosition: function(_touches) {
                return {
                    x: _touches.pageX - this.canvas.offsetLeft,
                    y: _touches.pageY - this.canvas.offsetTop
                }
            },
            /**
             * [getPwdStr 根据selectPoint数组得到密码字符串]
             * @param  {[type]} _selectPoint [选中密码点的集合]
             * @return {[type]}              [密码字符串，使用'->'连接]
             */
            getPwdStr: function(_selectPoint) {
                var str = "";
                for (var i = 0, len = _selectPoint.length; i < len; i++) {
                    str += (i == len - 1) ? _selectPoint[i].index : _selectPoint[i].index + "->";
                }
                return str;
            },
            /**
             * [judgePwdResult 验证密码]
             * @param  {[type]} _selectPoint [密码面板中选中的点]
             * @param  {[type]} curPwdStr    [当前用户输入的密码字符串]
             * @return {[type]}              [description]
             */
            judgePwdResult: function(_selectPoint, curPwdStr) {
                var errorLineFlag = false;
                /*if (_selectPoint.length > 0) {
                    if (getRadioBoxValue("selectWay") == 1) { //设置密码模式
                        if (this.count == 0) {
                            if (_selectPoint.length < 5) {
                                resultInfoObj.innerHTML = "密码太短，至少需要5个点";
                                errorLineFlag = true;
                            } else { //第一次设置密码正确
                                this.count = 1;
                                this.firstPwd = curPwdStr;
                                win.resultInfo.innerHTML = "请再次输入手势密码";
                            }
                        } else if (this.count == 1) { //第二次输入密码
                            if (this.firstPwd != curPwdStr) {
                                win.resultInfo.innerHTML = "两次输入的不一致";
                                errorLineFlag = true;
                            } else {
                                win.resultInfo.innerHTML = "密码设置成功";
                                win.localStorage.setItem('password', curPwdStr);
                                setRadioBoxChecked("selectWay", "2"); //将radio切换至验证密码模式
                            }
                            this.count = 0; //重新计数
                            this.firstPwd = "";
                        }
                    } else if (getRadioBoxValue("selectWay") == 2) { //验证密码模式
                        var rightPwd = win.localStorage.getItem('password');
                        if (curPwdStr == rightPwd) {
                            win.resultInfo.innerHTML = "密码正确！";
                        } else {
                            win.resultInfo.innerHTML = "输入的密码不正确";
                            errorLineFlag = true;
                        }
                    }
                }*/
                if (_selectPoint.length > 0) {
                    if (getRadioBoxValue(radioName) == 1) { //设置密码模式
                        if (this.count == 0) {
                            if (_selectPoint.length < 5) {
                                resultInfoObj.innerHTML = "密码太短，至少需要5个点";
                                errorLineFlag = true;
                            } else { //第一次设置密码正确
                                this.count = 1;
                                this.firstPwd = curPwdStr;
                                resultInfoObj.innerHTML = "请再次输入手势密码";
                            }
                        } else if (this.count == 1) { //第二次输入密码
                            if (this.firstPwd != curPwdStr) {
                                resultInfoObj.innerHTML = "两次输入的不一致";
                                errorLineFlag = true;
                            } else {
                                resultInfoObj.innerHTML = "密码设置成功";
                                win.localStorage.setItem('password', curPwdStr);
                                setRadioBoxChecked("selectWay", "2"); //将radio切换至验证密码模式
                            }
                            this.count = 0; //重新计数
                            this.firstPwd = "";
                        }
                    } else if (getRadioBoxValue(radioName) == 2) { //验证密码模式
                        var rightPwd = win.localStorage.getItem('password');
                        if (curPwdStr == rightPwd) {
                            resultInfoObj.innerHTML = "密码正确！";
                        } else {
                            resultInfoObj.innerHTML = "输入的密码不正确";
                            errorLineFlag = true;
                        }
                    }
                }
                return errorLineFlag;
            }
        }
    win.GesturePwd = GesturePwd;
        // 根据name属性获得input-radio选中的值
    win.getRadioBoxValue = function(radioName) {
        var obj = document.getElementsByName(radioName);
        for (i = 0; i < obj.length; i++) {
            if (obj[i].checked) {
                return obj[i].value;
            }
        }
        return "undefined";
    }
    //设置radio的默认选中项
    win.setRadioBoxChecked = function (radioName, value) {
        var obj = document.getElementsByName(radioName);
        for (i = 0; i < obj.length; i++) {
            if (obj[i].value == value) {
                obj[i].checked = true;
                break;
            }
        }
    }   
})(window,resultInfo,"selectWay");
