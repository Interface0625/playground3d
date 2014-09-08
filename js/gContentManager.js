// gContentManager:
//
// Should handle all content loading and mapping.
// 
var logg = function(obj){
	console.log(obj);
};

gContentManager = {
	gl: null,
	images: {},
	models: {},
	shaders: {},
	scripts: {},
	json: {},

	init: function(gl){
		this.log("gContentManager init.")
		this.gl = gl;
		logg("Hello");
		this.getShader("@default.vs");
		this.getShader("@default.fs");
		this.getImage("@default.png");
		this.getModel("@default.json");
		this.getModel("@teapot.json")
	},
	getImage: function(path){
		if(path[0]=='@') { 
			path = path.replace("@", "res/images/"); 
		}
		if(path in this.images){ 
			return this.images[path]; 
		}else{
			return this.loadImage(path)
		}
	},
	loadImage: function(path){
		var texture = this.gl.createTexture();
        texture.image = new Image();
        var gl = this.gl;

        texture.image.onload = function () {
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.bindTexture(gl.TEXTURE_2D, null);
        }
        texture.image.src = path;
        this.images[path] = texture;
        return texture;
	},
	getModel: function(path){
		if(path[0]=='@') { 
			path = path.replace("@", "res/models/"); 
		}
		if(path in this.models){ 
			return this.models[path]; 
		}else{
			return this.loadModel(path);
		}
	},
	loadModel: function(path){
		var model = {};
		var gl = this.gl;
		this.xhrGet(path, function(){
			model["src"] = path;
			model["response"] = this.response;
			if(path == "res/models/teapot.json"){
				console.log("teapot loaded");
				// 
				Mesh.loadJSON(this.response);
				Mesh.initBuffers(gl);
				console.log(Mesh);


				model["json"] = JSON.parse(this.response);
				console.log("vp: " + model["json"]["vp"].length / 3);
				console.log("vn: " + model["json"]["vn"].length / 3);
				console.log("vt: " + model["json"]["vt"].length / 2);
				console.log("i: " + model["json"]["i"].length);
			}
		});
		this.models[path] = model;
		return model;
	},
	getShader: function(path){
		if(path[0]=='@') { 
			path = path.replace("@", "res/shaders/"); 
		}
		if(path in this.shaders){ 
			return this.shader[path]; 
		}else{
			this.loadShader(path);
		}
	},
	loadShader: function(path){
		var shader = {};
		this.xhrGet(path, function(){
			shader["src"] = path;
			shader["sourceCode"] = this.response;
			// Process it here:
			// var type = path.split('.').pop();
		});
		this.shaders[path] = shader;
		return shader;
	},

	// Helper functions:
	xhrGet: function(reqUri, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", reqUri, true);
		xhr.onload = callback;
		xhr.send();
	},
	log: function(obj){ console.log(obj); }
};

/********************************************************************
	getScript: function(path){
		if(path[0]=='@') { path = path.replace("@", "js/"); }
		if(path in this.scripts){ 
			return this.scripts[path]; 
		}else{
			return this.loadScript(path);
		}
	},
	loadScript: function(path){
		var script = {};
		this.xhrGet(path, function(){
			script["src"] = path;
			script["sourceCode"] = this.response;
		});
		this.scripts[path] = script;
		return script;
	},
********************************************************************/
