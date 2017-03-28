# 手势密码
### 1. 功能简介
用户用手指按顺序依次划过 9 个原点（n*n）中的若干个（必须不少于 4 个点），如果划过的点的数量和顺序与之前用户设置的相同，那么当用户的手指离开屏幕时，判定为密码输入正确，否则密码错误。

#### 要求：实现一个移动网页，允许用户设置手势密码和验证手势密码。已设置的密码记录在本地 localStorage 中。

##### 具体规则：
+ stat 1：设置密码。
	> 用户选择设置密码，提示用户输入手势密码
+ stat 2：密码长度太短。
	> 如果不足 5 个点，提示用户密码太短
+ stat 3：再次输入密码。
	> 提示用户再次输入密码
+ stat 4： 两次密码输入不一致。
	> 如果用户输入的两次密码不一致，提示并重置，重新开始设置密码
+ stat 5： 密码设置成功。
	> 如果两次输入一致，密码设置成功，更新 localStorage
+ stat 6： 验证密码 - 不正确。
	> 切换单选框进入验证密码模式，将用户输入的密码与保存的密码相比较，如果不一致，则提示输入密码不正确，重置为等待用户输入。
+ stat 7: 验证密码 - 正确。
	> 如果用户输入的密码与 localStorage 中保存的密码一致，则提示密码正确。

### 2. 技术介绍
+ 使用canvas绘画密码点和连线
+ 使用js原生、面向对象思想完成密码面板的交互控制
+ 使用沙箱模式思想对代码进行封装

+ 思路介绍： 
  - 根据配置计算出n×n个点（以3×3矩阵为例）的位置，存入一个数组，存入数组的顺序的索引是：　
  ``` 
    第一行：1  2  3     
    第二行：4  5  6 　　
    第三行：7  8  9
  ```
 
  - 然后就根据这个坐标数组去绘制九个点（根据canvas大小，动态控制密码点距离及半径）
  
  - 再则我们需要一个保存选中点的数组，每当touchmove事件就判断当前触摸点和那个点的距离小于圆的半径
  
  - 如果为真的话 那么就添加进入选中点的数组
  
  - 在绘制过程中就根据该数据去绘制线条。

### 3. 使用方法
css代码保存在根目录下的`css/gesturePwd-theme.css`下，js代码封装在根目录下的`
js/GesturePwd-core.js`下，将他们引入。
使用示例：


    var canvas = document.getElementById("canvas");
    var pwd = new GesturePwd({
        canvas: canvas, //canvas元素对象
		width：300， //canvas元素的宽度
		height：300，//canvas元素的高度
        matrixOrder: 3, //密码矩阵维数,3,4,5...
        pwdStyle:{ //设置密码面板的样式
                genericStyle:{ //一般样式
                    strokeStyle : "#c8c8c8",
                    fillStyle : '#ffffff',
                    lineWidth : 2
                },
                errorStyle:{ //错误密码样式
                    strokeStyle : "#000000",
                    fillStyle : '#ffa726',
                    lineWidth : 4
                },
                selectStyle:{  //选中密码点样式
                    strokeStyle : "#fa8f09",
                    fillStyle : '#ffa726',
                    lineWidth : 2
                },
                lineStyle:{ //密码连线样式
                    strokeStyle : "#df3134",
                    fillStyle : '',
                    lineWidth : 4
                }
         }
    });
    pwd.init();
其中，参数介绍：

- canvas为必选参数，代表canvas元素对象。
- width,height为必选参数，代表canvas元素的宽度和高度。
- matrixOrder为必选参数，代表密码矩阵维数。
- pwdStyle为可选参数，用户可以自定义样式；若不提供样式，会执行默认样式defaultStyle。

### 4. 代码优点

+ 使用OOP思想、原型继承的方式将代码进行封装，代码逻辑更清晰，易于维护；
+ 使用沙箱模式，代码尽可能不受外界影响；
+ 方法变量注释详细，快速了解代码使用；
+ 命名尽可能顾名思义；
+ 尽可能应用了一些小细节的性能优化方法；

### 5. 效果查看

 * PC端查看[canvas手势密码demo](http://htmlpreview.github.io/?https://github.com/hongweitonghua/frontwork/blob/master/GesturePwdUI/index.html)
 * 手机可扫描以下二维码查看<br>
 ![手势密码二维码](https://github.com/hongweitonghua/frontwork/blob/master/GesturePwdUI/erweima.png "手势密码二维码")
