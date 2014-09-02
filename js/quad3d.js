

var Quad3d = {
    position: [0,0,0], // incusive Z
    rotation: 0, // in degres ¤
    size: [1,1],
    texture: null, // some image
    subImage: [0,0,1,1] // x,y,w,h

    init: function(gl){

    },
    draw: function(gl){


        var view = mat4.create();
        mat4.identity(view);

        // make ortho ?

    }

}