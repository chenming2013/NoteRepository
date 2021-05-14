## Maven仓库的分类

1. 本地仓库：
2. 远程仓库：
   1. 中央仓库：
   2. 中央仓库镜像，也就是中央仓库的备份；
   3. 私服；

Jar包寻找路径：本地仓路 --> 私服 --> 中央仓库镜像 --> 中央仓库





## Maven常用设置

```xml
<properties>
	<!-- maven构建使用编码,编码中文乱码 -->
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    
    <!-- 编译代码使用的JDK版本 -->
    <maven.compile.source>1.8</maven.compile.source>
    
    <!-- 运行程序使用的JDK版本 -->
    <maven.compile.target>1.8</maven.compile.target>
</properties>
```





