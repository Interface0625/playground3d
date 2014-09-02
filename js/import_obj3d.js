
var ImportObj = function(url){
    vertices = [];
    textureCoords = [];
    normals = [];
    indices = [];

    var data = ""; // obj file

    var lines = data.split("\n");
    for (var lineno=0; lineno < lines.length; lineno++){
        var line = lines[lineno];
        if (line.length > 2 ){
            var type = line[0] + line[1];
            switch(type){
                case "v ": vertices.push(line); break;
                case "t ": textureCoords.push(line); break;
                case "vn": normals.push(line); break;
                case "f ": indices.push(line); break;
                default: break;
            }
        }

    }
};
