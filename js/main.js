window.onload = function() {
    'use strict';

    // getUserMedia非対応チェック
    if (navigator.mediaDevices.getUserMedia === undefined || navigator.mediaDevices.enumerateDevices === undefined) {
        console.error('getUserMedia is not supported by the browser.');
        return;
    }

    // 接続されているカメラとマイクのMediaStreamオブジェクトを取得する
    navigator.mediaDevices.enumerateDevices().then(function(sourcesInfo) {
      // 取得できたカメラとマイクを含むデバイスからカメラだけをフィルターする
      var videoSroucesArray = sourcesInfo.filter(function(elem) {
          return elem.kind == 'videoinput';
      });
      render(videoSroucesArray);
    });

    /**
     * カメラを選択するセレクトボックスを組み立てる
     */
    function render(videoSroucesArray) {
        var $selectBox = document.querySelector('#select')
        videoSroucesArray.forEach(function(source, idx) {
            var label = source.label !== "" ? source.label : ("カメラ" + idx);
            $selectBox.insertAdjacentHTML("beforeend", "<option value='" + source.deviceId + "'>" + label + "</option>");
        });
        return this;
    }

    var currentStream;
    /**
     * カメラの再生を開始する
     */
    function start(e) {
        // 既にカメラと接続していたら停止
        if (currentStream) {
            currentStream.getVideoTracks().forEach(function(devise) {
                devise.stop();
            });
            currentStream = null;
        }

        if (e.target.value === "") {
            return;
        }

        var constraints = {
            video: {
                optional: [{
                    sourceId: e.target.value
                }]
            }
        };
        // Video と Audioのキャプチャを開始
        navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
            currentStream = stream; // カメラを切り替えた時に停止するため格納
            var $video = document.querySelector('#video');
            $video.src = window.URL.createObjectURL(stream);
            $video.play(); // firefox用
        }, function() {
            console.log("error:" + arguments);
        })
    }

    var selectBox = document.querySelector('#select');
    selectBox.addEventListener('change', start, false);

    function download() {
        var cEle = document.createElement('canvas');
        var cCtx = cEle.getContext('2d');
        var vEle = document.querySelector('#video');

        cEle.width = vEle.videoWidth; // canvasの幅と高さを、動画の幅と高さに合わせる
        cEle.height = vEle.videoHeight;

        cCtx.drawImage(vEle, 0, 0); // canvasに関数実行時の動画のフレームを描画
        var aTag = document.createElement('a');
        aTag.setAttribute('href', cEle.toDataURL());
        aTag.setAttribute('download', "video.png");
        aTag.click(); // Firefoxでは動かない
    }

    var video = document.querySelector('#video');
    video.addEventListener('click', download, false);
};
