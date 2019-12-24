// some use or useless variable
const config = {
    playerId: "onlinePlayer",
    startStopId: "startStop",
    startStopText: ["Start", "Stop"],
    loopId: "loop",
    loopText: ["Loop: true", "Loop: false"],
    timeAdjust: {
        forward: 5,
        backward: 5,
        increaseVolume: 0.1,
        decreaseVolume: 0.1,
    },
    Rate: {
        increase: 0.05,
        decrease: 0.05,
        default: 1
    },
    buttonName: "#copyBtn",
    msg: {
        play: "Player",
        loop: "Loop",
        media: "Media",
        screen: "Screen",
        window: "Windows",
        success: "Success!!!",
        time: "Time",
        volume: "Volume",
        playBackRate: "Speed"
    }
};
// Toast options
// toastr.info();
// toastr.warning();
// toastr.success();
// toastr.error();
toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": true,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "500",
    "timeOut": "1000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};
// toolTip
$(document).ready(function () {
    // Load ToolTip
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });
    // Load Clipboard Event
    new ClipboardJS(config.buttonName);
    // true for increase volume
    // false for decrease volume
    document.addEventListener('mousewheel', function (event) {
        //console.log( event.wheelDelta > 0 )
        if (player.isFullscreen() || player.isFullWindow) {
            event.wheelDelta > 0 ? forwardBackward(38)
                : forwardBackward(40);
        }
    }, false);
});
// load player
window.onload = videojs('onlinePlayer', {
    responsive: true,
    liveui: true,
    controls: true,
    controlBar: {
        'pictureInPictureToggle': true
    },
    userActions: {
        hotkeys: function (event) {
            //console.log(event.which);
            switch (event.which) {
                case 32:
                    //空格控制暂停开始
                    startStop();
                    break;
                case 76:
                    // L 键控制是否循环播放
                    loopPlayer();
                    break;
                case 13:
                    // Enter 控制全屏
                    fullScreen();
                    break;
                case 16:
                    // Shift 控制浏览器全屏
                    fullWindow();
                    break;
                default:
                    //方向键监听
                    forwardBackward(event.which);
                    //播放速度控制
                    playRate(event.which);
                    pictureInPicture(event.which);
                    break;
            }
        }
    }
});

//注册 player
const player = videojs.getPlayer(config.playerId);

// key functions
function startStop() {

    //let button = document.getElementById(config.startStopId);
    if (!player.paused()) {
        player.pause();
        toastr.info("Paused!!!", config.msg.play);
        //button.innerText = config.startStopText[0];
    } else {
        player.play();
        toastr.success("Started!!!", config.msg.play);
        //button.innerText = config.startStopText[1];
    }
}

function loopPlayer() {

    if (player.loop()) {
        player.loop(false);
        // document.getElementById(config.loopId).innerText = config.loopText[0];
    } else {
        player.loop(true);
        // document.getElementById(config.loopId).innerText = config.loopText[1];
    }
    toastr.info("Loop: " + player.loop(), config.msg.loop);
}

function sourceChange() {

    let src = document.getElementById('directURL').value;
    if (!(src === "")) {
        player.src(src);
        document.getElementById('copyData').value = src;
        toastr.success("Source change successful!!! Enjoy yourself!!!", config.msg.media)
    } else
        toastr.error("Input is blank！！！", config.msg.media);
}

function movieChange() {

    let url = document.getElementById('URL').value;
    if (!(url === "")) {
        let Url = new URL(url);
        if (Url.searchParams.has('MovieID')) {
            let movieId = Url.searchParams.get('MovieID');
            jQuery.post("/", {"MovieID": movieId}, (data) => {
                //console.log(data);
                if (!(data === "")) {
                    player.src(data);
                    document.getElementById('copyData').value = data;
                    toastr.success("Source change successful!!! Enjoy yourself!!!", config.msg.media);
                } else
                    toastr.warning("返回值为空！！！", config.msg.media);
            })
                .error(function () {
                    toastr.error("Return Error!!!", config.msg.media);
                })
        } else
            toastr.error("Error URL!!!", config.msg.media);
    } else {
        toastr.error("Input is blank！！！", config.msg.media);
    }
}

function fullScreen() {

    //if (player.supportsFullScreen()) {
    if (!player.isFullscreen()) {
        player.requestFullscreen();
        toastr.success("Enter FullScreen!!!", config.msg.screen);
    } else {
        player.exitFullscreen();
        toastr.info("Exit FullScreen!!!", config.msg.screen);
    }
    // }else{
    //     alert("Full Screen is not Support by your Browser! Try to Change Another!")
    // }
}

function fullWindow() {

    if (!player.isFullWindow) {
        player.enterFullWindow();
        toastr.success("Enter FullWindow!!!", config.msg.window);
    } else {
        player.exitFullWindow();
        toastr.info("Exit FullWindow!!!", config.msg.window);
    }
}

function forwardBackward(keyValue) {

    switch (keyValue) {
        // 方向键左
        case 37:
            player.currentTime(player.currentTime() - config.timeAdjust.backward);
            //console.log("Time: " + player.currentTime());
            toastr.info("Backward " + config.timeAdjust.backward + " s...", config.msg.time);
            break;
        //方向键上
        case 38:
            player.volume(player.volume() + config.timeAdjust.increaseVolume);
            //console.log("Volume: " + player.volume());
            toastr.info("Current volume: " + player.volume().toFixed(2) * 100 + "%", config.msg.volume);
            break;
        //方向键右
        case 39:
            player.currentTime(player.currentTime() + config.timeAdjust.forward);
            //console.log("Time: " + player.currentTime());
            toastr.info("Forward " + config.timeAdjust.forward + " s...", config.msg.time);
            break;
        //方向键 下
        case 40:
            player.volume(player.volume() - config.timeAdjust.decreaseVolume);
            //console.log("Volume: " + player.volume());
            toastr.info("Current volume: " + player.volume().toFixed(2) * 100 + "%", config.msg.volume);
            break;
    }
}

function playRate(keyValue) {
    switch (keyValue) {
        case 67:
            if (player.playbackRate() < 12) {
                player.playbackRate(player.playbackRate() + config.Rate.increase);
                //console.log("Speed: " + player.playbackRate());
                toastr.info("Current speed: " + player.playbackRate().toFixed(2) + "x...", config.msg.playBackRate);
            } else {
                toastr.warning("视频播放速度不能高于12x！！！", config.msg.playBackRate);
            }
            break;
        case 88:
            if (player.playbackRate() > 0.1) {
                player.playbackRate(player.playbackRate() - config.Rate.decrease);
                //console.log("Speed: " + player.playbackRate());
                toastr.info("Current speed: " + player.playbackRate().toFixed(2) + "x...", config.msg.playBackRate);
            } else {
                toastr.warning("视频播放速度不能低于0.1x！！！", config.msg.playBackRate);
            }
            break;
        case 90:
            player.playbackRate(config.Rate.default);
            //console.log("Speed: " + player.playbackRate());
            toastr.info("Reset to normal speed: " + player.playbackRate().toFixed(2) + "x...", config.msg.playBackRate);
            break;
        default:
            break;
    }
}

function pictureInPicture(keyValue) {
    if (document.pictureInPictureEnabled) {
        switch (keyValue) {
            case 80:
                document.getElementById(config.playerId + "_html5_api").requestPictureInPicture();
                toastr.success("Enter PictureInPicture Successful!!!", config.msg.play);
                break;
            // case 80:
            //     document.exitPictureInPicture();
            //     break;
            default:
                break;
        }
    } else {
        toastr.error("Current Browser isn't support PictureInPicture!!!", config.msg.play);
    }
}