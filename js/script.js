var gl;

var lastTime = 0;
function tick() {
    requestAnimFrame(tick);
    var timeNow = new Date().getTime();
    var elapsed = timeNow - lastTime;
    if (lastTime != 0) {
        update(timeNow, elapsed);
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        draw(timeNow, elapsed);
    }
    lastTime = timeNow;
}

function update(timeNow, elapsed) {
    Camera.update(elapsed);
}

function draw(timeNow, elapsed) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    World.draw(gl, Camera);
    Mesh.draw(gl);
}

function main() {
    var canvas = document.getElementById("canvas");
    initGL(canvas);
    gContentManager.init(gl);

    initShaders(gl);
    
    Camera.init(canvas);

    World.init(gl);

    tick();
}
