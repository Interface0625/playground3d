function makeFullScreen(e){
    if (e.requestFullscreen) {
        e.requestFullscreen();
    } else if (e.msRequestFullscreen) {
        e.msRequestFullscreen();
    } else if (e.mozRequestFullScreen) {
        e.mozRequestFullScreen();
    } else if (e.webkitRequestFullscreen) {
        e.webkitRequestFullscreen();
    }
    e.width = window.screen.width;
    e.height = window.screen.height;
}