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
    buttonName: "#copyBtn"
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
    userActions: {
        hotkeys: function (event) {
            console.log(event.which);
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
        //button.innerText = config.startStopText[0];
    } else {
        player.play();
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
}

function sourceChange() {

    let src = document.getElementById('directURL').value;
    if (!(src === "")) {
        player.src(src);
        document.getElementById('copyData').value = src;
    } else
        alert("输入框为空！！！")
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
                } else
                    alert("返回值为空！！！");
            });
        } else
            alert("Error URL!!!");
    } else {
        alert("输入框为空！！！");
    }
}

function fullScreen() {

    //if (player.supportsFullScreen()) {
    if (!player.isFullscreen()) {
        player.requestFullscreen();
    } else {
        player.exitFullscreen();
    }
    // }else{
    //     alert("Full Screen is not Support by your Browser! Try to Change Another!")
    // }
}

function fullWindow() {

    if (!player.isFullWindow) {
        player.enterFullWindow();
    } else {
        player.exitFullWindow();
    }
}

function forwardBackward(keyValue) {

    switch (keyValue) {
        // 方向键左
        case 37:
            player.currentTime(player.currentTime() - config.timeAdjust.backward);
            console.log("Volume: " + player.currentTime());
            break;
        //方向键上
        case 38:
            player.volume(player.volume() + config.timeAdjust.increaseVolume);
            console.log("Volume: " + player.volume());
            break;
        //方向键右
        case 39:
            player.currentTime(player.currentTime() + config.timeAdjust.forward);
            console.log("Volume: " + player.currentTime());
            break;
        //方向键 下
        case 40:
            player.volume(player.volume() - config.timeAdjust.decreaseVolume);
            console.log("Volume: " + player.volume());
            break;
    }
}

function playRate(keyValue) {
    switch (keyValue) {
        case 67:
            if (player.playbackRate() < 12) {
                player.playbackRate(player.playbackRate() + config.Rate.increase);
                console.log("Speed: " + player.playbackRate());
            } else {
                alert("视频播放速度不能高于12！！！");
            }
            break;
        case 88:
            if (player.playbackRate() > 0.1) {
                player.playbackRate(player.playbackRate() - config.Rate.decrease);
                console.log("Speed: " + player.playbackRate());
            } else {
                alert("视频播放速度不能低于0.1！！！")
            }
            break;
        case 90:
            player.playbackRate(config.Rate.default);
            console.log("Speed: " + player.playbackRate());
            break;
        default:
            break;
    }
}