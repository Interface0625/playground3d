var Model = Model || {
	gl: null,
	vertices: [],
	texCoords: [],
	normals: [],

	texture: null,


	VertexPositionBuffer: null,
    VertexTextureCoordBuffer: null,


	world: null, 			// Matrix
	position: [0,0,0], 		// Vec3
	rotation: [0,0,0,0], 	// Quaternion (orentation vector 3 + rotation)
	scale: [1,1,1], 			// Default scale

	init: function(gl){
		this.gl = gl;
	},

	init_texture: function(){
		// Check if any texture...
		if (this.texture){
			var gl = this.gl;
			var texture = this.texture;
			
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	        gl.bindTexture(gl.TEXTURE_2D, texture); // Bind
	        
	        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	        gl.generateMipmap(gl.TEXTURE_2D);

	        gl.bindTexture(gl.TEXTURE_2D, null); // Unbind ?
	    }
	},
	init_buffers: function(){
		this.VertexPositionBuffer = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	    this.VertexPositionBuffer.itemSize = 3;
	    this.VertexPositionBuffer.numItems = vertexCount;

	    this.VertexTextureCoordBuffer = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, this.dVertexTextureCoordBuffer);
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.TexeCoords), gl.STATIC_DRAW);
	    this.VertexTextureCoordBuffer.itemSize = 2;
	    this.VertexTextureCoordBuffer.numItems = vertexCount;
	},
	draw: function(camera){
		gl = this.gl;
		texture = this.texture;
		VertexPositionBuffer = null;
		VertexTextureCoordBuffer = null;
		VertexNormalBuffer = null;
		VertexIndexBuffer = null;
		// Set world + camera
		// Set up mesh data
		// And draw !

		gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);

		// Vertex Buffer:
        gl.bindBuffer(gl.ARRAY_BUFFER, VertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
        	VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // Texture Coords:
        gl.bindBuffer(gl.ARRAY_BUFFER, VertexTextureCoordBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 
        	VertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // Normals:
        gl.bindBuffer(gl.ARRAY_BUFFER, VertexNormalBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 
        	VertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // Indices:
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, VertexIndexBuffer);
        
        // Setup Matrices
        setMatrixUniforms();
        
        // DRAW:
        gl.drawElements(gl.TRIANGLES, teapotVertexIndexBuffer.numItems, 
        	gl.UNSIGNED_SHORT, 0);
	} };