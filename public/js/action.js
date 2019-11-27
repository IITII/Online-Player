// some use or useless variable
const config = {
    playerId: "onlinePlayer",
    startStopId: "startStop",
    startStopText: ["Start", "Stop"],
    loopId: "loop",
    loopText: ["Loop: true", "Loop: false"]
};
// toolTip
$(document).ready(function () {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })
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
                default:
                    break;
            }
        }
    }
});

// key functions
function startStop() {
    let player = videojs.getPlayer(config.playerId);
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
    let player = videojs.getPlayer(config.playerId);
    if (player.loop()) {
        player.loop(false);
        // document.getElementById(config.loopId).innerText = config.loopText[0];
    } else {
        player.loop(true);
        // document.getElementById(config.loopId).innerText = config.loopText[1];
    }
}

function sourceChange() {
    let player = videojs.getPlayer(config.playerId);
    let src = document.getElementById('directURL').value;
    if (!(src === ""))
        player.src(src);
    else
        alert("输入框为空！！！")
}

function movieChange() {
    let player = videojs.getPlayer(config.playerId);
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
    }else{
        alert("输入框为空！！！");
    }
}