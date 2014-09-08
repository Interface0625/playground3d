var gl;

function tick() {
    requestAnimFrame(tick);
    update();
    draw();
}

var lastTime = 0;
function update() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
        Camera.update(elapsed);
    }
    lastTime = timeNow;
}

function draw() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // DRAW:
    World.draw(gl, Camera);




    // TEXTURE:
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, gContentManager.getImage("@uvgrid1024.jpg"));
    gl.uniform1i(shaderProgram.samplerUniform, 0);
    //for(var i = 0; i < 16; i++){
    Mesh.draw(gl);
    //}


    /*for(var i =0; i< 256; i++){
        Quad2d.draw(Camera);
    }*/
}

function main() {
    var canvas = document.getElementById("canvas");
    makeFullClient(canvas);

    initGL(canvas);
    gContentManager.init(gl);
    //return;


    initShaders(gl);
    
    Camera.init(canvas);

    World.init(gl);
    Quad2d.init(gl);


    gl.clearColor(0.3, 0.3, 0.3, 1.0);
    gl.enable(gl.DEPTH_TEST);

    tick();
}
