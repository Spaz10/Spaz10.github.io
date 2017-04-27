
//////////////////////////////////////////////
//
//  used code14 as a base
//  added cubemap environment/ skybox
//
//////////////////////////////////////////////

var gl;
var shaderProgram;
var environmentShaderProgram;
var draw_type = 2;
var use_texture = 0;
var rotate_type = 1;

// set up the parameters for lighting 

var light_ambient = [0, 0, 0, 1];
var light_diffuse = [.8, .8, .8, 1];
var light_specular = [1, 1, 1, 1];
var light_pos = [0, -1.0, -1.0];   // eye space position 

var mat_ambient = [0, 0, 0, 1];
var mat_diffuse = [1, 1, 0, 1];
var mat_specular = [.9, .9, .9, 1];
var mat_shine = [50];

//////////// Init OpenGL Context etc. ///////////////

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

function initLight() {


    shaderProgram.light_ambientUniform = gl.getUniformLocation(shaderProgram, "light_ambient");
    shaderProgram.light_diffuseUniform = gl.getUniformLocation(shaderProgram, "light_diffuse");
    shaderProgram.light_specularUniform = gl.getUniformLocation(shaderProgram, "light_specular");

    gl.uniform3fv(shaderProgram.light_pos, [light_pos[0], light_pos[1], light_pos[2]]);
    gl.uniform4f(shaderProgram.ambient_coefUniform, mat_ambient[0], mat_ambient[1], mat_ambient[2], 1.0);
    gl.uniform4f(shaderProgram.diffuse_coefUniform, mat_diffuse[0], mat_diffuse[1], mat_diffuse[2], 1.0);
    gl.uniform4f(shaderProgram.specular_coefUniform, mat_specular[0], mat_specular[1], mat_specular[2], 1.0);
    gl.uniform1f(shaderProgram.shininess_coefUniform, mat_shine);

    gl.uniform4f(shaderProgram.light_ambientUniform, light_ambient[0], light_ambient[1], light_ambient[2], 1.0);
    gl.uniform4f(shaderProgram.light_diffuseUniform, light_diffuse[0], light_diffuse[1], light_diffuse[2], 1.0);
    gl.uniform4f(shaderProgram.light_specularUniform, light_specular[0], light_specular[1], light_specular[2], 1.0);
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////     


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// New Cube helper method, returns positions, normals, indices, and now TextureCoords for texture mapping
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function cube(side) {
    var s = (side || 1) / 2;
    var coords = [];
    var normals = [];
    var texCoords = [];
    var indices = [];

    //function to help populate position and normal arrays for each of the 6 faces of the cube
    function face(xyz, nrm) {
        var start = coords.length / 3;
        var i;
        for (i = 0; i < 12; i++) {
            coords.push(xyz[i]);
        }
        for (i = 0; i < 4; i++) {
            normals.push(nrm[0], nrm[1], nrm[2]);
        }
        texCoords.push(0, 0, 1, 0, 1, 1, 0, 1);
        indices.push(start, start + 1, start + 2, start, start + 2, start + 3);
    }

    //calls the helper function for each of the 6 faces
    face([-s, -s, s, s, -s, s, s, s, s, -s, s, s], [0, 0, 1]);
    face([-s, -s, -s, -s, s, -s, s, s, -s, s, -s, -s], [0, 0, -1]);
    face([-s, s, -s, -s, s, s, s, s, s, s, s, -s], [0, 1, 0]);
    face([-s, -s, -s, s, -s, -s, s, -s, s, -s, -s, s], [0, -1, 0]);
    face([s, -s, -s, s, s, -s, s, s, s, s, -s, s], [1, 0, 0]);
    face([-s, -s, -s, -s, -s, s, -s, s, s, -s, s, -s], [-1, 0, 0]);

    return {
        vertexPositions: new Float32Array(coords),
        vertexNormals: new Float32Array(normals),
        vertexTextureCoords: new Float32Array(texCoords),
        indices: new Uint16Array(indices)
    }
}

var cube;

////////////////////////////////////////////////////////////////////////////////////////////////
// helper method for the environment cube to set up all the shader requirments
///////////////////////////////////////////////////////////////////////////////////////////////
function createModel(modelData) {
    var model = {};
    model.coordsBuffer = gl.createBuffer();
    model.indexBuffer = gl.createBuffer();
    model.count = modelData.indices.length;
    gl.bindBuffer(gl.ARRAY_BUFFER, model.coordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexPositions, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.indices, gl.STATIC_DRAW);
    model.render = function () {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coordsBuffer);
        gl.vertexAttribPointer(environmentShaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        gl.uniformMatrix4fv(environmentShaderProgram.mMatrixUniform, false, mMatrix);
        gl.uniformMatrix4fv(environmentShaderProgram.vMatrixUniform, false, vMatrix);
        gl.uniformMatrix4fv(environmentShaderProgram.pMatrixUniform, false, pMatrix);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
    }
    return model;
}


///////////////////////////////////////////////////////////////////////////////////
// helper method to load textures for the cubes
//////////////////////////////////////////////////////////////////////////////////
var cubemapTexture;
function loadTextureCube() {
    var ct = 0;
    var environment_textures = [];

    var image_names = [
        "right.jpg", "left.jpg",
        "top.jpg", "bottom.jpg",
        "back.jpg", "front.jpg"
    ];

    //load the images for the cubemap
    for (var i = 0; i < 6; i++) {
        var image = new Image();
        image.onload = function () {
            ct = ct + 1;
            console.log("ct is: " + ct);
            console.log("i is: " + i);
            if (ct == 6) {
                cubemapTexture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapTexture);
                var targets = [
                    gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                    gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                    gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
                ];
                for (var j = 0; j < 6; j++) {
                    gl.texImage2D(targets[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, environment_textures[j]);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                }
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                drawScene();
            }
        }
        image.src = image_names[i];
        environment_textures.push(image);

    }
}


var sampleTexture;
/////////////////////////////////////////////////
// helper method for regular texture mapping
////////////////////////////////////////////////
function initTextures() {
    sampleTexture = gl.createTexture();
    sampleTexture.image = new Image();
    sampleTexture.image.src = "courage.jpg";
    sampleTexture.image.onload = function () { handleTextureLoaded(sampleTexture); }

    console.log("loading texture....")
}

//given function from example
function handleTextureLoaded(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);
}


////////////////    Initialize VBO  ////////////////////////
var teapotVertexPositionBuffer;
var teapotVertexNormalBuffer;
var teapotVertexTextureCoordBuffer;
var teapotVertexIndexBuffer;

var xmin, xmax, ymin, ymax, zmin, zmax;

// given function from example
function find_range(positions) {
    console.log("hello!");
    xmin = xmax = positions[0];
    ymin = ymax = positions[1];
    zmin = zmax = positions[2];
    for (i = 0; i < positions.length / 3; i++) {
        if (positions[i * 3] < xmin) xmin = positions[i * 3];
        if (positions[i * 3] > xmax) xmax = positions[i * 3];

        if (positions[i * 3 + 1] < ymin) ymin = positions[i * 3 + 1];
        if (positions[i * 3 + 1] > ymax) ymax = positions[i * 3 + 1];

        if (positions[i * 3 + 2] < zmin) zmin = positions[i * 3 + 2];
        if (positions[i * 3 + 2] > zmax) zmax = positions[i * 3 + 2];
    }
    console.log("*****xmin = " + xmin + "xmax = " + xmax);
    console.log("*****ymin = " + ymin + "ymax = " + ymax);
    console.log("*****zmin = " + zmin + "zmax = " + zmax);
        teapotVertexColorBuffer = teapotVertexNormalBuffer;
    var color = [];
    for(i=0;i<(teapotData.vertexPositions.length / 3);i++){
        color=color.concat([0,1,1,1]);
    }

    teapotVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
    teapotVertexColorBuffer.itemSize = 4;
    teapotVertexColorBuffer.numItems = teapotData.vertexNormals.length / 4;
}

////////////////    Initialize JSON geometry file ///////////

//given function from example
function initJSON() {
    var request = new XMLHttpRequest();
    //  request.open("GET", "triangle.json");
    request.open("GET", "teapot.json");
    request.onreadystatechange =
        function () {
            if (request.readyState == 4) {
                console.log("state =" + request.readyState);
                handleLoadedTeapot(JSON.parse(request.responseText));
            }
        }
    request.send();
}


//given function from example
function handleLoadedTeapot(teapotData) {
    console.log(" in hand LoadedTeapot");
    teapotVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotData.vertexPositions), gl.STATIC_DRAW);
    teapotVertexPositionBuffer.itemSize = 3;
    teapotVertexPositionBuffer.numItems = teapotData.vertexPositions.length / 3;

    teapotVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotData.vertexNormals), gl.STATIC_DRAW);
    teapotVertexNormalBuffer.itemSize = 3;
    teapotVertexNormalBuffer.numItems = teapotData.vertexNormals.length / 3;

    teapotVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotData.vertexTextureCoords),
        gl.STATIC_DRAW);
    teapotVertexTextureCoordBuffer.itemSize = 2;
    teapotVertexTextureCoordBuffer.numItems = teapotData.vertexTextureCoords.length / 2;

    teapotVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(teapotData.indices), gl.STATIC_DRAW);
    teapotVertexIndexBuffer.itemSize = 1;
    teapotVertexIndexBuffer.numItems = teapotData.indices.length;

    find_range(teapotData.vertexPositions);

    console.log("*****xmin = " + xmin + "xmax = " + xmax);
    console.log("*****ymin = " + ymin + "ymax = " + ymax);
    console.log("*****zmin = " + zmin + "zmax = " + zmax);

    teapotVertexColorBuffer = teapotVertexNormalBuffer;

    drawScene();

}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

var mMatrix = mat4.create();  // model matrix
var vMatrix = mat4.create(); // view matrix
var pMatrix = mat4.create();  //projection matrix
var nMatrix = mat4.create();  // normal matrix
var world2eye = mat4.create();
var eye_vector = [5, 0, 0];
var centerOfInterest = [0, 0, 0];
var Z_angle = .0;
var Y_angle = .0;
var emMatrix = mat4.create();  // environment model matrix
var evMatrix = mat4.create(); // environment view matrix
var epMatrix = mat4.create();  //environment projection matrix


function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, mMatrix);
    gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, vMatrix);
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, nMatrix);
    gl.uniformMatrix4fv(shaderProgram.v2wMatrixUniform, false, world2eye);
}
function setEnviMatrixUniforms() {
    gl.uniformMatrix4fv(environmentShaderProgram.mMatrixUniform, false, mMatrix);
    gl.uniformMatrix4fv(environmentShaderProgram.vMatrixUniform, false, vMatrix);
    gl.uniformMatrix4fv(environmentShaderProgram.pMatrixUniform, false, pMatrix);
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

///////////////////////////////////////////////////////////////

var mvMatrixStack = [];

function PushMatrix(matrix) {
    var copy = mat4.create();
    mat4.set(matrix, copy);
    mvMatrixStack.push(copy);
}

function PopMatrix() {
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    var copy = mvMatrixStack.pop();
    return copy;
}


///////////////////////////////////////////////////////
// Helper method to draw the drawScene
///////////////////////////////////////////////////////
var panCamera = 0.0;
function drawScene() {

    //given
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (teapotVertexPositionBuffer == null || teapotVertexNormalBuffer == null || teapotVertexTextureCoordBuffer == null || teapotVertexIndexBuffer == null) {
        return;
    }
    pMatrix = mat4.perspective(60, 1.0, 0.1, 10000, pMatrix);  // set up the projection matrix 

    vMatrix = mat4.lookAt([eye_vector[0], eye_vector[1], eye_vector[2]], [centerOfInterest[0], centerOfInterest[1], centerOfInterest[2]], [0, 1, 0], vMatrix);  // set up the view matrix
    vMatrix = mat4.rotate(vMatrix, degToRad(Z_angle), [0, 1, 0]);
    vMatrix = mat4.rotate(vMatrix, degToRad(-Y_angle), [0, 0, 1]);
    mat4.identity(mMatrix);

    PushMatrix(mMatrix);

    //environment/cubemap 

    gl.useProgram(environmentShaderProgram);
    gl.enableVertexAttribArray(environmentShaderProgram.vertexPositionAttribute);
    cube.render();
    gl.disableVertexAttribArray(environmentShaderProgram.vertexPositionAttribute);

    mMatrix = PopMatrix();

    mat4.identity(nMatrix);
    nMatrix = mat4.multiply(nMatrix, vMatrix);
    nMatrix = mat4.multiply(nMatrix, mMatrix);
    nMatrix = mat4.inverse(nMatrix);
    nMatrix = mat4.transpose(nMatrix);
    mat4.identity(world2eye);

    world2eye = mat4.multiply(world2eye, vMatrix);
    world2eye = mat4.transpose(world2eye);
    PushMatrix(mMatrix);
    mMatrix = mat4.scale(mMatrix, [0.08, 0.08, 0.08], mMatrix);
    mMatrix = mat4.translate(mMatrix, [0, 0, -0.4], mMatrix);

    var matrixmod = mat4.create();
    matrixmod = mat4.translate(matrixmod, [teapotTranslate.x, teapotTranslate.y, teapotTranslate.z]);
    setMatrixUniforms(matrixmod);
    

    //teapot
    gl.useProgram(shaderProgram);
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, teapotVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
   

    gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, teapotVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, teapotVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotVertexIndexBuffer);

    
    setMatrixUniforms();
    gl.uniform1i(shaderProgram.use_textureUniform, use_texture);


    //given from example
    gl.activeTexture(gl.TEXTURE1);   // set texture unit 1 to use
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemapTexture);    // bind the texture object to the texture unit 
    gl.uniform1i(shaderProgram.cube_map_textureUniform, 1);   // pass the texture unit to the shader

    gl.activeTexture(gl.TEXTURE0);   // set texture unit 0 to use
    gl.bindTexture(gl.TEXTURE_2D, sampleTexture);    // bind the texture object to the texture unit 
    gl.uniform1i(shaderProgram.textureUniform, 0);   // pass the texture unit to the shader
    gl.drawElements(gl.TRIANGLES, teapotVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    gl.disableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    gl.disableVertexAttribArray(shaderProgram.vertexNormalAttribute);
    gl.disableVertexAttribArray(shaderProgram.textureCoordAttribute);




}


///////////////////////////////////////////////////////////////

var lastMouseX = 0, lastMouseY = 0;

///////////////////////////////////////////////////////////////

//two types of mouse rotation
function onDocumentMouseDown(event) {
    if (rotate_type == 0) {
        event.preventDefault();
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('mouseup', onDocumentMouseUp, false);
        document.addEventListener('mouseout', onDocumentMouseOut, false);
        var mouseX = event.clientX;
        var mouseY = event.clientY;

        lastMouseX = mouseX;
        lastMouseY = mouseY;
    } else
        if (rotate_type == 1) {
            if (event.button == left) {
                event.preventDefault();
                document.addEventListener('mousemove', onDocumentMouseMove, false);
                document.addEventListener('mouseup', onDocumentMouseUp, false);
                document.addEventListener('mouseout', onDocumentMouseOut, false);
                var mouseX = event.clientX;
                var mouseY = event.clientY;

                lastMouseX = mouseX;
                lastMouseY = mouseY;
            }
            if (event.button == right) {
                //event.preventDefault();
                document.addEventListener('mousemove', onDocumentMouseMove, false);
                document.addEventListener('mouseup', onDocumentMouseUp, false);
                document.addEventListener('mouseout', onDocumentMouseOut, false);
                var mouseX = event.clientX;
                var mouseY = event.clientY;

                lastMouseX = mouseX;
                lastMouseY = mouseY;
            }
        }
}
var left = 0, right = 2;
function onDocumentMouseMove(event) {
    if (rotate_type == 0) {
        var mouseX = event.clientX;
        var mouseY = event.ClientY;

        var diffX = mouseX - lastMouseX;
        var diffY = mouseY - lastMouseY;

        Z_angle = Z_angle + diffX / 5;

        lastMouseX = mouseX;
        lastMouseY = mouseY;

        drawScene();
    } else
        if (rotate_type == 1) {
            if (event.button == left) {
                var mouseX = event.clientX;
                var mouseY = event.clientY;

                var diffX = mouseX - lastMouseX;
                var diffY = mouseY - lastMouseY;
                console.log('left Y=' + event.clientY);

                Z_angle = Z_angle + diffX / 3;
                Y_angle = Y_angle + diffY / 3;

                lastMouseX = mouseX;
                lastMouseY = mouseY;
                drawScene();
            }
            if (event.button == right) {
                var mouseX = event.clientX;
                var mouseY = event.clientY;

                var diffX = mouseX - lastMouseX;
                var diffY = mouseY - lastMouseY;
                console.log('Y=' + diffY);
                ScaleObject = ScaleObject - diffY / 5;
                if (ScaleObject < 0.3) ScaleObject = 0.3;
                if (ScaleObject > 3) ScaleObject = 3;

                lastMouseX = mouseX;
                lastMouseY = mouseY;
                drawScene();
            }
        }
}

function onDocumentMouseUp(event) {
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);
}

function onDocumentMouseOut(event) {
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);
}

///////////////////////////////////////////////////////////////
var teapotTranslate = { x: 0.0, y: 0.0, z: 0.0 };

//user input for movement
function onKeyDown(event) {
    console.log(event.keyCode);
    switch (event.keyCode) {
        case 70://Foward
            console.log("entered f");
            teapotTranslate.z = teapotTranslate.z + 0.1;
            break;
        case 66://Back
            console.log("entered b");
            teapotTranslate.z = teapotTranslate.z - 0.1;
            break;
        case 76://Left
            console.log("entered l");
            teapotTranslate.x = teapotTranslate.x + 0.1;
            break;
        case 82://Right
            console.log("entered r");
            teapotTranslate.x = teapotTranslate.x - 0.1;
            break;
        case 85:
            console.log('enter u');
            if (which_type == 1)
                mvMatrix1 = mat4.translate(mvMatrix1, [0, 0.1, 0]);
            if (which_type == 2)
                mvMatrix2 = mat4.translate(mvMatrix2, [0, 0.1, 0]);
            if (which_type == 3)
                mvMatrix3 = mat4.translate(mvMatrix3, [0, 0.1, 0]);
            break;
        case 68:
            console.log('enter d');
            if (which_type == 1)
                mvMatrix1 = mat4.translate(mvMatrix1, [0, -0.1, 0]);
            if (which_type == 2)
                mvMatrix2 = mat4.translate(mvMatrix2, [0, -0.1, 0]);
            if (which_type == 3)
                mvMatrix3 = mat4.translate(mvMatrix3, [0, -0.1, 0]);
            break;
        case 76:
            console.log('enter l');
            if (which_type == 1) //control the square
                mvMatrix1 = mat4.translate(mvMatrix1, [-0.1, 0, 0]);
            if (which_type == 2)
                mvMatrix2 = mat4.translate(mvMatrix2, [-0.1, 0, 0]);
            if (which_type == 3)
                mvMatrix3 = mat4.translate(mvMatrix3, [-0.1, 0, 0]);
            break;
        case 82:
            console.log('enter r');
            if (which_type == 1)
                mvMatrix1 = mat4.translate(mvMatrix1, [0.1, 0, 0]);
            if (which_type == 2)
                mvMatrix2 = mat4.translate(mvMatrix2, [0.1, 0, 0]);
            if (which_type == 3)
                mvMatrix3 = mat4.translate(mvMatrix3, [0.1, 0, 0]);
            break;
    }
    drawScene();
}

function webGLStart() {
    var canvas = document.getElementById("code03-canvas");
    initGL(canvas);
    initEnvironmentShader();
    gl.enable(gl.DEPTH_TEST);

    //environment shader stuff
    environmentShaderProgram.vertexPositionAttribute = gl.getAttribLocation(environmentShaderProgram, "aVertex");
    environmentShaderProgram.mMatrixUniform = gl.getUniformLocation(environmentShaderProgram, "eMMatrix");
    environmentShaderProgram.vMatrixUniform = gl.getUniformLocation(environmentShaderProgram, "eVMatrix");
    environmentShaderProgram.pMatrixUniform = gl.getUniformLocation(environmentShaderProgram, "ePMatrix");
    environmentShaderProgram.textureUniform = gl.getUniformLocation(environmentShaderProgram, "skybox");

    initShaders();

    //object shader stuff
    gl.enable(gl.DEPTH_TEST);
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");


    shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");
    shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
    shaderProgram.v2wMatrixUniform = gl.getUniformLocation(shaderProgram, "uV2WMatrix");

    //texture
    shaderProgram.use_textureUniform = gl.getUniformLocation(shaderProgram, "use_texture");
    shaderProgram.textureUniform = gl.getUniformLocation(shaderProgram, "myTexture");
    shaderProgram.cube_map_textureUniform = gl.getUniformLocation(shaderProgram, "cubeMap");

    //lighting
    shaderProgram.light_pos = gl.getUniformLocation(shaderProgram, "light_pos");
    shaderProgram.ambient_coefUniform = gl.getUniformLocation(shaderProgram, "ambient_coef");
    shaderProgram.diffuse_coefUniform = gl.getUniformLocation(shaderProgram, "diffuse_coef");
    shaderProgram.specular_coefUniform = gl.getUniformLocation(shaderProgram, "specular_coef");
    shaderProgram.shininess_coefUniform = gl.getUniformLocation(shaderProgram, "mat_shininess");

    shaderProgram.light_ambientUniform = gl.getUniformLocation(shaderProgram, "light_ambient");
    shaderProgram.light_diffuseUniform = gl.getUniformLocation(shaderProgram, "light_diffuse");
    shaderProgram.light_specularUniform = gl.getUniformLocation(shaderProgram, "light_specular");
    gl.useProgram(shaderProgram);

    initTextures();
    initJSON();
    initLight();
    gl.useProgram(environmentShaderProgram);

    //environment cube
    cube = createModel(cube(100));

    console.log('start! ');
    console.error('I hope no error ....');

    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    canvas.onmousedown = onDocumentMouseDown;
    //document.addEventListener('mousedown', onDocumentMouseDown,false); 
    document.addEventListener('keydown', onKeyDown, false);
    //document.addEventListener('mousedown', onDocumentMouseDown,false); 
    loadTextureCube();
    drawScene();
}

//f//////////////////////////////////////////////////////////////////
// helper method go back html button
/////////////////////////////////////////////////////////////////
function redraw() {
    Z_angle = 0;
    Y_angle = 0;
    gl.uniform1f(shaderProgram.shininess_coefUniform, 100);
    gl.uniform3fv(shaderProgram.light_pos, [0, -1, -1]);
    drawScene();
    
}

//////////////////////////////////////////////////////////////////
// helper method for user input of light changes
/////////////////////////////////////////////////////////////////
function lightpos(x, y, z) {

    gl.uniform3fv(shaderProgram.light_pos, [x, y, z]);
    console.log(shaderProgram.light_pos);
    drawScene();
}

//for user input of light intensity
function lightChange(x, y, z, w, e, r) {
    console.log(x + "  " + y + "  " + z);
    console.log(w + "  " + e + "  " + r);
    gl.uniform3fv(shaderProgram.light_diffuse, [x, y, z]);
    gl.uniform3fv(shaderProgram.light_specular, [x, y, z]);
    console.log(shaderProgram.light_ambient);
    drawScene();
}

/////////////////////////////////////////////////////////////////////
// helper method to pan camera
/////////////////////////////////////////////////////////////////////
function rotateCamera(direction) {
    switch (direction) {
        case 1:
            console.log("pan right");
            panCamera = panCamera - 15;
            console.log("panCamera: " + panCamera);
            break;
        case 2:
            console.log("pan left");
            panCamera = panCamera + 15;
            console.log("panCamera: " + panCamera);
            break;
        default:
            break;
    }
    drawScene();
}

//////////////////////////////////////////////////////////////////
// helper method for html file changes camera rotation type
/////////////////////////////////////////////////////////////////
function rotationtype(type) {
    rotate_type = type;
    console.log(rotate_type);
}

function camera(direction) {

    switch (direction) {
        case 0:
            eye_vector[1]++;
            break;
        case 1:
            console.log("down");
            eye_vector[1]--;
            break;
        case 2:
            console.log("left");
            eye_vector[0]--;
            break;
        case 3:
            console.log("right");
            eye_vector[0]++;
            break;
        default:
            break;
    }
    drawScene();

}

//////////////////////////////////////////////////////////////////
// helper method for html file changes center of interest
/////////////////////////////////////////////////////////////////
function interest(direction) {
    switch (direction) {
        case 0:
            console.log("up");
            centerOfInterest[1] += 0.1;
            break;
        case 1:
            console.log("down");
            centerOfInterest[1] -= 0.1;
            break;
        case 2:
            console.log("left");
            centerOfInterest[2] -= 0.1;
            break;
        case 3:
            console.log("right");
            centerOfInterest[2] += 0.1;
            break;
        default:
            break;
    }
    drawScene();

}

function texture(value) {

    use_texture = value;
    drawScene();

}

//////////////////////////////////////////////////////////////////
// helper method for html file changes to lighting position
/////////////////////////////////////////////////////////////////
function onKeyDown(event) {
    console.log(event.keyCode);
    switch (event.keyCode) {
        //lighting controls
        case 71:
            if (!event.shiftKey) {
                console.log("entered g");
                light_pos[0] += 0.1;
                lightpos(light_pos[0], light_pos[1], light_pos[2]);
            } else {
                console.log("entered G");
                light_pos[0] -= 0.1;
                lightpos(light_pos[0], light_pos[1], light_pos[2]);
            }
            break;
        case 72:
            if (!event.shiftKey) {
                console.log("entered h");
                light_pos[1] = light_pos[1] + 0.1;
                lightpos(light_pos[0], light_pos[1], light_pos[2]);
            } else {
                console.log("entered H");
                light_pos[1] = light_pos[1] - 0.1;
                lightpos(light_pos[0], light_pos[1], light_pos[2]);

            }
            break;
        case 89:
            if (!event.shiftKey) {
                console.log("entered y");
                light_pos[2] = light_pos[2] - 0.1;
                lightpos(light_pos[0], light_pos[1], light_pos[2]);

            } else {
                console.log("entered Y");
                light_pos[2] = light_pos[2] + 0.1;
                lightpos(light_pos[0], light_pos[1], light_pos[2]);

            }
            break;
        case 84:
            if (!event.shiftKey) {
                console.log("entered t");
                light_diffuse[0] = light_diffuse[0] + 0.1;
                light_diffuse[1] = light_diffuse[1] + 0.1
                light_diffuse[2] = light_diffuse[2] + 0.1;
                light_specular[0] = light_specular[0] + 0.1;
                light_specular[1] = light_specular[1] + 0.1;
                light_specular[2] = light_specular[2] + 0.1;
                lightChange(light_diffuse[0], light_diffuse[1], light_diffuse[2], light_specular[0], light_specular[1], light_specular[2]);
            } else {
                console.log("entered T");
                light_diffuse[0] = light_diffuse[0] - 0.1;
                light_diffuse[1] = light_diffuse[1] - 0.1
                light_diffuse[2] = light_diffuse[2] - 0.1;
                light_specular[0] = light_specular[0] - 0.1;
                light_specular[1] = light_specular[1] - 0.1;
                light_specular[2] = light_specular[2] - 0.1;
                lightChange(light_diffuse[0], light_diffuse[1], light_diffuse[2], light_specular[0], light_specular[1], light_specular[2]);
            }
            break;
        default:
            break;
    }
    drawScene();
}