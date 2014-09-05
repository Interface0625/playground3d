

var Quad2d = {
    gl: null,
    z:0,
    vertexPositions: [
    0.0, 0.0, 0.0,
    0.0, 100.0, 0.0,
    100.0, 100.0, 0.0,
    0.0, 0.0, 0.0,
    100.0, 0.0, 0.0,
    100.0, 100.0, 0.0],
    vertexTextureCoords: [
    0.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0],
    vertexPositionBuffer: null,
    vertexTextureCoordBuffer: null,
    texture: null,
    perspective: null,
    view: null,

	init: function (gl){
		this.gl = gl;

		this.vertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexPositions), gl.STATIC_DRAW);
        this.vertexPositionBuffer.itemSize = 3;
        this.vertexPositionBuffer.numItems = 6;

        this.vertexTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexTextureCoords), gl.STATIC_DRAW);
        this.vertexTextureCoordBuffer.itemSize = 2;
        this.vertexTextureCoordBuffer.numItems = 6;

        // CAMERA:
        this.perspective = mat4.create();
        mat4.identity   (this.perspective);
        this.perspective = mat4.ortho	(0, gl.viewportWidth, gl.viewportHeight, 0, 0.0, 100.0);

        this.view = mat4.create();
        mat4.identity   (this.view);
        mat4.translate	(this.view, [0, 0, this.z-1]);
	},
	resize: function(x,y,w,h){
		var gl = this.gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(this.vertexPositions));
	},
	subImage: function(x,y,w,h){
		var gl = this.gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(this.vertexTextureCoords));
	},
	draw: function (gl, camera) {
		if (this.vertexTextureCoordBuffer == null || this.vertexPositionBuffer == null) {
            return;
        }
        var gl = this.gl;

        // TEXTURE:
        //gl.activeTexture(gl.TEXTURE0);
        //gl.bindTexture(gl.TEXTURE_2D, this.texture);
        //gl.uniform1i(shaderProgram.samplerUniform, 0);

        // TEXTURE COORD:
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // POSITION COORD:
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // CAMERA SETUP:
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, this.perspective);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, this.view);

        // DRAW:
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexPositionBuffer.numItems);
	}
};