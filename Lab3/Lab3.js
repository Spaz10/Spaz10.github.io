var gl;
var shaderProgram;



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
///////////////////////////////////////////////////////////////
var cubeVertexPositionBuffer;
var cubeVertexColorBuffer;
var cubeVertexIndexBuffer;
var cubeVertexNormalBuffer;

var cubeUpArmVertexPositionBuffer;
var cubeUpArmVertexColorBuffer;
var cubeUpArmVertexIndexBuffer;
var cubeUpArmVertexNormalBuffer;

var cylinderVertexPositionBuffer;
var cylinderVertexColorBuffer;
var cylinderBodyIndexBuffer;
var cylinderTopBotVertexNormalBuffer;
var cylinderBodyVertexNormalBuffer;

var sphereVertexPositionBuffer;
var sphereVertexColorBuffer;
var sphereIndexBuffer;
var sphereVertexNormalBuffer;


////////////////    Initialize VBO  ////////////////////////

///////////////////////////////////////////////////////////////////////////////////////
// Initilizing Helper method to set up Cube buffers for the body and part of the arms
// Uses the Cube method to calculate verticies
//////////////////////////////////////////////////////////////////////////////////////

function initCube() {
    cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);


    //defined below
    cube(0.5, [1.0, 0, 0.6, 1.0]);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.STATIC_DRAW);
    cubeVertexPositionBuffer.itemSize = 3;
    cubeVertexPositionBuffer.numItems = 24;

    cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndicies), gl.STATIC_DRAW);
    cubeVertexIndexBuffer.itemsize = 1;
    cubeVertexIndexBuffer.numItems = 36;

    cubeVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeNormal), gl.STATIC_DRAW);
    cubeVertexNormalBuffer.itemSize = 3;
    cubeVertexNormalBuffer.numItems = 24;

    cubeVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeColor), gl.STATIC_DRAW);
    cubeVertexColorBuffer.itemSize = 4;
    cubeVertexColorBuffer.numItems = 24;
}


///////////////////////////////////////////////////////////////////////////////////////
// Initilizing Helper method to set up Cube buffers for the body and part of the arms
// Uses the CubeUpArm method to calculate verticies
// Same as above but with a diferent color and verticy arrays
//////////////////////////////////////////////////////////////////////////////////////
function initUpArmCube() {
    cubeUpArmVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeUpArmVertexPositionBuffer);

    //defined below
    cubeUpArm(0.5, [0.3, 0.8, 1.2, 1.0]);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeUpArmVertices), gl.STATIC_DRAW);
    cubeUpArmVertexPositionBuffer.itemSize = 3;
    cubeUpArmVertexPositionBuffer.numItems = 24;

    cubeUpArmVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeUpArmVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeUpArmIndicies), gl.STATIC_DRAW);
    cubeUpArmVertexIndexBuffer.itemsize = 1;
    cubeUpArmVertexIndexBuffer.numItems = 36;

    cubeUpArmVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeUpArmVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeUpArmNormal), gl.STATIC_DRAW);
    cubeUpArmVertexNormalBuffer.itemSize = 3;
    cubeUpArmVertexNormalBuffer.numItems = 24;

    cubeUpArmVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeUpArmVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeUpArmColor), gl.STATIC_DRAW);
    cubeUpArmVertexColorBuffer.itemSize = 4;
    cubeUpArmVertexColorBuffer.numItems = 24;
}




////////////////////////////////////////////////////////////////////
// Cube Helper method to create the indicies needed for the buffers
///////////////////////////////////////////////////////////////////

var cubeVertices = [];
var cubeIndicies = [];
var cubeNormal = [];
var cubeColor = [];
function cube(size, color) {
    cubeVertices = [
        //front, back, top, bottom, right, left
        -size, -size, size,
        size, -size, size,
        size, size, size,
        -size, size, size,

        -size, -size, -size,
        -size, size, -size,
        size, size, -size,
        size, -size, -size,

        -size, size, -size,
        -size, size, size,
        size, size, size,
        size, size, -size,

        -size, -size, -size,
        size, -size, -size,
        size, -size, size,
        -size, -size, size,

        size, -size, -size,
        size, size, -size,
        size, size, size,
        size, -size, size,

        -size, -size, -size,
        -size, -size, size,
        -size, size, size,
        -size, size, -size,
    ]

    cubeNormal = [
        //front, back, top, bottom, right, left
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,

        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,

        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,

        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,

        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,

        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0
    ];

    cubeIndicies = [
        //front, back, top, bottom, right, left
        0, 1, 2,
        0, 2, 3,

        4, 5, 6,
        4, 6, 7,

        8, 9, 10,
        8, 10, 11,

        12, 13, 14,
        12, 14, 15,

        16, 17, 18,
        16, 18, 19,

        20, 21, 22,
        20, 22, 23
    ];

    for (i = 0; i < 24; i++) {
        cubeColor = cubeColor.concat(color)
    }
}



///////////////////////////////////////////////////////////////////////////////////////////////
// Cube Helper method to create the indicies needed for the buffers
// Same as above, but with diferent arrays to allow for a separate color for the other parts
//////////////////////////////////////////////////////////////////////////////////////////////
var cubeUpArmVertices = [];
var cubeUpArmIndicies = [];
var cubeUpArmNormal = [];
var cubeUpArmColor = [];
function cubeUpArm(size, color) {
    cubeUpArmVertices = [
        -size, -size, size,
        size, -size, size,
        size, size, size,
        -size, size, size,

        -size, -size, -size,
        -size, size, -size,
        size, size, -size,
        size, -size, -size,

        -size, size, -size,
        -size, size, size,
        size, size, size,
        size, size, -size,

        -size, -size, -size,
        size, -size, -size,
        size, -size, size,
        -size, -size, size,

        size, -size, -size,
        size, size, -size,
        size, size, size,
        size, -size, size,

        -size, -size, -size,
        -size, -size, size,
        -size, size, size,
        -size, size, -size,
    ]

    cubeUpArmNormal = [
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,

        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,

        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,

        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,

        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,

        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0
    ];

    cubeUpArmIndicies = [

        0, 1, 2,
        0, 2, 3,

        4, 5, 6,
        4, 6, 7,

        8, 9, 10,
        8, 10, 11,

        12, 13, 14,
        12, 14, 15,

        16, 17, 18,
        16, 18, 19,

        20, 21, 22,
        20, 22, 23
    ];

    for (i = 0; i < 24; i++) {
        cubeUpArmColor = cubeUpArmColor.concat(color)
    }
}


///////////////////////////////////////////////////////////////////////////////////////
// Initilizing Helper method to set up Cylinder buffers for part of the arms
// Uses the cylinder method to calculate verticies
//////////////////////////////////////////////////////////////////////////////////////

function initCylinder() {
    var nslices = 32;
    cylinder(0.5, 0.5, 0.5, nslices, 0, [0.8, 0.0, 1.6, 1.0]);

    cylinderVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylinderVertices), gl.STATIC_DRAW);
    cylinderVertexPositionBuffer.itemSize = 3;
    cylinderVertexPositionBuffer.numTopItems = nslices + 2;
    cylinderVertexPositionBuffer.numBotItems = nslices + 2;

    cylinderTopBotVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cylinderTopBotVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylinderNormal), gl.STATIC_DRAW);
    cylinderTopBotVertexNormalBuffer.itemSize = 3;
    cylinderTopBotVertexNormalBuffer.numItems = cylinderNormal.length / 3;

    cylinderBodyVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cylinderBodyVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylinderNormalSides), gl.STATIC_DRAW);
    cylinderBodyVertexNormalBuffer.itemSize = 3;
    cylinderBodyVertexNormalBuffer.numItems = cylinderNormalSides.length / 3;

    cylinderBodyIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderBodyIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cylinderIndicies), gl.STATIC_DRAW);
    cylinderBodyIndexBuffer.numItems = (nslices + 1) * 2;

    cylinderVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylinderColors), gl.STATIC_DRAW);
    cylinderVertexColorBuffer.itemSize = 4;
    cylinderVertexColorBuffer.numItems = cylinderColors / 4;
}

///////////////////////////////////////////////////////////////////////////////////////
// Calculates top and bottom circle needed for the cylinder, and uses nslices
//////////////////////////////////////////////////////////////////////////////////////

var cylinderVertices = []; var cylinderVerticesTop = []; var cylinderVerticesBottom = [];
var cylinderColors = [];
var cylinderIndicies = [];
var cylinderNormal = [];
var cylinderNormalSides = [];
function cylinder(baseRadius, topRadius, height, nslices, nstacks, color) {
    createCylinderCircle(topRadius, height, nslices, color, 1);
    createCylinderCircle(baseRadius, height, nslices, color, 0);

    for (i = 0; i <= nslices; i++) {
        var indexA = nslices + 3 + i;
        var indexB = 1 + i;
        cylinderIndicies.push(indexA);
        cylinderColors.push(color);
        cylinderIndicies.push(indexB);
        cylinderColors.push(color);
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Cylinder Helper method to create the indicies needed for the cicles for the buffers, handles caluclations
// similar logic from last lab 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createCylinderCircle(radius, height, nslices, color, topOrBottom) {

    var circleCenterData = { x: 0, y: 0, r: 0 };
    circleCenterData.r = radius


    var zVal = height / 2;
    if (topOrBottom == 0) {
        zVal = -zVal;
        cylinderNormal = cylinderNormal.concat([0, 0, -1]);
    } else {
        cylinderNormal = cylinderNormal.concat([0, 0, 1]);
    }

    var numberOfItems = 3;
    var numberOfTriangleFans = nslices;
    var degreesPerFan = (2 * Math.PI) / numberOfTriangleFans;

    var circleVertexData = [circleCenterData.x, circleCenterData.y, zVal];
    cylinderNormalSides = cylinderNormalSides.concat([0, 0, 0]);
    var colors = [];
    colors = colors.concat(color)

    for (var i = 0; i <= numberOfTriangleFans; i++) {

        //offset for center
        var vertexDataIndex = numberOfItems * i + 3;
        var thisAngle = degreesPerFan * (i + 1);

        //calculations given in class for finding vertices
        var x = (Math.cos(thisAngle) * circleCenterData.r) + circleCenterData.x;
        var y = (Math.sin(thisAngle) * circleCenterData.r) + circleCenterData.y;

        var z = zVal;
        circleVertexData[vertexDataIndex] = x;
        circleVertexData[vertexDataIndex + 1] = y;
        circleVertexData[vertexDataIndex + 2] = z;

        //normals
        var position = [x, y, 0];
        position[0] = position[0] / circleCenterData.r;
        position[1] = position[1] / circleCenterData.r;
        if (topOrBottom) {
            cylinderNormal = cylinderNormal.concat([0, 0, 1]);
        } else {
            cylinderNormal = cylinderNormal.concat([0, 0, -1]);
        }
        cylinderNormalSides = cylinderNormalSides.concat(position);

        //Add to the color matrix
        colors = colors.concat(color);
    }
    cylinderVertices = cylinderVertices.concat(circleVertexData);
    cylinderColors = cylinderColors.concat(colors);
}


///////////////////////////////////////////////////////////////////////////////////////
// Initilizing Helper method to set up Sphere buffers for the head
// Uses the sphere method to calculate verticies
//////////////////////////////////////////////////////////////////////////////////////


function initSphere() {
    var nslices = 36;
    var nstacks = 36;
    sphere(0.5, nslices, nstacks, [1, 0.5, 0.2, 1.0]);
    sphereVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereVertices), gl.STATIC_DRAW);
    sphereVertexPositionBuffer.itemSize = 3;
    sphereVertexPositionBuffer.numItems = sphereVertices.length / 3;

    sphereVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereNormals), gl.STATIC_DRAW);
    sphereVertexNormalBuffer.itemSize = 3;
    sphereVertexNormalBuffer.numItems = sphereNormals.length / 3;

    sphereIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphereIndices), gl.STATIC_DRAW);
    sphereIndexBuffer.numItems = offset.numItems;
    sphereIndexBuffer.topOffset = offset.topOffset;
    sphereIndexBuffer.botOffset = offset.botOffset;

    sphereVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereColors), gl.STATIC_DRAW);
    sphereVertexColorBuffer.itemSize = 4;
    sphereVertexColorBuffer.numItems = sphereColors.length / 4;
}

////////////////////////////////////////////////////////////////////
//  Sphere Helper method to create the indicies needed for the buffers
//  Needs circles so used circle method for that
///////////////////////////////////////////////////////////////////

var sphereVertices = [];
var sphereIndices = [];
var sphereColors = [];
var offset = { numItems: 0, topOffset: 0.0, botOffset: 0.0 };
var sphereNormals = [];
function sphere(radius, numslices, numstacks, color) {
    for (i = 1; i <= numstacks - 2; i++) { 
        var h = (2 * radius) * (i / (numstacks - 1)) - radius;
        var r = Math.sqrt(Math.pow(radius, 2) - Math.pow(h, 2));

        //defined below
        circle(r, h, numslices, color);
    }
    sphereVertices = sphereVertices.concat([0, 0, radius]);
    sphereNormals = sphereNormals.concat([0, 0, 1]);
    sphereColors = sphereColors.concat(color);
    sphereVertices = sphereVertices.concat([0, 0, -radius]);
    sphereNormals = sphereNormals.concat([0, 0, -1]);
    sphereColors = sphereColors.concat(color);

    //find indices
    for (j = 1; j < numstacks - 2; j++) {
        for (i = 0; i <= numslices; i++) {
            var indexA = i + 1 + (j - 1) * (numslices + 2);
            var indexB = numslices + 3 + i + (j - 1) * (numslices + 2);
            sphereIndices.push(indexA);
            sphereColors = sphereColors.concat(color);
            sphereIndices.push(indexB);
            sphereColors = sphereColors.concat(color);
        }
    }
    offset.numItems = sphereIndices.length;
    offset.topOffset = sphereIndices.length;
    var topPoint = (sphereVertices.length / 3) - 2;
    sphereIndices.push(topPoint);
    for (i = topPoint - (numslices + 1); i < topPoint; i++) {
        sphereIndices.push(i);
    }

    offset.botOffset = sphereIndices.length;
    var botPoint = (sphereVertices.length / 3) - 1;
    sphereIndices.push(botPoint);
    for (i = 1; i <= numslices + 1; i++) {
        sphereIndices.push(i);
    }
}
////////////////////////////////////////////////////////////////////
// Circle helper method used for making the sphere verteces
// similar to lab2
///////////////////////////////////////////////////////////////////

function circle(radius, height, nslices, color) {
    var circleCenterData = { x: 0, y: 0, r: 0 };
    circleCenterData.r = radius
    var zVal = height;
    var numberOfItems = 3;
    var numberOfTriangleFans = nslices;
    var degreesPerFan = (2 * Math.PI) / numberOfTriangleFans;
    var circleVertexData = [circleCenterData.x, circleCenterData.y, zVal];
    //center
    var circleNormalData = [0, 0, 0];
    var colors = [];
    colors = colors.concat(color)

    for (var i = 0; i <= numberOfTriangleFans; i++) {
        //offset for center
        var vertexDataIndex = numberOfItems * i + 3;
        var thisAngle = degreesPerFan * (i + 1);

        // x, y, z 
        var x = (Math.cos(thisAngle) * circleCenterData.r) + circleCenterData.x;
        var y = (Math.sin(thisAngle) * circleCenterData.r) + circleCenterData.y;
        var z = zVal;
        circleVertexData[vertexDataIndex] = x;
        circleVertexData[vertexDataIndex + 1] = y;
        circleVertexData[vertexDataIndex + 2] = z;

        //normals
        var position = [x, y, z];
        position[0] = position[0] / circleCenterData.r;
        position[1] = position[1] / circleCenterData.r;
        position[2] = position[2] / circleCenterData.r;
        circleNormalData = circleNormalData.concat(position);

        colors = colors.concat(color);
    }
    sphereVertices = sphereVertices.concat(circleVertexData);
    sphereNormals = sphereNormals.concat(circleNormalData);
    sphereColors = sphereColors.concat(colors);
}

//uses previously defined helper methods to initialise all types of buffers
function initBuffers() {
    initUpArmCube();
    initCube();
    initCylinder();
    initSphere();
}

///////////////////////////////////////////////////////////////

//variables defined in lab webpage required for lab
var mMatrix = mat4.create();  
var vMatrix = mat4.create(); 
var pMatrix = mat4.create();  
var nMatrix = mat4.create(); 
var cameraPos, centerOfInterest, viewUp;
var fov, aspectRatio, nearPlaneDis, farPlaneDis;
var Z_angle = 0.0;
var scaling = 1.0;

function setMatrixUniforms(matrix) {
    gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, matrix);
    gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, vMatrix);
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);

    //Set Normal Matrix
    mat4.identity(nMatrix);
    nMatrix = mat4.multiply(nMatrix, vMatrix);
    nMatrix = mat4.multiply(nMatrix, matrix);
    nMatrix = mat4.inverse(nMatrix);
    nMatrix = mat4.transpose(nMatrix);

    gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, nMatrix);
}

//given
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

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
///////////////////////////////////////////////////////////////
var panCamera = 0.0;

//draws whole scene
function drawScene() {
    var Mstack = new Array();
    var model = mat4.create();
    mat4.identity(model);
    var model2 = mat4.create();
    mat4.identity(model2);

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    pMatrix = mat4.perspective(fov, aspectRatio, nearPlaneDis, farPlaneDis, pMatrix);  

    mat4.identity(vMatrix);
    vMatrix = mat4.rotate(vMatrix, degToRad(panCamera), [0, 0, 1]);
    var tempView = mat4.create();
    tempView = mat4.lookAt(cameraPos, [-centerOfInterestData.x, -centerOfInterestData.y, -centerOfInterestData.z], viewUp, tempView);	// set up the view matrix
    vMatrix = mat4.multiply(vMatrix, tempView);

    mat4.identity(mMatrix);

    console.log('Z angle = ' + Z_angle);
    mMatrix = mat4.rotate(mMatrix, degToRad(Z_angle), [0, 1, 1]);   
    console.log("scaling = " + scaling);
    mMatrix = mat4.scale(mMatrix, [scaling, scaling, scaling]);
    model = mat4.multiply(model, mMatrix);


    //defined below, interactable object
    drawRobot(model);

    //defined below, static objects
    model2 = mat4.multiply(model2, mMatrix);
    drawBackground(model2, mMatrix);

}

//draws four static objects to make backgound interesting
function drawBackground(model2, mMatrix) {
    mMatrix = mat4.scale(mMatrix, [scaling, scaling, scaling]);
    model2 = mat4.multiply(model2, mMatrix);
    model2 = mat4.translate(model2, [1.5, 1.5, -1]);
    model2 = mat4.multiply(model2, headMatrix);
    model2 = mat4.scale(model2, [0.75, 0.75, 0.75]);
    drawSphere(model2);

    model2 = mat4.identity(model2);
    model2 = mat4.multiply(model2, mMatrix);

    model2 = mat4.multiply(model2, mMatrix);
    model2 = mat4.translate(model2, [-1.5, 1.5, -10]);
    model2 = mat4.multiply(model2, headMatrix);
    model2 = mat4.scale(model2, [0.75, 0.75, 0.75]);
    drawUpArmCube(model2);

    model2 = mat4.identity(model2);
    model2 = mat4.multiply(model2, mMatrix);

    model2 = mat4.multiply(model2, mMatrix);
    model2 = mat4.translate(model2, [-1.5, -2.5, -25]);
    model2 = mat4.multiply(model2, headMatrix);
    model2 = mat4.scale(model2, [0.75, 0.75, 0.75]);
    drawCylinder(model2);


    model2 = mat4.identity(model2);
    model2 = mat4.multiply(model2, mMatrix);

    model2 = mat4.multiply(model2, mMatrix);
    model2 = mat4.translate(model2, [1.5, -2.5, -40]);
    model2 = mat4.multiply(model2, headMatrix);
    model2 = mat4.scale(model2, [0.75, 0.75, 0.75]);
    drawCube(model2);
}

///////////////////////////////////////////////////////////////////////////
// Draw Helper method for Robot
// Uses push/pop to make the parts together
// uses translation/rotation to create joints for the arms to move around
///////////////////////////////////////////////////////////////////////////

function drawRobot(model) {

    //set up and draw body: Cube
    PushMatrix(model);
    model = mat4.multiply(model, bodyMatirx);
    model = mat4.translate(model, [robotTranslate.x, robotTranslate.y, robotTranslate.z]);
    
    
    drawCube(model);

    //set up and draw Head using model to joint: Sphere
    PushMatrix(model);
    model = mat4.translate(model, [0, 0.4, 0]);
    model = mat4.multiply(model, headMatrix);
    PushMatrix(model);
    model = mat4.scale(model, [0.75, 1, 0.75]);
    drawSphere(model);

    //pop because pushed twice, don't want other things to include head when moving
    model = PopMatrix();
    model = PopMatrix();



    //set up and draw left arm: two parts one cube one cylinder
    PushMatrix(model);
    model = mat4.translate(model, [0.25, (0.25 / 2), 0]);
    //joint
    model = mat4.translate(model, [leftArmTranslate.x, leftArmTranslate.y, leftArmTranslate.z]);
    model = mat4.scale(model, [scaleLeftArm, scaleLeftArm, scaleLeftArm]);
    model = mat4.rotate(model, degToRad(rotateLeftArm), [0, 0, 1]);

    model = mat4.multiply(model, leftArmMatrix);
    PushMatrix(model);
    model = mat4.scale(model, [1, 0.25, 0.25]);
    model = mat4.rotate(model, degToRad(90), [1, 0, 0]);
    drawUpArmCube(model);
    model = PopMatrix(model);

    //Draw leftLowArm: cylinder
    PushMatrix(model);
    model = mat4.translate(model, [0.38, 0.2, 0]);
    //joint
    model = mat4.translate(model, [leftLowArmTranslate.x, leftLowArmTranslate.y, leftLowArmTranslate.z]);
    model = mat4.scale(model, [scaleLeftLowArm, scaleLeftLowArm, scaleLeftLowArm]);
    model = mat4.rotate(model, degToRad(rotateLeftLowArm), [0, 0, 1]);
    model = mat4.multiply(model, leftLowArmMatrix);
    PushMatrix(model);
    model = mat4.scale(model, [2, 0.25, 0.25]);
    model = mat4.rotate(model, degToRad(90), [0, 1, 0]);

    drawCylinder(model);
    model = PopMatrix();
    model = PopMatrix();
    model = PopMatrix();

    //set up and draw right arm: two parts one cube one cylinder
    PushMatrix(model);
    model = mat4.translate(model, [-0.25, (0.25 / 2), 0]);
    
    //joint
    model = mat4.translate(model, [rightArmTranslate.x, rightArmTranslate.y, rightArmTranslate.z]);
    model = mat4.scale(model, [scaleRightArm, scaleRightArm, scaleRightArm]);

    model = mat4.rotate(model, degToRad(rotateRightArm), [0, 0, 1]);
    model = mat4.multiply(model, rightArmMatrix);
    PushMatrix(model);
    model = mat4.scale(model, [1, 0.25, 0.25]);
    model = mat4.rotate(model, degToRad(90), [1, 0, 0]);
    drawUpArmCube(model);
    model = PopMatrix();
   
    //Draw right low arm: cylinder
    PushMatrix(model);
    model = mat4.translate(model, [-0.38, 0.2, 0]);
    //joint
    model = mat4.translate(model, [rightLowArmTranslate.x, rightLowArmTranslate.y, rightLowArmTranslate.z]);
    model = mat4.scale(model, [scaleRightLowArm, scaleRightLowArm, scaleRightLowArm]);
    model = mat4.rotate(model, degToRad(rotateRightLowArm), [0, 0, 1]);
    model = mat4.multiply(model, rightLowArmMatrix);
    PushMatrix(model);
    model = mat4.scale(model, [2, 0.25, 0.25]);
    model = mat4.rotate(model, degToRad(90), [0, 1, 0]);

    drawCylinder(model);
    model = PopMatrix();
    model = PopMatrix();
    model = PopMatrix();


}

/////////////////////////////////////////////////////////////////////////
// drawing helper method for the cubes
// binds buffers to appropriate ones for this shape/color
/////////////////////////////////////////////////////////////////////////

function drawCube(matrix) {
    setMatrixUniforms(matrix);   

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // draw elementary arrays - triangle indices 
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

/////////////////////////////////////////////////////////////////////////
// drawing helper method for the cubes
// binds buffers to appropriate ones for this shape/color
// specifically for upper arm object to add diferent color
/////////////////////////////////////////////////////////////////////////
function drawUpArmCube(matrix) {
    setMatrixUniforms(matrix);   

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeUpArmVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeUpArmVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeUpArmVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeUpArmVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeUpArmVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeUpArmVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // draw elementary arrays - triangle indices 
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeUpArmVertexIndexBuffer);
    gl.drawElements(gl.TRIANGLES, cubeUpArmVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

/////////////////////////////////////////////////////////////////////////
// drawing helper method for the cylinders
// binds buffers to appropriate ones for this shape/color
/////////////////////////////////////////////////////////////////////////
function drawCylinder(matrix) {
    setMatrixUniforms(matrix);   

    gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cylinderVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cylinderTopBotVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cylinderTopBotVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cylinderVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, cylinderVertexPositionBuffer.numTopItems);
    gl.drawArrays(gl.TRIANGLE_FAN, cylinderVertexPositionBuffer.numTopItems, cylinderVertexPositionBuffer.numBotItems);

    gl.bindBuffer(gl.ARRAY_BUFFER, cylinderBodyVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cylinderBodyVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderBodyIndexBuffer);
    gl.drawElements(gl.TRIANGLE_STRIP, cylinderBodyIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

/////////////////////////////////////////////////////////////////////////
// drawing helper method for the spheres
// binds buffers to appropriate ones for this shape/color
/////////////////////////////////////////////////////////////////////////

function drawSphere(matrix) {
    setMatrixUniforms(matrix);   

    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, sphereVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndexBuffer);
    gl.drawElements(gl.TRIANGLE_STRIP, sphereIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    gl.drawElements(gl.TRIANGLE_FAN, sphereIndexBuffer.botOffset - sphereIndexBuffer.topOffset, gl.UNSIGNED_SHORT, 2 * sphereIndexBuffer.topOffset);
    gl.drawElements(gl.TRIANGLE_FAN, sphereIndices.length - sphereIndexBuffer.botOffset, gl.UNSIGNED_SHORT, 2 * sphereIndexBuffer.botOffset);
}

///////////////////////////////////////////////////////////////

var lastMouseX = 0, lastMouseY = 0;

///////////////////////////////////////////////////////////////

function onDocumentMouseDown(event) {
    console.log(event.button);
    event.preventDefault();
    if (event.button == 0) {
        console.log("left button pressed");
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('mouseup', onDocumentMouseUp, false);
        document.addEventListener('mouseout', onDocumentMouseOut, false);
    } else if (event.button == 2) {
        console.log("right mouse button pressed");
        document.addEventListener('mousemove', onDocumentMouseMoveScale, false);
        document.addEventListener('mouseup', onDocumentMouseUpScale, false);
        document.addEventListener('mouseout', onDocumentMouseOutScale, false);
    }
    var mouseX = event.clientX;
    var mouseY = event.clientY;

    lastMouseX = mouseX;
    lastMouseY = mouseY;

}

function onDocumentMouseMoveScale(event) {
    var mouseX = event.clientX;

    var diffX = mouseX - lastMouseX;

    scaling = scaling + diffX / 5;

    lastMouseX = mouseX;
    drawScene();
}

function onDocumentMouseMove(event) {
    var mouseX = event.clientX;

    var diffX = mouseX - lastMouseX;

    Z_angle = Z_angle + diffX / 5;

    lastMouseX = mouseX;
    drawScene();
}

function onDocumentMouseUp(event) {
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);
}

function onDocumentMouseUpScale(event) {
    document.removeEventListener('mousemove', onDocumentMouseMoveScale, false);
    document.removeEventListener('mouseup', onDocumentMouseUpScale, false);
    document.removeEventListener('mouseout', onDocumentMouseOutScale, false);
}

function onDocumentMouseOut(event) {
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);
}

function onDocumentMouseOutScale(event) {
    document.removeEventListener('mousemove', onDocumentMouseMoveScale, false);
    document.removeEventListener('mouseup', onDocumentMouseUpScale, false);
    document.removeEventListener('mouseout', onDocumentMouseOutScale, false);
}

var robotTranslate = { x: 0.0, y: 0.0, z: 0.0 };
var leftArmTranslate = { x: 0.0, y: 0.0, z: 0.0 };
var leftLowArmTranslate = { x: 0.0, y: 0.0, z: 0.0 };
var rightArmTranslate = { x: 0.0, y: 0.0, z: 0.0 };
var rightLowArmTranslate = { x: 0.0, y: 0.0, z: 0.0 };
function onKeyDown(event) {
    console.log(event.keyCode);
    switch (event.keyCode) {
        case 70://Foward
            console.log("entered f");
            robotTranslate.z = robotTranslate.z + 0.1;
            break;
        case 66://Back
            console.log("entered b");
            robotTranslate.z = robotTranslate.z - 0.1;
            break;
        case 76://Left
            console.log("entered l");
            robotTranslate.x = robotTranslate.x + 0.1;
            break;
        case 82://Right
            console.log("entered r");
            robotTranslate.x = robotTranslate.x - 0.1;
            break;
        case 81://Foward
            if (!event.shiftKey) {
                console.log("entered q");
                rightArmTranslate.z = rightArmTranslate.z + 0.1;
            } else {
                console.log("entered Q");
                rightLowArmTranslate.z = rightLowArmTranslate.z + 0.1;
            }
            break;
        case 65://Back
            if (!event.shiftKey) {
                console.log("entered a");
                rightArmTranslate.z = rightArmTranslate.z - 0.1;
            } else {
                console.log("entered A");
                rightLowArmTranslate.z = rightLowArmTranslate.z - 0.1;
            }
            break;
        case 87://Left
            if (!event.shiftKey) {
                console.log("entered w");
                rightArmTranslate.x = rightArmTranslate.x - 0.1;
            } else {
                console.log("entered W");
                rightLowArmTranslate.x = rightLowArmTranslate.x + 0.1;
            }
            break;
        case 83://Right
            if (!event.shiftKey) {
                console.log("entered s");
                rightArmTranslate.x = rightArmTranslate.x + 0.1;
            } else {
                console.log("entered S");
                rightLowArmTranslate.x = rightLowArmTranslate.x - 0.1;
            }
            break;
        case 85://Foward
            if (!event.shiftKey) {
                console.log("entered u");
                leftArmTranslate.z = leftArmTranslate.z + 0.1;
            } else {
                console.log("entered U");
                leftLowArmTranslate.z = leftLowArmTranslate.z + 0.1;
            }
            break;
        case 74://Back
            if (!event.shiftKey) {
                console.log("entered j");
                leftArmTranslate.z = leftArmTranslate.z - 0.1;
            } else {
                console.log("entered J");
                leftLowArmTranslate.z = leftLowArmTranslate.z - 0.1;
            }
            break;
        case 75://Left
            if (!event.shiftKey) {
                console.log("entered k");
                leftArmTranslate.x = leftArmTranslate.x + 0.1;
            } else {
                console.log("entered K");
                leftLowArmTranslate.x = leftLowArmTranslate.x + 0.1;
            }
            break;
        case 73://Right
            if (!event.shiftKey) {
                console.log("entered i");
                leftArmTranslate.x = leftArmTranslate.x - 0.1;
            } else {
                console.log("entered I");
                leftLowArmTranslate.x = leftLowArmTranslate.x - 0.1;
            }
            break;
        default:
            break;
    }
    drawScene();
}

///////////////////////////////////////////////////////////////
function webGLStart() {
    var canvas = document.getElementById("lab03-canvas");

    initGL(canvas);
    initShaders();
    setUpCamera();
    initalizeShaderProgram();
    initBuffers();
    initRobotMatrices();

    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    document.addEventListener('mousedown', onDocumentMouseDown,
        false);
    document.addEventListener('keydown', onKeyDown, false);

    drawScene();
}

function initalizeShaderProgram() {
    gl.enable(gl.DEPTH_TEST);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute)

    shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");
    shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");

}
//////////////////////////////////
var bodyMatirx, headMatrix, leftArmMatrix, rightArmMatrix, leftLowArmMatrix, rightLowArmMatrix, leftLegMatrix, rightLegMatrix;
function initRobotMatrices() {
    bodyMatirx = mat4.create();
    mat4.identity(bodyMatirx);

    headMatrix = mat4.create();
    mat4.identity(headMatrix);
    headMatrix = mat4.translate(headMatrix, [0.0, -(0.5), 0.0]);
    headMatrix = mat4.inverse(headMatrix);

    leftArmMatrix = mat4.create();
    mat4.identity(leftArmMatrix);
    leftArmMatrix = mat4.translate(leftArmMatrix, [-0.5, 0, 0]);
    leftArmMatrix = mat4.inverse(leftArmMatrix);

    leftLowArmMatrix = mat4.create();
    mat4.identity(leftLowArmMatrix);
    leftLowArmMatrix = mat4.translate(leftLowArmMatrix, [-(0.5 * 0.75) / 2, 0, 0]);
    leftLowArmMatrix = mat4.inverse(leftLowArmMatrix);

    rightArmMatrix = mat4.create();
    mat4.identity(rightArmMatrix);
    rightArmMatrix = mat4.translate(rightArmMatrix, [0.5, 0, 0]);
    rightArmMatrix = mat4.inverse(rightArmMatrix);

    rightLowArmMatrix = mat4.create();
    mat4.identity(rightLowArmMatrix);
    rightLowArmMatrix = mat4.translate(rightLowArmMatrix, [(0.5 * 0.75) / 2, 0, 0]);
    rightLowArmMatrix = mat4.inverse(rightLowArmMatrix);

    leftLegMatrix = mat4.create();
    mat4.identity(leftLegMatrix);
    leftLegMatrix = mat4.translate(leftLegMatrix, [0, 0.25, 0]);
    leftLegMatrix = mat4.inverse(leftLegMatrix);

    rightLegMatrix = mat4.create();
    mat4.identity(rightLegMatrix);
    rightLegMatrix = mat4.translate(rightLegMatrix, [0, 0.25, 0]);
    rightLegMatrix = mat4.inverse(rightLegMatrix);
}

//////////////////////////////////
var cameraPosData = { x: 0, y: 0, z: 0 }, centerOfInterestData = { x: 0, y: 0, z: 0 };
function setUpCamera() {
    //Set up camera
    aspectRatio = gl.canvas.width / gl.canvas.height;
    fov = 60; 
    nearPlaneDis = 1;
    farPlaneDis = 50;
    cameraPosData.z = 5.0;
    cameraPos = [cameraPosData.x, cameraPosData.y, cameraPosData.z];
    centerOfInterest = [centerOfInterestData.x, centerOfInterestData.y, centerOfInterestData.z];
    viewUp = [0.0, 1.0, 0.0];
}

//////////////////////////////////

function translateCamera(direction) {
    switch (direction) {
        case 1:
            console.log("up");
            cameraPosData.y = cameraPosData.y + 0.1;
            cameraPos = [cameraPosData.x, cameraPosData.y, cameraPosData.z];
            console.log(cameraPos);
            break;
        case 2:
            console.log("down");
            cameraPosData.y = cameraPosData.y - 0.1;
            cameraPos = [cameraPosData.x, cameraPosData.y, cameraPosData.z];
            console.log(cameraPos);
            break;
        case 3:
            console.log("left");
            cameraPosData.x = cameraPosData.x - 0.1;
            cameraPos = [cameraPosData.x, cameraPosData.y, cameraPosData.z];
            console.log(cameraPos);
            break;
        case 4:
            console.log("right");
            cameraPosData.x = cameraPosData.x + 0.1;
            cameraPos = [cameraPosData.x, cameraPosData.y, cameraPosData.z];
            console.log(cameraPos);
            break;
        default:
            break;
    }
    drawScene();
}

function translateCOI(direction) {
    switch (direction) {
        case 1:
            console.log("up");
            centerOfInterestData.y = centerOfInterestData.y - 0.1;
            centerOfInterest = [centerOfInterestData.x, centerOfInterestData.y, centerOfInterestData.z];
            console.log(centerOfInterest);
            break;
        case 2:
            console.log("down");
            centerOfInterestData.y = centerOfInterestData.y + 0.1;
            centerOfInterest = [centerOfInterestData.x, centerOfInterestData.y, centerOfInterestData.z];
            console.log(centerOfInterest);
            break;
        case 3:
            console.log("left");
            centerOfInterestData.x = centerOfInterestData.x + 0.1;
            centerOfInterest = [centerOfInterestData.x, centerOfInterestData.y, centerOfInterestData.z];
            console.log(centerOfInterest);
            break;
        case 4:
            console.log("right");
            centerOfInterestData.x = centerOfInterestData.x - 0.1;
            centerOfInterest = [centerOfInterestData.x, centerOfInterestData.y, centerOfInterestData.z];
            console.log(centerOfInterest);
            break;
        default:
            break;
    }
    drawScene();
}

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

var rotateLeftArm = 0.0;
var rotateRightArm = 0.0;
var rotateLeftLowArm = 90.0;
var rotateRightLowArm = -90.0;
function rotateBody(bodyPart) {
    switch (bodyPart) {
        case 1:
            rotateLeftArm = rotateLeftArm - 15;
            break;
        case 2:
            rotateLeftArm = rotateLeftArm + 15;
            break;
        case 3:
            rotateRightArm = rotateRightArm - 15;
            break;
        case 4:
            rotateRightArm = rotateRightArm + 15;
            break;
        case 5:
            rotateLeftLowArm = rotateLeftLowArm - 15;
            break;
        case 6:
            rotateLeftLowArm = rotateLeftLowArm + 15;
            break;
        case 7:
            rotateRightLowArm = rotateRightLowArm - 15;
            break;
        case 8:
            rotateRightLowArm = rotateRightLowArm + 15;
            break;
        default:
            break;
    }
    drawScene();
}

var scaleLeftArm = 1.0;
var scaleRightArm = 1.0;
var scaleLeftLowArm = 1.0;
var scaleRightLowArm = 1.0;
function scaleBody(bodyPart) {
    switch (bodyPart) {
        case 1:
            scaleLeftArm = scaleLeftArm + 0.05;
            break;
        case 2:
            scaleLeftArm = scaleLeftArm - 0.05;
            break;
        case 3:
            scaleRightArm = scaleRightArm + 0.05;
            break;
        case 4:
            scaleRightArm = scaleRightArm - 0.05;
            break;
        case 5:
            scaleLeftLowArm = scaleLeftLowArm + 0.05;
            break;
        case 6:
            scaleLeftLowArm = scaleLeftLowArm - 0.05;
            break;
        case 7:
            scaleRightLowArm = scaleRightLowArm + 0.05;
            break;
        case 8:
            scaleRightLowArm = scaleRightLowArm - 0.05;
            break;
        default:
            break;
    }
    drawScene();
}