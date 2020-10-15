# machi

## 概要

[秘匿]の技術採用課題として提出する用のWeb APIです

## 実行方法

machi-api/README.md を参照してください

## サブプロジェクトについて

### machi-api

web api 実行用, 各種APIを実装する。

#### 所感 (machi-api)

個人的に、machi-openapiとうまく連携して、openapiを書いたらmachi-apiの内部が自動で生成されればいいと思っていたが、

これができる `openapi-generator` がなく、泣く泣くそれぞれを実装する方針に変更した。(これだけで４日くらいかかった)

なお、machi-apiが採用しているフレームワーク `alosaur` は、apiの定義と共に、openapiの出力も一部だけサポートしている。
現時点では定義されたAPIのみ出力されるが、将来的にはデータモデル等も対応予定とのこと。

typescript側で設計したら openapiが自動で作られるような処理の流れになるので、結果的に良しとしている。

### machi-api-test

WIP

### machi-docker

DB等のDockerイメージの定義をまとめる

#### 所感 (machi-docker)

できれば、machi-apiの実行もdocker image化できればよかったと思っている.

### machi-model

DBに保存する / リクエスト・レスポンスされるそれぞれのデータのモデルを定義する。

#### 所感 (machi-model)

class-transformer, class-validator, typeormがカッチリハマっているのがとても気持ちいい。

- class-transformer .. リクエストされたデータjson をクラスのインスタンスにしてくれる
- class-validator .. クラスのパラメータそれぞれのデコレータで、Validationを定義できる。transformされたリクエストデータをまるごとバリデーションする用に利用している
- typeorm .. DBのテーブルの列の定義用に利用している。class-validatorを通ったインスタンスをそのまま突っ込んだら、postgresに書き込まれる

### machi-openapi

OpenApi (v3) 用。APIドキュメントの出力等に利用する。

できれば、openapiを記述したら、web api の枠組みが自動生成されるような流れで開発がしたかった。

### machi-service

machi-apiで利用するためのDIコンテナ郡を定義する。

## 技術選定に関するメモ

### Typescript

個人的に慣れ親しんでいるTypescriptを採用しました。

一番好きにも関わらず、ここ１年弱触れなかったリハビリと、フラストレーション解消も兼ねています。

### OpenAPI

コーディングの際には https://osbecu.stoplight.io を採用。
わかりやすくAPI・モデル設計ができる点でとてもよかったです。

OpenAPIを記述したらコードが自動生成されるのは知っていましたが、
denoのweb API用のgeneratorは存在しない事が判明したため、書くのは２重メンテになってしまい、失敗だったと反省しています。

しかし、machi-apiで採用しているalosaurが、コードからopenAPIを生成する機能をサポートしようとしているため、
長い目で見れば悪くない選択ではあったかと。

### Deno

「nodeの作者が反省点を活かして作った」という話で、前々から気になっていました。
使用できるライブラリが少ない現状ではあるものの、今回のような簡単なWebAPIを作るのには十分な規模であると判断し、
個人的興味を主な理由として採用しました。

### Alosaur, class-validator, class-transformer

Denoできれいに書けそうなフレームワークとして、Alosaurを選定しました。
現状 Deno-awesomeで紹介されているライブラリとして、デコレータを使っているのはこれくらいしかありませんでした。
(見つからなかっただけかもしれませんが)

Deno のライブラリというと、Denoがそもそも出て間もないこともあってか、バージョンが1に満たない開発中が多く見られる状態でしたが、その中でも多機能さが目に止まったことも理由の一つ。

残りの `class-validator` `class-transformer` はサンプルから採用。

### typeorm

DBの構成をsql文に書き起こすのが手間だったので採用。(SQL文はほとんど書いたことがないため、、)

class-validatorと同時に定義できるので、とても気持ち良い。
