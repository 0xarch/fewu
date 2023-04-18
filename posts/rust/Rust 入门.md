---
title: Rust 入门
date: 2023-03-11
category: Rust
top: false
---
**Rust**,一门赋予每个人构建可靠且高效软件能力的语言。

Rust拥有惊人的速度，内存安全性和线程安全性，以及出色的文档。

本文将简要介绍如何搭建一个Rust开发环境以及cargo包管理。

<!--more-->

[Rust程序设计语言官方中文网站](https://www.rust-lang.org/zh-CN/)

## Rustup
Rustup是Rust安装器和版本管理工具。

安装 Rust 的主要方式是通过 Rustup 这一工具，它既是一个 Rust 安装器又是一个版本管理工具。

对于 macOS、BSD及Linux或其他类Unix系统，可以在终端中运行以下命令：
```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
Rust 的升级非常频繁。如果您安装 Rustup 后已有一段时间，那么很可能您的 Rust 版本已经过时了。运行
```sh
rustup update
```
获取最新版本的 Rust。

## Cargo
Cargo是Rust的构建工具和包管理器。

您在安装 Rustup 时，也会安装 Rust 构建工具和包管理器的最新稳定版，即 Cargo。

Cargo 可以做很多事情：

构建项目
```sh
cargo build
```
运行项目
```sh
cargo run
``` 
测试项目
```sh
cargo test
```
为项目构建文档
```sh
cargo doc
``` 
将库发布到 [crates.io](https://crates.io)
```sh
cargo publish
```

要检查您是否安装了 Rust 和 Cargo，可以在终端中运行：
```
cargo --version
```

阅读 [Cargo手册](https://doc.rust-lang.org/cargo/index.html) 了解更多。