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

1. Docker イメージを立ち上げます

```sh
cd machi-docker
docker-compose up
```

2. Deno を実行します

```sh
cd machi-api
deno run --allow-net --allow-read --config ../tsconfig.json app.ts
```

#### Test 実行

1. 事前に Dockerイメージと、 Denoを別プロセスで実行させておきます

2. Deno test を実行します

```sh
cd machi-api
deno test --allow-net --allow-env --config ../tsconfig.json
```

## API

### ユーザ検索

#### ユーザ全件取得

```plain
[GET] /api/v1/users
```

#### 名前, メールアドレスで検索

```plain
[GET] /api/v1/users?name=hoge

[GET] /api/v1/users?email=example.com
```

#### レスポンス

```json
{
    "size": 3,
    "list": [
        {
            "id": "mock-001",
            "name": "小山詩乃",
            "email": "shino1969@example.com",
            "password": "tvXdV5AQEs",
            "birthday": "1969-01-31",
            "gender": "female",
            "phoneNumber": "0737-04-2862",
            "address": {
                "prefecture": "和歌山県",
                "postalCode": "640-8101",
                "address": "和歌山市新雑賀町3-9"
            }
        },
        {
            "id": "mock-002",
            "name": "松永光一",
            "email": "lightone@example.com",
            "password": "qdz3aRwxFF",
            "birthday": "1970-05-24",
            "gender": "male",
            "phoneNumber": "055-872-8780",
            "address": {
                "prefecture": "山梨県",
                "postalCode": "400-0111",
                "address": "甲斐市竜王新町3-8-11"
            }
        },
        {
            "id": "mock-003",
            "name": "横山亨治",
            "email": "yokoyama003@example.com",
            "password": "9gqAXExTKy",
            "birthday": "1973-01-20",
            "gender": "male",
            "phoneNumber": "099-845-0649",
            "address": {
                "prefecture": "鹿児島県",
                "postalCode": "894-2601",
                "address": "大島郡瀬戸内町与路2-15与路タワー418"
            }
        }
    ]
}
```

### ユーザ取得 (idで検索)

#### 指定IDのユーザを取得

```plain
[GET] /api/v1/user/:id
```

#### レスポンス

```json
{
    "id": "mock-001",
    "name": "小松詩乃",
    "email": "shino1969@example.com",
    "password": "tvXdV5AQEs",
    "birthday": "1969-01-31",
    "gender": "female",
    "phoneNumber": "0737-04-2862",
    "address": {
        "prefecture": "和歌山県",
        "postalCode": "640-8101",
        "address": "和歌山市新雑賀町3-9"
    }
}
```

### ユーザ登録 / 上書き

#### ユーザ新規作成

```plain
[POST] /api/v1/user
```

#### ユーザ更新

```plain
[PUT] /api/v1/user/:id
```

#### リクエストボディ

```json
{
    "id": "mock-001",
    "name": "小松詩乃",
    "email": "shino1969@example.com",
    "password": "tvXdV5AQEs",
    "birthday": "1969/01/31",
    "gender": "female",
    "phoneNumber": "0737-04-2862",
    "address": {
        "prefecture": "和歌山県",
        "postalCode": "640-8101",
        "address": "和歌山市新雑賀町3-9"
    }
}
```

#### レスポンス

保存後のユーザデータが取得されます

#### レスポンスエラー

put/postしようとしたデータに不正がある場合は、下記のようにエラー内容が示されます.

```json
{
    "body": {
        "name": "nya-",
        "email": "xxx@yyy.com",
        "password": "123456abcde",
        "birtyday": "1992/02/01",
        "gender": "not applicable",
        "phoneNumber": "0120-333-333",
        "address": {
            "prefecture": "宮城県",
            "postalCode": "123-4567",
            "address": "●●市●●区XXXX"
        },
        "id": "mock-001"
    },
    "errors": [
        {
            "target": {
                "name": "nya-",
                "email": "xxx@yyy.com",
                "password": "123456abcde",
                "birtyday": "1992/02/01",
                "gender": "not applicable",
                "phoneNumber": "0120-333-333",
                "address": {
                    "prefecture": "宮城県",
                    "postalCode": "123-4567",
                    "address": "●●市●●区XXXX"
                }
            },
            "property": "id",
            "children": [],
            "constraints": {
                "isNotEmpty": "IDを入力してください",
                "isString": "IDはstringで指定してください"
            }
        }
    ]
}
```

### ユーザ削除

#### 指定ユーザの削除

```plain
[DELETE] /api/v1/user/:id
```

成功、失敗に限らず、204が返ります
