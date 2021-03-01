# 1 JSR269

[参考]

> 1. https://www.cnblogs.com/throwable/p/9139908.html



## 1.1 简介

插件化注解处理（Pluggable Annotation Processing）API（JSR269）提供一套标准API来在编译期间处理Annotations（JSR175），实际上JSR269不仅仅用来处理Annotation，更强大的功能是它建立了Java语言本身的一个模型，它把method、package、constructor、type、variable、enum、annotation等Java语言元素映射为Types和Elements，从而将Java语言的语义映射成为对象，我们可以在javax.lang.model包下面看到这些类。

JSR 269用Annotation Processor在编译期间，而不是运行期间处理Annotation，Annotation Processor相当于编译器的一个插件，所以称为插件化注解处理。

如果Annotation Processor处理Annotation时（执行process方法）产生了新的Java代码，编译器会再调用一次Annotation Processor，直到没有新代码产生为止。每执行一次process()方法被称为一个“round”，这样整个Annotation Processing过程可看作是一个round的序列。

Pluggable Annotation Processing API的核心是Annotation Processor，即注解处理器，一般需要继承抽象类`javax.annotation.processing.AbstractProcessor`。注意，与运行时注解`RetentionPolicy.RUNTIME`不同，注解处理器只会处理编译器注解，也就是`RetentionPolicy.SOURCE`的注解类型，处理的阶段位于Java代码编译期间。



## 1.2 使用步骤

插件化注解处理API的使用步骤大致如下：

- 自定义一个Annotation Processor，需要继承`javax.annotation.processing.AbstractProcessor`，并覆写process()方法。
- 自定义一个注解，注解的元注解需要指定`@Retention(RetentionPolicy.SOURCE)`
- 需要在声明的自定义Annotation Processor中使用`javax.annotation.processing.SupportedAnnotationTypes`指定在第2步创建的注解类型的名称。[注意：需要全类名]
- 需要在声明的自定义Annotation Processor中使用`javax.annotation.processing.SupportedSourceVersion`指定编译版本。
- 可选操作，可以通过在声明的自定义Annotation Processor中使用`javax.annotation.processing.SupportedOptions`指定编译参数。



## 1.3 示例

### 1.3.1 自定义注解

```java
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.SOURCE)
public @interface MyAnnotation {
}
```

### 1.3.2 自定义注解处理器

```java
@SupportedAnnotationTypes(
    value = {"com.chenming.jsr269.annotations.MyAnnotation"}
)
public class MyAnnotationProcessor extends AbstractProcessor {
    @Override
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
        System.out.println("##### MyAnnotationProcessor...process()... START #####");

        System.out.println("111");
        annotations.forEach(System.out::println);
        System.out.println("222");

        System.out.println("##### MyAnnotationProcessor...process()... ENDED #####");

        System.out.println("333");
        return true;
    }
}
```

### 1.3.3 测试

````java
public class App {
    public static void main(String[] args) {
    }

    @MyAnnotation
    public void test2(){
    }
}
````

因为JSR269是编译时规格，所以这里方法里面不需要写实现，因为不会运行。

### 1.3.4 编译

#### 1.3.4.1 首先编译`注解处理器`

```shell
javac com/chenming/jsr269/processors/MyAnnotationProcessor.java
```

#### 1.3.4.2 编译主方法

```shell
javac -processor com.chenming.jsr269.processors.MyAnnotationProcessor com/chenming/jsr269/App.java
```

这里我们用 -processor 指定注解处理器

#### 1.3.4.3 编译结果

```shell
##### MyAnnotationProcessor...process()... START #####
111
com.chenming.jsr269.annotations.MyAnnotation
222
##### MyAnnotationProcessor...process()... ENDED #####
333
##### MyAnnotationProcessor...process()... START #####
111
222
##### MyAnnotationProcessor...process()... ENDED #####
333
```









