
var ImportObj = function(path){
    var data = ""; // obj file

    var v = [];
    var vt = [];
    var vn = [];
    var f = [];
    var lines = data.split("\n");
    for (var lineno=0; lineno < lines.length; lineno++){
        var line = lines[lineno];
        if (line.length > 2 ){
            var type = line.substring(0,2);
            switch(type){
                case "v ": v.push(line.substring(2).split(" ")); break;
                case "vt": vt.push(line.substring(3).split(" ")); break;
                case "vn": vn.push(line.substring(3).split(" ")); break;
                case "f ": f.push(line.substring(2).split(" ")); break;
                default: break;
            }
        }
    }

    result = {};
    result.vertices = [];
    result.textures = [];
    result.normals = [];
    result.indices = [];
    var indexCounter = 0;

    for(var faceno = 0; faceno < f.length; faceno++){
        face = f[faceno];
        for(var vertno = 0; vertno < face.length; faceno++){
            var vert = face[vertno].split("/");
            
            var vIndex = vert[0]-1; 
            result.vertices.push(parseFloat(v[vIndex][0]));
            result.vertices.push(parseFloat(v[vIndex][1]));
            result.vertices.push(parseFloat(v[vIndex][2]));
            
            var tIndex = vert[1]-1;
            result.textures.push(parseFloat(vt[tIndex][0]));
            result.textures.push(parseFloat(vt[tIndex][1]));
            
            var nIndex = vert[2]-1;
            result.normals.push(parseFloat(vn[nIndex][0]));
            result.normals.push(parseFloat(vn[nIndex][1]));
            result.normals.push(parseFloat(vn[nIndex][2]));
            
            result.indices.push(indexCounter);
            indexCounter+=1;
        }
    }

    return result;
}
