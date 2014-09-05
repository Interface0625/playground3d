


var World = {
    vertexPositions: null,
    vertexTextureCoords: null,
    vertexPositionBuffer: null,
    vertexTextureCoordBuffer: null,
    texture: null,

    init: function(){
        this.initTexture();
        this.loadWorld();
    },

    initTexture: function () {
        this.texture = gl.createTexture();
        this.texture.image = new Image();
        var t = this.texture;
        this.texture.image.onload = function () {
            World.handleLoadedTexture(t);
        }
        this.texture.image.src = "res/images/floor.jpg";
    },
    handleLoadedTexture: function (texture) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.bindTexture(gl.TEXTURE_2D, null);
    },
    initBuffers: function (data) {
        var lines = data.split("\n");
        var vertexCount = 0;
        this.vertexPositions = [];
        this.vertexTextureCoords = [];
        for (var i in lines) {
            var vals = lines[i].replace(/^\s+/, "").split(/\s+/);
            if (vals.length == 5 && vals[0] != "//") {
                // It is a line describing a vertex; get X, Y and Z first
                this.vertexPositions.push(parseFloat(vals[0]));
                this.vertexPositions.push(parseFloat(vals[1]));
                this.vertexPositions.push(parseFloat(vals[2]));

                // And then the texture coords
                this.vertexTextureCoords.push(parseFloat(vals[3]));
                this.vertexTextureCoords.push(parseFloat(vals[4]));

                vertexCount += 1;
            }
        }

        this.vertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexPositions), gl.STATIC_DRAW);
        this.vertexPositionBuffer.itemSize = 3;
        this.vertexPositionBuffer.numItems = vertexCount;

        this.vertexTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexTextureCoords), gl.STATIC_DRAW);
        this.vertexTextureCoordBuffer.itemSize = 2;
        this.vertexTextureCoordBuffer.numItems = vertexCount;
    },

    loadWorld: function () {
        var model_definition = "";
        model_definition += "-3.0  0.0 -3.0 0.0 6.0\n";
        model_definition += "-3.0  0.0  3.0 0.0 0.0\n";
        model_definition += " 3.0  0.0  3.0 6.0 0.0\n";
        model_definition += "-3.0  0.0 -3.0 0.0 6.0\n";
        model_definition += " 3.0  0.0 -3.0 6.0 6.0\n";
        model_definition += " 3.0  0.0  3.0 6.0 0.0";
        this.initBuffers(model_definition);
    },

    draw: function (gl, camera) {
        if (this.vertexTextureCoordBuffer == null || this.vertexPositionBuffer == null) {
            return;
        }

        // TEXTURE:
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);

        // TEXTURE COORD:
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // POSITION COORD:
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // CAMERA SETUP:
        var perspective = camera.perspectiveMatrix;
        var view = camera.viewMatrix;
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, perspective);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, view);

        // DRAW:
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexPositionBuffer.numItems);
    }

};