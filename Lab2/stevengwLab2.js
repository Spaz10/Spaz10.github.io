
var gl;
var shaderProgram;
var draw_type = 2;
var which_object = 1;
var mat1rotate, mat2rotate, mat3rotate;

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
// Global Vars
///////////////////////////////////////////////////////////

//for squares
var squareVertexPositionBuffer;
var squareVertexColorBuffer;




//lines for squares
var lineVertexPositionBuffer;
var lineVertexColorBuffer;

//for circle
var circleVertexPositionBuffer;
var circleVertexColorBuffer;

//for ball
var ballVertexPositionBuffer;
var ballVertexColorBuffer;

//for solid circle
//for ball
var solidVertexPositionBuffer;
var solidVertexColorBuffer;


////////////////    Initialize VBO  ////////////////////////

function initBuffers() {

    squareVertexPositionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);


    vertices = [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        -0.5, -0.5, 0.0,
        0.5, -0.5, 0.0,
    ];

    l_vertices = [
        0.0, 0.0, 0.0,
        0.7, 0.0, 0.0,
        0.0, 0.0, 0.0,
        0.0, 0.7, 0.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVertexPositionBuffer.itemSize = 3;
    squareVertexPositionBuffer.numItems = 4;

    lineVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(l_vertices), gl.STATIC_DRAW);
    lineVertexPositionBuffer.itemSize = 3;
    lineVertexPositionBuffer.numItems = 4;

    squareVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
    var colors = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    squareVertexColorBuffer.itemSize = 4;
    squareVertexColorBuffer.numItems = 4;


    //helper methods declared later
    initCircle(36);
    initBall(36);
    initSolid(36);
}

///////////////////////////////////////////////////////////////////
// Init helper method for circle/Head of robot
//////////////////////////////////////////////////////////////////

function initCircle(k) {

    var anglePerTriangle = 2 * Math.PI / k;
    var radius = 0.5;

    //buffer for vertices
    circleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, circleVertexPositionBuffer);

    //temporary arrays for calculating color and vertices
    verticesCircle = [0, 0, 0];
    var color = [1, 0, 0, 1];

    for (var i = 0; i < k + 1; i++) {

        var thisAngle = (i + 1) * anglePerTriangle;

        //calculations given in class for finding vertices
        var xpos = radius * (Math.cos(Math.PI - thisAngle));
        var ypos = radius * Math.sin(Math.PI - thisAngle);

        verticesCircle.push(xpos, ypos, 0);

        //slight math for determining which side is which color
        if ((i) < ((k + 2) / 2) - 1) {
            color.push(1, 0, 0, 1);
        } else {
            color.push(0, 0, 1, 1);
        }

    }

    console.log(verticesCircle);


    //bind the buffer and add the data to it in the correct order
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesCircle), gl.STATIC_DRAW);
    circleVertexPositionBuffer.itemSize = 3;
    circleVertexPositionBuffer.numItems = k + 2;

    circleVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, circleVertexColorBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
    circleVertexColorBuffer.itemSize = 4;
    circleVertexColorBuffer.numItems = k + 2;
}

/////////////////////////////////////////////////////////////////////////
// Init helper method for ball -  similar to circle init method
////////////////////////////////////////////////////////////////////////

function initBall(k) {

    var anglePerTriangle = 2 * Math.PI / k;
    var radius = 0.5;

    ballVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ballVertexPositionBuffer);

    verticesball = [0, 0, 0];
    var color = [1, 0, 0, 1];

    for (var i = 0; i < k + 1; i++) {
        var thisAngle = (i + 1) * anglePerTriangle;

        var xpos = radius * (Math.cos(Math.PI - thisAngle));
        var ypos = radius * Math.sin(Math.PI - thisAngle);

        verticesball.push(xpos, ypos, 0);

        //adds color in order/pattern to create radiating stripes
        if ((i % 3) == 1) {
            color.push(1, 0, 0, 1);
        } else if ((i % 3) == 2) {
            color.push(1, 1, 1, 1);
        }
        else color.push(0, 1, 0, 1);
    }

    console.log(verticesball);


    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesball), gl.STATIC_DRAW);
    ballVertexPositionBuffer.itemSize = 3;
    ballVertexPositionBuffer.numItems = k + 2;

    ballVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ballVertexColorBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
    ballVertexColorBuffer.itemSize = 4;
    ballVertexColorBuffer.numItems = k + 2;
}



/////////////////////////////////////////////////////////////////////////
// Init helper method for solid circle - similar to circle init method
////////////////////////////////////////////////////////////////////////

function initSolid(k) {

    var anglePerTriangle = 2 * Math.PI / k;
    var radius = 0.5;

    solidVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, solidVertexPositionBuffer);

    verticesSolid = [0, 0, 0];
    var color = [1, 0, 0, 1];

    for (var i = 0; i < k + 1; i++) {
        var thisAngle = (i + 1) * anglePerTriangle;

        var xpos = radius * (Math.cos(Math.PI - thisAngle));
        var ypos = radius * Math.sin(Math.PI - thisAngle);

        verticesSolid.push(xpos, ypos, 0);

        //pushes only one color for a solid colored circle
        color.push(1, 0, 0, 1);

    }

    console.log(verticesCircle);


    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesCircle), gl.STATIC_DRAW);
    solidVertexPositionBuffer.itemSize = 3;
    solidVertexPositionBuffer.numItems = k + 2;

    solidVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, solidVertexColorBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
    solidVertexColorBuffer.itemSize = 4;
    solidVertexColorBuffer.numItems = k + 2;
}

//////////////////////////////////////////////////
///////////////////////////////////////////////////////////////


var mvBodyMatrix, mvRightUpArmMatrix, mvRightLowArmMatrix, mvHeadMatrix, mvLeftUpArmMatrix, mvLeftLowArmMatrix;
var Xtranslate = 0.0, Ytranslate = 0.0;

function setMatrixUniforms(matrix) {
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, matrix);
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

///////////////////////////////////////////////////////


function PushMatrix(stack, matrix) {
    var copy = mat4.create();
    mat4.set(matrix, copy);
    stack.push(copy);
}

function PopMatrix(stack, copy) {
    if (stack.length == 0) {
        throw "Invalid popMatrix!";
    }
    copy = stack.pop();
}

var mvMatrixStack = [];


function draw_square(matrix) {

    setMatrixUniforms(matrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, squareVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, squareVertexPositionBuffer.numItems);


    gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, lineVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, squareVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINES, 0, lineVertexPositionBuffer.numItems);


}

////////////////////////////////////////////////////////////////////////////////////
// Draw crcle method to help the draw scene method
///////////////////////////////////////////////////////////////////////////////////


function draw_circle(matrix) {

    setMatrixUniforms(matrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, circleVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, circleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, circleVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, circleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, circleVertexPositionBuffer.numItems);


}

//////////////////////////////////////////////////////////////////////////////////////
// Draw ball helper method to help draw scene method
/////////////////////////////////////////////////////////////////////////////////////

function draw_ball(matrix) {

    setMatrixUniforms(matrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, ballVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, ballVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, ballVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, ballVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, ballVertexPositionBuffer.numItems);


}

/////////////////////////////////////////////////////////////////////////////////////
// Draw solid helper method for drawing the solid colored circle
////////////////////////////////////////////////////////////////////////////////////

function draw_solid(matrix) {

    setMatrixUniforms(matrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, solidVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, solidVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, solidVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, solidVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, solidVertexPositionBuffer.numItems);


}

////////////////////////////////////////////////////////////////////////////////////////
// Draw helper method for background/static drawBackgroungObjects separate from robot
////////////////////////////////////////////////////////////////////////////////////////

function drawBackgroungObjects() {

    //draws half and half circle
    var model2 = mat4.create();
    mat4.identity(model2);
    mat4.translate(model2, [0.5, -0.5, 0]);
    mat4.scale(model2, [0.5, 0.5, 0.5]);

    draw_circle(model2);


    //draws the static background square
    var model3 = mat4.create();
    mat4.identity(model3);
    mat4.translate(model3, [-0.6, -0.5, 0]);
    mat4.scale(model3, [0.5, 0.5, 0.5]);
    draw_square(model3);

    //draws the static solid colored circle
    var model4 = mat4.create();
    mat4.identity(model4);
    mat4.translate(model4, [0, -0.5, 0]);
    mat4.scale(model4, [0.3, 0.3, 0.3]);

    draw_solid(model4);


}

///////////////////////////////////////////////////////////////////////

function drawScene() {

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    drawBackgroungObjects();


    var Mstack = [];
    var model = mat4.create();
    mat4.identity(model);

    //Head
    model = mat4.multiply(model, mvBodyMatrix);
    draw_ball(model);


    //body
    model = mat4.multiply(model, mvHeadMatrix);
    draw_square(model);

    Mstack.push(model);
    console.log("push matrix");

    //right arm
    model = mat4.multiply(model, mvRightUpArmMatrix);
    draw_square(model);

    model = Mstack.pop();
    model = mat4.multiply(model, mvRightLowArmMatrix);
    draw_square(model);


    //left arm
    Mstack.push(model);
    console.log("push matrix");


    model = mat4.multiply(model, mvLeftUpArmMatrix);
    draw_square(model);

    model = Mstack.pop();
    model = mat4.multiply(model, mvLeftLowArmMatrix);
    draw_square(model);




}


///////////////////////////////////////////////////////////////

var lastMouseX = 0, lastMouseY = 0;


///////////////////////////////////////////////////////////////

function onDocumentMouseDown(event) {
    event.preventDefault();
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('mouseout', onDocumentMouseOut, false);
    var mouseX = event.clientX;
    var mouseY = event.clientY;

    lastMouseX = mouseX;
    lastMouseY = mouseY;

}

function onDocumentMouseMove(event) {
    var mouseX = event.clientX;
    var mouseY = event.ClientY;

    var diffX = mouseX - lastMouseX;
    var diffY = mouseY - lastMouseY;

    console.log("rotate" + degToRad(diffX / 5.0));
    mat1rotate = degToRad(diffX / 5.0);
    if (which_object == 1)

        mvBodyMatrix = mat4.rotate(mvBodyMatrix, degToRad(diffX / 5.0), [0, 0, 1]);
    if (which_object == 2)
        mvRightUpArmMatrix = mat4.rotate(mvRightUpArmMatrix, degToRad(diffX / 5.0), [0, 0, 1]);
    if (which_object == 3)
        mvRightLowArmMatrix = mat4.rotate(mvRightLowArmMatrix, degToRad(diffX / 5.0), [0, 0, 1]);
    if (which_object == 4)
        mvLeftUpArmMatrix = mat4.rotate(mvLeftUpArmMatrix, degToRad(diffX / 5.0), [0, 0, 1]);
    if (which_object == 5)
        mvLeftLowArmMatrix = mat4.rotate(mvLeftLowArmMatrix, degToRad(diffX / 5.0), [0, 0, 1]);


    lastMouseX = mouseX;
    lastMouseY = mouseY;

    drawScene();
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

///////////////////////////////////////////////////////////////////////////////
// Added if states for arms/body pieces
//////////////////////////////////////////////////////////////////////////////

function onKeyDown(event) {

    console.log(event.keyCode);
    switch (event.keyCode) {
        case 76:

            console.log('enter r');
            if (which_object == 1)
                mvBodyMatrix = mat4.translate(mvBodyMatrix, [0.1, 0, 0]);
            if (which_object == 2)
                mvRightUpArmMatrix = mat4.translate(mvRightUpArmMatrix, [0.1, 0, 0]);
            if (which_object == 3)
                mvRightLowArmMatrix = mat4.translate(mvRightLowArmMatrix, [0.1, 0, 0]);
            if (which_object == 4)
                mvLeftUpArmMatrix = mat4.translate(mvLeftUpArmMatrix, [0.1, 0, 0]);

            if (which_object == 5)
                mvLeftLowArmMatrix = mat4.translate(mvLeftLowArmMatrix, [0.1, 0, 0]);



            break;
        case 82:

            console.log('enter l');
            if (which_object == 1)
                mvBodyMatrix = mat4.translate(mvBodyMatrix, [-0.1, 0, 0]);
            if (which_object == 2)
                mvRightUpArmMatrix = mat4.translate(mvRightUpArmMatrix, [-0.1, 0, 0]);
            if (which_object == 3)
                mvRightLowArmMatrix = mat4.translate(mvRightLowArmMatrix, [-0.1, 0, 0]);
            if (which_object == 4)
                mvLeftUpArmMatrix = mat4.translate(mvLeftUpArmMatrix, [-0.1, 0, 0]);

            if (which_object == 5)
                mvLeftLowArmMatrix = mat4.translate(mvLeftLowArmMatrix, [-0.1, 0, 0]);


            break;
        case 70:

            console.log('enter f');
            if (which_object == 1)
                mvBodyMatrix = mat4.translate(mvBodyMatrix, [0.0, 0.1, 0]);
            if (which_object == 2)
                mvRightUpArmMatrix = mat4.translate(mvRightUpArmMatrix, [0.0, 0.1, 0]);
            if (which_object == 3)
                mvRightLowArmMatrix = mat4.translate(mvRightLowArmMatrix, [0.0, 0.1, 0]);
            if (which_object == 4)
                mvLeftUpArmMatrix = mat4.translate(mvLeftUpArmMatrix, [0.0, 0.1, 0]);

            if (which_object == 5)
                mvLeftLowArmMatrix = mat4.translate(mvLeftLowArmMatrix, [0.0, 0.1, 0]);


            break;
        case 66:


            console.log('enter b');
            if (which_object == 1)
                mvBodyMatrix = mat4.translate(mvBodyMatrix, [0.0, -0.1, 0]);
            if (which_object == 2)
                mvRightUpArmMatrix = mat4.translate(mvRightUpArmMatrix, [0.0, -0.1, 0]);
            if (which_object == 3)
                mvRightLowArmMatrix = mat4.translate(mvRightLowArmMatrix, [0.0, -0.1, 0]);
            if (which_object == 4)
                mvLeftUpArmMatrix = mat4.translate(mvLeftUpArmMatrix, [0.0, -0.1, 0]);
            if (which_object == 5)
                mvLeftLowArmMatrix = mat4.translate(mvLeftLowArmMatrix, [0.0, -0.1, 0]);

            break;
        case 83:
            if (event.shiftKey) {
                console.log('enter S');
                if (which_object == 1)
                    mvBodyMatrix = mat4.scale(mvBodyMatrix, [1.05, 1.05, 1.05]);
                if (which_object == 2) {
                    mvRightUpArmMatrix = mat4.scale(mvRightUpArmMatrix, [1.05, 1.05, 1.05]);
                    SmvRightUpArmMatrix = mat4.translate(mvRightUpArmMatrix, [0.0475, 0, 0]);
                }
                if (which_object == 3)
                    mvRightLowArmMatrix = mat4.scale(mvRightLowArmMatrix, [1.05, 1.05, 1.05]);
                if (which_object == 4)
                    mvLeftUpArmMatrix = mat4.scale(mvLeftUpArmMatrix, [1.05, 1.05, 1.05]);
                if (which_object == 5)
                    mvLeftLowArmMatrix = mat4.scale(mvLeftLowArmMatrix, [1.05, 1.05, 1.05]);
            }
            else {
                console.log('enter s');
                if (which_object == 1)
                    mvBodyMatrix = mat4.scale(mvBodyMatrix, [0.95, 0.95, 0.95]);
                if (which_object == 2) {
                    mvRightUpArmMatrix = mat4.scale(mvRightUpArmMatrix, [0.95, 0.95, 0.95]);
                    SmvRightUpArmMatrix = mat4.translate(mvRightUpArmMatrix, [-0.0525, 0, 0]);
                }

                if (which_object == 3)
                    mvRightLowArmMatrix = mat4.scale(mvRightLowArmMatrix, [0.95, 0.95, 0.95]);
                if (which_object == 4)
                    mvLeftUpArmMatrix = mat4.scale(mvLeftUpArmMatrix, [0.95, 0.95, 0.95]);
                if (which_object == 5)
                    mvLeftLowArmMatrix = mat4.scale(mvLeftLowArmMatrix, [0.95, 0.95, 0.95]);
            }
            break;
    }
    drawScene();
}
///////////////////////////////////////////////////////////////

function webGLStart() {
    var canvas = document.getElementById("code04-canvas");
    initGL(canvas);
    initShaders();

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);


    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.whatever = 4;
    shaderProgram.whatever2 = 3;


    initBuffers();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('keydown', onKeyDown, false);


    //body
    mvBodyMatrix = mat4.create();
    mat4.identity(mvBodyMatrix);
    mvBodyMatrix = mat4.translate(mvBodyMatrix, [0, 0.5, 0]);



    mvHeadMatrix = mat4.create();
    mat4.identity(mvHeadMatrix);
    mvHeadMatrix = mat4.translate(mvHeadMatrix, [0, -1, 0]);


    //right arm

    mvRightUpArmMatrix = mat4.create();
    mat4.identity(mvRightUpArmMatrix);
    mvRightUpArmMatrix = mat4.translate(mvRightUpArmMatrix, [1, 0.25, 0]);


    mvRightLowArmMatrix = mat4.create();
    mat4.identity(mvRightLowArmMatrix);
    mvRightLowArmMatrix = mat4.translate(mvRightLowArmMatrix, [0.6, 1.5, 0]);




    //left arm

    mvLeftUpArmMatrix = mat4.create();
    mat4.identity(mvLeftUpArmMatrix);
    mvLeftUpArmMatrix = mat4.translate(mvLeftUpArmMatrix, [-10.4, -0.35, 0]);


    mvLeftLowArmMatrix = mat4.create();
    mat4.identity(mvLeftLowArmMatrix);
    mvLeftLowArmMatrix = mat4.translate(mvLeftLowArmMatrix, [-0.6, 1.5, 0]);

    //scale

    mvBodyMatrix = mat4.scale(mvBodyMatrix, [0.4, 0.4, 0.4]);
    //mvHeadMatrix = mat4.scale(mvHeadMatrix, [1.25, 1.25, 1.25]);
    mvRightUpArmMatrix = mat4.scale(mvRightUpArmMatrix, [1, 0.25, 0]);
    mvRightLowArmMatrix = mat4.scale(mvRightLowArmMatrix, [0.25, 4, 1]);
    mvLeftUpArmMatrix = mat4.scale(mvLeftUpArmMatrix, [4, 0.25, 0]);
    mvLeftLowArmMatrix = mat4.scale(mvLeftLowArmMatrix, [0.25, 4, 1]);


    drawScene();
}

function BG(red, green, blue) {

    gl.clearColor(red, green, blue, 1.0);
    drawScene();

}

function redraw() {

    mat4.identity(mvBodyMatrix);
    mat4.identity(mvRightUpArmMatrix);
    mat4.identity(mvRightLowArmMatrix);
    mat4.identity(mvLeftUpArmMatrix);
    mat4.identity(mvLeftLowArmMatrix);
    mat4.identity(mvHeadMatrix);


    mvBodyMatrix = mat4.translate(mvBodyMatrix, [0, 0.5, 0]);


    mvHeadMatrix = mat4.translate(mvHeadMatrix, [0, -1, 0]);

    mvRightUpArmMatrix = mat4.translate(mvRightUpArmMatrix, [1, 0.25, 0]);

    mvRightLowArmMatrix = mat4.translate(mvRightLowArmMatrix, [0.6, 1.5, 0]);


    mvLeftUpArmMatrix = mat4.translate(mvLeftUpArmMatrix, [-10.4, -0.35, 0]);

    mvLeftLowArmMatrix = mat4.translate(mvLeftLowArmMatrix, [-0.6, 1.5, 0]);

    //scale

    mvBodyMatrix = mat4.scale(mvBodyMatrix, [0.4, 0.4, 0.4]);
    mvRightUpArmMatrix = mat4.scale(mvRightUpArmMatrix, [1, 0.25, 0]);
    mvRightLowArmMatrix = mat4.scale(mvRightLowArmMatrix, [0.25, 4, 1]);
    mvLeftUpArmMatrix = mat4.scale(mvLeftUpArmMatrix, [4, 0.25, 0]);
    mvLeftLowArmMatrix = mat4.scale(mvLeftLowArmMatrix, [0.25, 4, 1]);


    drawScene();
}

function obj(object_id) {

    which_object = object_id;
    drawScene();

} 
