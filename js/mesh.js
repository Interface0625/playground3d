var Mesh = {
	vertexPositions: [],
	vertexNormals: [],
	vertexTextureCoords: [],
	indices: [],

	vertexPositionBuffer: null,
	vertexNormalBuffer: null,
	vertexTextureCoordBuffer: null,
	vertexIndexBuffer: null,
	loadJSON: function(txt){
		var obj = JSON.parse(txt);
		this.vertexPositions = obj["vp"];
		this.vertexNormals = obj["vn"];
		this.vertexTextureCoords = obj["vt"];
		this.indices = obj["i"];
	},
	initBuffers: function (gl) {
		if(this.vertexPositions){
			this.vertexPositionBuffer = gl.createBuffer();
			gl.bindBuffer(
				gl.ARRAY_BUFFER, 
				this.vertexPositionBuffer);
			gl.bufferData(
				gl.ARRAY_BUFFER, 
				new Float32Array(this.vertexPositions), 
				gl.STATIC_DRAW);
			this.vertexPositionBuffer.itemSize = 3;
			this.vertexPositionBuffer.numItems = this.vertexPositions.length / 3;
		}
		if(this.vertexNormals){
			this.vertexNormalBuffer = gl.createBuffer();
			gl.bindBuffer(
				gl.ARRAY_BUFFER, 
				this.vertexNormalBuffer);
			gl.bufferData(
				gl.ARRAY_BUFFER, 
				new Float32Array(this.vertexNormals), 
				gl.STATIC_DRAW);
			this.vertexNormalBuffer.itemSize = 3;
			this.vertexNormalBuffer.numItems = this.vertexNormals.length / 3;
		}
		if(this.vertexTextureCoords){
			this.vertexTextureCoordBuffer = gl.createBuffer();
			gl.bindBuffer(
				gl.ARRAY_BUFFER, 
				this.vertexTextureCoordBuffer);
			gl.bufferData(
				gl.ARRAY_BUFFER, 
				new Float32Array(this.vertexTextureCoords), 
				gl.STATIC_DRAW);
			this.vertexTextureCoordBuffer.itemSize = 2;
			this.vertexTextureCoordBuffer.numItems = this.vertexTextureCoords.length / 2;
		}
		if(this.indices){
			this.vertexIndexBuffer = gl.createBuffer();
			gl.bindBuffer(
				gl.ELEMENT_ARRAY_BUFFER, 
				this.vertexIndexBuffer);
			gl.bufferData(
				gl.ELEMENT_ARRAY_BUFFER, 
				new Uint16Array(this.indices), 
				gl.STATIC_DRAW);
			this.vertexIndexBuffer.itemSize = 1;
			this.vertexIndexBuffer.numItems = this.indices.length;
		}
	},
	draw: function (gl) {
        if (this.vertexTextureCoordBuffer == null || 
        	this.vertexPositionBuffer == null) {
            return;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
        	this.vertexPositionBuffer.itemSize, 
        	gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
        gl.vertexAttribPointer(
        	shaderProgram.textureCoordAttribute, 
        	this.vertexTextureCoordBuffer.itemSize, 
        	gl.FLOAT, false, 0, 0);
        /*  //DISABLED FOR NOW
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
        gl.vertexAttribPointer(
        	shaderProgram.vertexNormalAttribute, 
        	this.vertexNormalBuffer.itemSize, 
        	gl.FLOAT, false, 0, 0);
		*/ 

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);

        gl.drawElements(
        	gl.TRIANGLES, 
        	this.vertexIndexBuffer.numItems, 
        	gl.UNSIGNED_SHORT, 
        	0);
    }
};
