var ResourceManager = {
    gl: null,
    textures: {},
    models: {},


    init: function(gl){
        this.gl = gl;
        // init loading process


    },
    handleLoadedTexture: function (texture) {
        var gl = this.gl;
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.bindTexture(gl.TEXTURE_2D, null);
    },
    initTexture: function (path) {
        var texture;
        if (this.textures[path] == null){
            texture = gl.createTexture();
            texture.image = new Image();
            texture.image.onload = function () {
                ResourceManager.handleLoadedTexture(texture);
            };
            texture.image.src = path;
            this.textures[path] = texture;
        }
        return texture;
    },
    getTexture: function(path){
        if (this.textures[path] == null){
            return this.initTexture(path);
        }else{
            return this.textures[path];
        }
    },
    handleLoadedModel: function (data) {
        var gl = this.gl;

    },
    initModel: function (path) {
        var texture;
        if (this.textures[path] == null){
            texture = gl.createTexture();
            texture.image = new Image();
            texture.image.onload = function () {
                ResourceManager.handleLoadedTexture(this.response);
            };
            texture.image.src = path;
            this.textures[path] = texture;
        }
        return texture;
    },
    getModel: function(path){
        if (this.models[path] == null){
            return this.initModel(path);
        }else{
            return this.models[path];
        }
    }

}