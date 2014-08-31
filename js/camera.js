var Camera = {
    gl: null,
    canvas: null,

    pitch: 0,
    yaw: 0,
    
    pitchRate: 0,
    yawRate: 0,
    pitchSpeed: 0.026,
    yawSpeed: 0.031,

    strafeSpeed: 0,
    speed: 0,
    UpDownSpeed: 0,
    movementSpeed: 0.003,

    togleFreeFly: false,

    joggingAngle: 0,

    perspectiveMatrix: mat4.create(),
    viewMatrix: mat4.create(),

    isKeyPressed: {},
    position: {
    	X:0,
    	Y:0.5,
    	Z:0
    },
    mouse: {
        isCaptured: false,
        deltaX: 0,
        deltaY: 0
    },
    init: function (canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext("experimental­webgl");
        // Hook Events
        document.onkeydown = function(event) { Camera.isKeyPressed[event.keyCode] = true; };
        document.onkeyup = function(event) { Camera.isKeyPressed[event.keyCode] = false; };
        canvas.addEventListener('click', Camera.mouseClick, false);
        canvas.addEventListener("mousemove", Camera.mouseMove, false);
        document.addEventListener('pointerlockchange', Camera.mouseLockChange, false);
        document.addEventListener('mozpointerlockchange', Camera.mouseLockChange, false);
        document.addEventListener('webkitpointerlockchange', Camera.mouseLockChange, false);
        Camera.updateCamera(0);
    },
    mouseClick: function(e){
        if(!Camera.mouse.isCaptured){ Camera.captureMouse(); }
    },
    mouseMove: function(e){
        Camera.mouse.deltaX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
        Camera.mouse.deltaY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
    },
    captureMouse: function(e){
        var canvas = Camera.canvas;
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
        canvas.requestPointerLock();
        Camera.mouse.isCaptured = true;
    },
    mouseLockChange: function(){
        if( document.pointerLockElement === Camera.canvas || 
            document.mozPointerLockElement === Camera.canvas || 
            document.webkitPointerLockElement === Camera.canvas) {
            Camera.mouse.isCaptured = true;
        } else {
            Camera.mouse.isCaptured = false;
        }
    },
    mouseLook: function(){
        if(Camera.mouse.deltaY != 0){
            Camera.pitchRate = Camera.pitchSpeed * Camera.mouse.deltaY * -1;
            Camera.mouse.deltaY = 0;
        }else{
            Camera.pitchRate=0;
        }
        
        if(Camera.mouse.deltaX != 0){
            Camera.yawRate = Camera.yawSpeed * Camera.mouse.deltaX * -1;
            Camera.mouse.deltaX = 0;
        }else{
            Camera.yawRate=0;
        }
    },
    keyboardWalk: function(){
    	if (Camera.isKeyPressed[70]) { // F
    		Camera.togleFreeFly = !Camera.togleFreeFly;
    	}

        if (Camera.isKeyPressed[87]) { // W
            Camera.speed = -Camera.movementSpeed;
        } else if (Camera.isKeyPressed[83]) { // S
            Camera.speed = Camera.movementSpeed;
        } else { 
            Camera.speed = 0; 
        }

        if(Camera.isKeyPressed[65]){ // A
            Camera.strafeSpeed = -Camera.movementSpeed;
        }else if(Camera.isKeyPressed[68]){ // D
            Camera.strafeSpeed = Camera.movementSpeed;
        }else{ 
            Camera.strafeSpeed = 0; 
        }

        if(Camera.isKeyPressed[16]){ // ctrl
            Camera.UpDownSpeed = -Camera.movementSpeed;
        }else if(Camera.isKeyPressed[32]){ // Space
            Camera.UpDownSpeed = Camera.movementSpeed;

        }else{ 
            Camera.UpDownSpeed = 0; 
        }
    },
    updateCamera: function(elapsed){
    	if (Camera.togleFreeFly) {
        	Camera.updateFreeFly(elapsed);
    	}else{
        	Camera.updatePlaneWalk(elapsed);
    	}
    },
    updatePlaneWalk: function(elapsed){
        if (Camera.speed != 0 || Camera.strafeSpeed != 0 || Camera.UpDownSpeed != 0) {
            // foreward/backward
            Camera.position.X += Math.sin(degToRad(Camera.yaw)) * Camera.speed * elapsed;
            Camera.position.Z += Math.cos(degToRad(Camera.yaw)) * Camera.speed * elapsed;
            
            // strafe
            Camera.position.X += Math.sin(degToRad(Camera.yaw+90)) * Camera.strafeSpeed * elapsed;
            Camera.position.Z += Math.cos(degToRad(Camera.yaw+90)) * Camera.strafeSpeed * elapsed;
            
            // Height control
            Camera.joggingAngle += elapsed * 0.6; // 0.6 "fiddle factor" ­ makes it feel more realistic :­)
            Camera.position.Y = Math.sin(degToRad(Camera.joggingAngle)) / 20 + 0.4;
        }


        Camera.yaw += Camera.yawRate * elapsed;
        Camera.pitch += Camera.pitchRate * elapsed;
        Camera.yawRate = 0;
        Camera.pitchRate = 0;

        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, Camera.perspectiveMatrix);

        mat4.identity   (Camera.viewMatrix);

        mat4.rotate     (Camera.viewMatrix,  degToRad(-Camera.pitch), [1, 0, 0]);
        mat4.rotate     (Camera.viewMatrix, degToRad(-Camera.yaw), [0, 1, 0]);
        mat4.translate  (Camera.viewMatrix, [-Camera.position.X, -Camera.position.Y, -Camera.position.Z]);
    },
    updateFreeFly: function(elapsed){
        if (Camera.speed != 0 || Camera.strafeSpeed != 0 || Camera.UpDownSpeed != 0) {
            // foreward/backward
            Camera.position.X += Math.sin(degToRad(Camera.yaw)) * Camera.speed * elapsed;
            Camera.position.Z += Math.cos(degToRad(Camera.yaw)) * Camera.speed * elapsed;
            
            // strafe
            Camera.position.X += Math.sin(degToRad(Camera.yaw+90)) * Camera.strafeSpeed * elapsed;
            Camera.position.Z += Math.cos(degToRad(Camera.yaw+90)) * Camera.strafeSpeed * elapsed;
            
            // Height control
            Camera.position.Y += Math.sin(degToRad(-Camera.pitch)) * Camera.speed * elapsed;;
        }


        Camera.yaw += Camera.yawRate * elapsed;
        Camera.pitch += Camera.pitchRate * elapsed;
        Camera.yawRate = 0;
        Camera.pitchRate = 0;

        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, Camera.perspectiveMatrix);

        mat4.identity   (Camera.viewMatrix);

        mat4.rotate     (Camera.viewMatrix,  degToRad(-Camera.pitch), [1, 0, 0]);
        mat4.rotate     (Camera.viewMatrix, degToRad(-Camera.yaw), [0, 1, 0]);
        mat4.translate  (Camera.viewMatrix, [-Camera.position.X, -Camera.position.Y, -Camera.position.Z]);
    },
    update: function (elapsed) {
        if (Camera.mouse.isCaptured){
            Camera.mouseLook();
            Camera.keyboardWalk();
            Camera.updateCamera(elapsed);
        }
    }
}