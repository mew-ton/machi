# machi-api

## Introduction

web API サーバを起動します。

## Start up

### 事前にインストールするもの

#### Deno

javascriptのランタイムとして利用します.

see: <https://github.com/denoland/deno>

#### Docker, docker-compose

DBサーバのイメージ用に利用します.

see: <https://www.docker.com>, <https://docs.docker.jp/compose/install.html>

### 実行方法

#### Web API サーバ開始

##### 1. Docker イメージを立ち上げます

```sh
cd machi-docker
docker-compose up
```

##### 2. Deno を実行します

```sh
cd machi-api
deno run --allow-net --allow-read --config ../tsconfig.json app.ts
```

#### Test 実行

???
