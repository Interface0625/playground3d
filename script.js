var gl;

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}


function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}


var shaderProgram;

function initShaders() {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
}


function handleLoadedTexture(texture) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.bindTexture(gl.TEXTURE_2D, null);
}


var crateTexture;

function initTexture() {
    crateTexture = gl.createTexture();
    crateTexture.image = new Image();
    crateTexture.image.onload = function () {
        handleLoadedTexture(crateTexture)
    }

    crateTexture.image.src = "crate.gif";
}


var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

function mvPushMatrix() {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length == 0) { throw "Invalid popMatrix!"; }
    mvMatrix = mvMatrixStack.pop();
}


function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}


function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

var currentlyPressedKeys = {};
function handleKeyDown(event) { currentlyPressedKeys[event.keyCode] = true; }
function handleKeyUp(event) { currentlyPressedKeys[event.keyCode] = false; }


var pitch = 0;
var pitchRate = 0;

var yaw = 0;
var yawRate = 0;

var xPos = 0;
var yPos = 0.4;
var zPos = 0;

var speed = 0;
var strafe = 0;

function handleKeys() {
    /*
    if (currentlyPressedKeys[38]) {
        // Page Up
        pitchRate = 0.041;
    } else if (currentlyPressedKeys[40]) {
        // Page Down
        pitchRate = -0.041;
    } else {
        pitchRate = 0;
    }

    if (currentlyPressedKeys[37]) {
        // Left cursor key or A
        yawRate = 0.1;
    } else if (currentlyPressedKeys[39]) {
        // Right cursor key or D
        yawRate = -0.1;
    } else {
        yawRate = 0;
    }
    */
    if(currentlyPressedKeys[65]){
        // A
        strafe = 0.003;
    }else if(currentlyPressedKeys[68]){
        // D
        strafe = -0.003;
    }else{
        strafe = 0;
    }

    if (currentlyPressedKeys[87]) {
        // Up cursor key or W
        speed = 0.003;
    } else if (currentlyPressedKeys[83]) {
        // Down cursor key
        speed = -0.003;
    } else {
        speed = 0;
    }

}


var worldVertexPositionBuffer = null;
var worldVertexTextureCoordBuffer = null;

function handleLoadedWorld(data) {
    var lines = data.split("\n");
    var vertexCount = 0;
    var vertexPositions = [];
    var vertexTextureCoords = [];
    for (var i in lines) {
        var vals = lines[i].replace(/^\s+/, "").split(/\s+/);
        if (vals.length == 5 && vals[0] != "//") {
            // It is a line describing a vertex; get X, Y and Z first
            vertexPositions.push(parseFloat(vals[0]));
            vertexPositions.push(parseFloat(vals[1]));
            vertexPositions.push(parseFloat(vals[2]));

            // And then the texture coords
            vertexTextureCoords.push(parseFloat(vals[3]));
            vertexTextureCoords.push(parseFloat(vals[4]));

            vertexCount += 1;
        }
    }

    worldVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.STATIC_DRAW);
    worldVertexPositionBuffer.itemSize = 3;
    worldVertexPositionBuffer.numItems = vertexCount;

    worldVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexTextureCoords), gl.STATIC_DRAW);
    worldVertexTextureCoordBuffer.itemSize = 2;
    worldVertexTextureCoordBuffer.numItems = vertexCount;
}


function loadWorld() {
    var request = new XMLHttpRequest();
    request.open("GET", "world.txt");
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            handleLoadedWorld(request.responseText);
        }
    }
    request.send();
}



function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (worldVertexTextureCoordBuffer == null || worldVertexPositionBuffer == null) {
        return;
    }

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);

    mat4.rotate(mvMatrix, degToRad(-pitch), [1, 0, 0]);
    mat4.rotate(mvMatrix, degToRad(-yaw), [0, 1, 0]);
    mat4.translate(mvMatrix, [-xPos, -yPos, -zPos]);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, crateTexture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, worldVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, worldVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, worldVertexPositionBuffer.numItems);
}


var lastTime = 0;
// Used to make us "jog" up and down as we move forward.
var joggingAngle = 0;

function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        if (speed != 0 || strafe != 0) {
            xPos -= Math.sin(degToRad(yaw)) * speed * elapsed;
            zPos -= Math.cos(degToRad(yaw)) * speed * elapsed;

            xPos -= Math.sin(degToRad(yaw+90)) * strafe * elapsed;
            zPos -= Math.cos(degToRad(yaw+90)) * strafe * elapsed;

            joggingAngle += elapsed * 0.6; // 0.6 "fiddle factor" - makes it feel more realistic :-)
            yPos = Math.sin(degToRad(joggingAngle)) / 20 + 0.4
        }

        yaw += yawRate * elapsed; yawRate=0;
        pitch += pitchRate * elapsed; pitchRate=0;

    }
    lastTime = timeNow;
}


function tick() {
    requestAnimFrame(tick);
    handleKeys();
    drawScene();
    animate();
}

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

function makeFullClient(e){
    e.style.position = "fixed";
    e.style.top = 0 + "px";
    e.style.left = 0 + "px";
    e.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    e.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);    
}



var moveCallback = function(e){
    var X = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
    var Y = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
    console.log(X)
    if(Y != 0){ pitchRate = 0.026 * Y * -1;}else{pitchRate=0;}
    if(X != 0){ yawRate = 0.031 * X * -1;}else{yawRate=0;}
};

var captureMouse = function(element){

    // http://www.html5rocks.com/en/tutorials/pointerlock/intro/

    element.addEventListener('click', function(){

        var havePointerLock =   'pointerLockElement' in document ||
                                'mozPointerLockElement' in document ||
                                'webkitPointerLockElement' in document;
        element.requestPointerLock = element.requestPointerLock ||
                                     element.mozRequestPointerLock ||
                                     element.webkitRequestPointerLock;
        element.requestPointerLock();

        element.addEventListener("mousemove", moveCallback, false);

    }, false);

};



function main() {
    var canvas = document.getElementById("canvas");
    makeFullClient(canvas);
    captureMouse(canvas);

 

    initGL(canvas);
    initShaders();
    initTexture();
    loadWorld();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    tick();
}
