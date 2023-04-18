---
title: 数据类型
date: 2023-03-28
category: Rust
top: true
---

# 数据类型
在 Rust 中，每一个值都属于某一个 **数据类型**，这告诉 Rust 它被指定为何种数据，以便明确数据处理方式。
我们将看到两类数据类型子集：标量和复合。

<!--more-->

记住，Rust 是 **静态类型** 语言，也就是说在编译时就必须知道所有变量的类型。根据值及其使用方式，编译器
通常可以推断出我们想要用的类型。当多种类型均有可能时，必须增加类型注解，像这样：

```rust
let guess: u32 = "42".parse().expect("Not a number!");
```

如果不像上面的代码这样添加类型注解 : u32，Rust 会显示如下错误，这说明编译器需要我们提供更多信息，
来了解我们想要的类型：

```rust
error[E0282]: type annotations needed
 --> src/main.rs:2:9
  |
2 |     let guess = "42".parse().expect("Not a number!");
  |         ^^^^^
  |
help: consider giving `guess` an explicit type
  |
2 |     let guess: _ = "42".parse().expect("Not a number!");
  |              +++

For more information about this error, try `rustc --explain E0282`.
error: could not compile `no_type_annotations` due to previous error
```

你会看到其它数据类型的各种类型注解。

## 标量类型

**标量**（scalar）类型代表一个单独的值。Rust 有四种基本的标量类型：整型、浮点型、布尔类型和字符
类型。你可能在其他语言中见过它们。让我们深入了解它们在 Rust 中是如何工作的。

### 整型

**整数** 是一个没有小数部分的数字。我们在第二章使用过 u32 整数类型。该类型声明表明，它关联的值应
该是一个占据 32 比特位的无符号整数（有符号整数类型以 i 开头而不是 u）。表格展示了 Rust 内建
的整数类型。我们可以使用其中的任一个来声明一个整数值的类型。

<table>
<tr><th>长度</th><th>有符号</th><th>无符号</th></tr>
<tr><td> 8-bit </td><td>i8</td><td>u8</td></tr>
<tr><td>16-bit </td><td>i16</td><td>u16</td></tr>
<tr><td>32-bit </td><td>i32</td><td>u32</td></tr>
<tr><td>64-bit </td><td>i64</td><td>u64</td></tr>
<tr><td>128-bit</td><td>i128</td><td>u128</td></tr>
<tr><td>arch</td><td>isize</td><td>usize</td></tr>
</table>

每一个变体都可以是有符号或无符号的，并有一个明确的大小。**有符号** 和 **无符号** 代表数字能否为
负值，换句话说，这个数字是否有可能是负数（有符号数），或者永远为正而不需要符号（无符号数）。这有点
像在纸上书写数字：当需要考虑符号的时候，数字以加号或减号作为前缀；然而，可以安全地假设为正数时，加
号前缀通常省略。有符号数以[补码形式（two’s complement representation）](https://en.wikipedia.org/wiki/Two%27s_complement) 存储。

每一个有符号的变体可以储存包含从 -(2<sup>n - 1</sup>) 到 2<sup>n - 1</sup> - 1 在内的数字
，这里 n 是变体使用的位数。所以 i8 可以储存从 -(2<sup>7</sup>) 到 2<sup>7</sup> - 1 在内的
数字，也就是从 -128 到 127。无符号的变体可以储存从 0 到 2<sup>n</sup> - 1 的数字，所以 u8 
可以储存从 0 到 28 - 1 的数字，也就是从 0 到 255。

另外，isize 和 usize 类型依赖运行程序的计算机架构：64 位架构上它们是 64 位的，32 位架构上它们
是 32 位的。

可以使用表格中的任何一种形式编写数字字面值。请注意可以是多种数字类型的数字字面值允许使用类型后缀，
例如 57u8 来指定类型，同时也允许使用 _ 做为分隔符以方便读数，例如1_000，它的值与你指定的 1000 
相同。

<table>
<tr><th>数字字面值</th><th>例子</th></tr>
<tr><td>Decimal (十进制)</td><td>98_222</td></tr>
<tr><td>Hex (十六进制)</td><td>0xff</td></tr>
<tr><td>Octal (八进制)</td><td>0o77</td></tr>
<tr><td>Binary (二进制)</td><td>0b1111_0000</td></tr>
<tr><td>Byte (单字节字符)(仅限于u8)</td><td>b'A'</td></tr>
</table>
         

### 浮点型

Rust 也有两个原生的 **浮点数**（floating-point numbers）类型，它们是带小数点的数字。Rust 
的浮点数类型是 f32 和 f64，分别占 32 位和 64 位。默认类型是 f64，因为在现代 CPU 中，它与 f32 
速度几乎一样，不过精度更高。所有的浮点型都是有符号的。

这是一个展示浮点数的实例：

```rust
fn main() {
    let x = 2.0; // f64

    let y: f32 = 3.0; // f32
}
```

浮点数采用 **IEEE-754** 标准表示。f32 是单精度浮点数，f64 是双精度浮点数。

## 数值运算

Rust 中的所有数字类型都支持基本数学运算：加法、减法、乘法、除法和取余。整数除法会向下舍入到最接近
的整数。下面的代码展示了如何在 let 语句中使用它们：

```rust
fn main() {
    // addition
    let sum = 5 + 10;

    // subtraction
    let difference = 95.5 - 4.3;

    // multiplication
    let product = 4 * 30;

    // division
    let quotient = 56.7 / 32.2;
    let truncated = -5 / 3; // 结果为 -1

    // remainder
    let remainder = 43 % 5;
}
```

这些语句中的每个表达式使用了一个数学运算符并计算出了一个值，然后绑定给一个变量。

### 布尔型

正如其他大部分编程语言一样，Rust 中的布尔类型有两个可能的值：true 和 false。Rust 中的布尔类型使用 bool 表示。例如：

```rust
fn main() {
    let t = true;

    let f: bool = false; // with explicit type annotation
}
```

使用布尔值的主要场景是条件表达式，例如 if 表达式。

### 字符类型

Rust 的 char 类型是语言中最原生的字母类型。下面是一些声明 char 值的例子：

```rust
fn main() {
    let c = 'z';
    let z: char = 'ℤ'; // with explicit type annotation
    let cat = '猫';
}
```

注意，我们用单引号声明 char 字面量，而与之相反的是，使用双引号声明字符串字面量。Rust 的 char 类
型的大小为四个字节 \(four bytes)，并代表了一个 Unicode 标量值（Unicode Scalar Value），这意
味着它可以比 ASCII 表示更多内容。在 Rust 中，带变音符号的字母（Accented letters），中文、日文
、韩文等字符，emoji（绘文字）以及零长度的空白字符都是有效的 char 值。Unicode 标量值包含从 U+0000 
到 U+D7FF 和 U+E000 到 U+10FFFF 在内的值。不过，“字符” 并不是一个 Unicode 中的概念，所以人直
觉上的 “字符” 可能与 Rust 中的 char 并不符合。

## 复合类型

**复合类型**（Compound types）可以将多个值组合成一个类型。Rust 有两个原生的复合类型：元组
（tuple）和数组（array）。

### 元组类型

元组是一个将多个其他类型的值组合进一个复合类型的主要方式。元组长度固定：一旦声明，其长度不会增大或
缩小。

我们使用包含在圆括号中的逗号分隔的值列表来创建一个元组。元组中的每一个位置都有一个类型，而且这些不
同值的类型也不必是相同的。这个例子中使用了可选的类型注解：

```rust
fn main() {
    let tup: (i32, f64, u8) = (500, 6.4, 1);
}
```

tup 变量绑定到整个元组上，因为元组是一个单独的复合元素。为了从元组中获取单个值，可以使用模式匹配
（pattern matching）来解构（destructure）元组值，像这样：

```rust
fn main() {
    let tup = (500, 6.4, 1);

    let (x, y, z) = tup;

    println!("The value of y is: {y}");
}
```



程序首先创建了一个元组并绑定到 tup 变量上。接着使用了 let 和一个模式将 tup 分成了三个不同的变量，
x、y 和 z。这叫做 解构（destructuring），因为它将一个元组拆成了三个部分。最后，程序打印出了 y 的
值，也就是 6.4。

我们也可以使用点号（.）后跟值的索引来直接访问它们。例如：

```rust
fn main() {
    let x: (i32, f64, u8) = (500, 6.4, 1);

    let five_hundred = x.0;

    let six_point_four = x.1;

    let one = x.2;
}
```

这个程序创建了一个元组，x，然后使用其各自的索引访问元组中的每个元素。跟大多数编程语言一样，元组的
第一个索引值是 0。

不带任何值的元组有个特殊的名称，叫做 单元（unit） 元组。这种值以及对应的类型都写作 ()，表示空值或
空的返回类型。如果表达式不返回任何其他值，则会隐式返回单元值。

### 数组类型

另一个包含多个值的方式是 数组（array）。与元组不同，数组中的每个元素的类型必须相同。Rust 中的数组
与一些其他语言中的数组不同，Rust 中的数组长度是固定的。

我们将数组的值写成在方括号内，用逗号分隔：

```rust
fn main() {
    let a = [1, 2, 3, 4, 5];
}
```

当你想要在栈（stack）而不是在堆（heap）上为数据分配空间，或者是想要确保总是有固定数量的元素时，数组非常有用。但是数组并不如 vector 类型灵活。vector 类型是标准库提供的一个 允许 增长和缩小长度的类似数组的集合类型。当不确定是应该使用数组还是 vector 的时候，那么很可能应该使用 vector。

然而，当你确定元素个数不会改变时，数组会更有用。例如，当你在一个程序中使用月份名字时，你更应趋向于使用数组而不是 vector，因为你确定只会有 12 个元素。

```rust
let months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];
```

可以像这样编写数组的类型：在方括号中包含每个元素的类型，后跟分号，再后跟数组元素的数量。

```rust
let a: [i32; 5] = [1, 2, 3, 4, 5];
```

这里，i32 是每个元素的类型。分号之后，数字 5 表明该数组包含五个元素。

你还可以通过在方括号中指定初始值加分号再加元素个数的方式来创建一个每个元素都为相同值的数组：

```rust
let a = [3; 5];
```

变量名为 a 的数组将包含 5 个元素，这些元素的值最初都将被设置为 3。这种写法与 let a = \[3, 3, 3, 3, 3]; 效果相同，但更简洁。

#### 访问数组元素

数组是可以在栈 (stack) 上分配的已知固定大小的单个内存块。可以使用索引来访问数组的元素，像这样：

```rust
fn main() {
    let a = [1, 2, 3, 4, 5];

    let first = a[0];
    let second = a[1];
}
```

在这个例子中，叫做 first 的变量的值是 1，因为它是数组索引 \[0] 的值。变量 second 将会是数组索引 \[1] 的值 2。

#### 无效的数组元素访问

让我们看看如果我们访问数组结尾之后的元素会发生什么呢？比如你执行以下代码，从用户那里获取数组索引：

```rust
use std::io;

fn main() {
    let a = [1, 2, 3, 4, 5];

    println!("Please enter an array index.");

    let mut index = String::new();

    io::stdin()
        .read_line(&mut index)
        .expect("Failed to read line");

    let index: usize = index
        .trim()
        .parse()
        .expect("Index entered was not a number");

    let element = a[index];

    println!("The value of the element at index {index} is: {element}");
}
```

此代码编译成功。如果您使用 cargo run 运行此代码并输入 0、1、2、3 或 4，程序将在数组中的索引处打印出相应的值。如果你输入一个超过数组末端的数字，如 10，你会看到这样的输出：

```plain
thread 'main' panicked at 'index out of bounds: the len is 5 but the index is 10', src/main.rs:19:19
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

程序在索引操作中使用一个无效的值时导致 运行时 错误。程序带着错误信息退出，并且没有执行最后的 println! 语句。当尝试用索引访问一个元素时，Rust 会检查指定的索引是否小于数组的长度。如果索引超出了数组长度，Rust 会 panic，这是 Rust 术语，它用于程序因为错误而退出的情况。这种检查必须在运行时进行，特别是在这种情况下，因为编译器不可能知道用户在以后运行代码时将输入什么值。

这可能是第一个在实战中遇到的 Rust 安全原则的例子。在很多底层语言中，并没有进行这类检查，这样当提供了一个不正确的索引时，就会访问无效的内存。通过立即退出而不是允许内存访问并继续执行，Rust 让你避开此类错误。