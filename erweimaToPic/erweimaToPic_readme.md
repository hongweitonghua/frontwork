
示例：

```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>根据url生成二维码图片</title>
</head>

<body>
    <div id="qrcode"></div>
	//引入qrcode.js库
    <script src="./qrcodejs-master/qrcode.js"></script>
	//使用方法一： 直接生成，默认宽高256*256
    <!-- <script type="text/javascript">
        new QRCode(document.getElementById("qrcode"), "http://baidu.com");
    </script> -->
    
	//使用方法二: 设置二维码生成参数
    <script>
        // 设置参数方式
        var qrcode = new QRCode('qrcode', {
            text: 'your content',
            width: 128,
            height: 128,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });

        // 使用 API
        qrcode.clear();
        qrcode.makeCode('http://baidu.com');
    </script>
</body>

</html>
```


参考链接：
[在线演示地址] ( http://code.ciaoca.com/javascript/qrcode/demo/)
[中文文档] (http://code.ciaoca.com/javascript/qrcode/)
[github地址] ：(https://github.com/davidshimjs/qrcodejs)
