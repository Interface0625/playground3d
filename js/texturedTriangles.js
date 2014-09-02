var World = {
    vertexPositions: null,
    vertexTextureCoords: null,
    vertexPositionBuffer: null,
    vertexTextureCoordBuffer: null,

    init: function(gl, data){
        d = "-3.0  0.0 -3.0 0.0 6.0\n-3.0  0.0  3.0 0.0 0.0\n3.0  0.0  3.0 6.0 0.0\n-3.0  0.0 -3.0 0.0 6.0\n3.0  0.0 -3.0 6.0 6.0\n3.0  0.0  3.0 6.0 0.0";
        this.initBuffers(gl, d);
    },

    initBuffers: function (gl, data) {
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


    draw: function (gl, camera) {
        if (this.vertexTextureCoordBuffer == null || this.vertexPositionBuffer == null) {
            return;
        }

        // gl.activeTexture(gl.TEXTURE0);
        // gl.bindTexture(gl.TEXTURE_2D, crateTexture);
        // gl.uniform1i(shaderProgram.samplerUniform, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);


        var view = null;
        if (false){
            view = mat4.create();
            mat4.identity   (view);
            mat4.rotate     (view,  degToRad(-90), [1, 0, 0]);
            mat4.translate  (view, [0, 1, 0]);
        }else{
            view = camera.viewMatrix;
        }
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, camera.perspectiveMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, view);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertexPositionBuffer.numItems);
    }

};