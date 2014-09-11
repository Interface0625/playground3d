// shaders


var shader_fs_src = "";
shader_fs_src += "precision mediump float;\n";
shader_fs_src += "varying vec2 vTextureCoord;\n";
shader_fs_src += "uniform sampler2D uSampler;\n";
shader_fs_src += "void main(void) {\n";
shader_fs_src += "  gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));";
shader_fs_src += "}";

var shader_vs_src = "";
shader_vs_src += "attribute vec3 aVertexPosition;\n";
shader_vs_src += "attribute vec2 aTextureCoord;\n";
shader_vs_src += "attribute vec3 aNormal;\n";
shader_vs_src += "uniform mat4 uMVMatrix;\n";
shader_vs_src += "uniform mat4 uPMatrix;\n";
shader_vs_src += "varying vec2 vTextureCoord;\n";
shader_vs_src += "void main(void) {\n";
shader_vs_src += "  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n";
shader_vs_src += "  vTextureCoord = aTextureCoord;\n";
shader_vs_src += "}";

function getShader(gl, src, type) {
    var shader;
    if(type == "fs"){
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    }else if(type == "vs"){
        shader = gl.createShader(gl.VERTEX_SHADER);
    }else{
        return null;
    }

    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}


var shaderProgram;

function initShaders(gl) {
    var fragmentShader = getShader(gl, shader_fs_src, "fs");
    var vertexShader = getShader(gl, shader_vs_src, "vs");

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

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
}
