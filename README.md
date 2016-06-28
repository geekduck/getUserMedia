## getUserMediaサンプル

getUserMediaを使用してカメラからの映像を表示しつつ、任意のタイミングで画像として保存する

chromeでのみ動作を確認

http://geekduck.github.io/getUserMedia/

### getUserMediaのハマりポイント

* (少なくともChromeは)localhostか、https接続でしか使えない

  https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-powerful-features-on-insecure-origins

* 幾つかのAPIが非推奨から廃止になった

  https://developers.google.com/web/updates/2015/07/mediastream-deprecations
