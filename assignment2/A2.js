/**
 * UBC CPSC 314, Vjan2015
 * Assignment 2 Template
 */

var scene = new THREE.Scene();

// ASSIGNMENT-SPECIFIC API EXTENSION
THREE.Object3D.prototype.setMatrix = function(a) {
  this.matrix=a;
  this.matrix.decompose(this.position,this.quaternion,this.scale);
}

// SETUP RENDERER
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffffff); // white background colour
document.body.appendChild(renderer.domElement);

// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000); // view angle, aspect ratio, near, far
camera.position.set(10,15,40);
camera.lookAt(scene.position); 
scene.add(camera);

// SETUP ORBIT CONTROL OF THE CAMERA
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;

// ADAPT TO WINDOW RESIZE
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);
resize();

// FLOOR WITH CHECKERBOARD 
var floorTexture = new THREE.ImageUtils.loadTexture('images/checkerboard.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(4, 4);

var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
var floorGeometry = new THREE.PlaneBufferGeometry(30, 30);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.1;
floor.rotation.x = Math.PI / 2;
scene.add(floor);

// UNIFORMS
var gemPosition = {type: 'v3', value: new THREE.Vector3(0,5,10)};
var gemRadius = {type: 'f', value: 1.0};

// MATERIALS
var normalMaterial = new THREE.MeshNormalMaterial();
var redMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
var gemMaterial = new THREE.ShaderMaterial({
   uniforms: {
    gemRadius : gemRadius,
  },
});
var whiteMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});

// LOAD SHADERS
var shaderFiles = [
  'glsl/gem.vs.glsl',
  'glsl/gem.fs.glsl',
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
  gemMaterial.vertexShader = shaders['glsl/gem.vs.glsl'];
  gemMaterial.fragmentShader = shaders['glsl/gem.fs.glsl'];
})

// GEOMETRY
var parallelepiped = new THREE.BoxGeometry(4, 6, 4); // centered on origin
var footBox = new THREE.BoxGeometry(1.5, 1, 3);
var sphere = new THREE.SphereGeometry(1, 32, 32); // centered on origin

var elipse = new THREE.SphereGeometry(1, 64, 64); // placed with lowest y point on origin
for (var i = 0; i < elipse.vertices.length; i++)
    elipse.vertices[i].y = (elipse.vertices[i].y + 1) * 1.5; 

var eyesphere = new THREE.SphereGeometry(.3, 32, 32);


var thinCylinder = new THREE.CylinderGeometry(.1, .1, 2, 16); // placed with lowest y point on origin
for (var i = 0; i < thinCylinder.vertices.length; i++)
    thinCylinder.vertices[i].y += 1;


// STATIC MATRICES
var torsoMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,10, 0,0,1,0, 0,0,0,1);
var headMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,3, 0,0,1,0, 0,0,0,1);
var headtorsoMatrix = new THREE.Matrix4().multiplyMatrices(torsoMatrix, headMatrix);

//UpperArm
var rotateLeftMatrix = new THREE.Matrix4().makeRotationZ(Math.PI/2);
var leftUpperArmMatrix = new THREE.Matrix4().set(1,0,0,-2, 0,1,0,2, 0,0,1,0, 0,0,0,1);
var leftUpperArmTorsoMatrix = new THREE.Matrix4().multiplyMatrices(torsoMatrix, leftUpperArmMatrix);
leftUpperArmTorsoMatrix.multiplyMatrices(leftUpperArmTorsoMatrix, rotateLeftMatrix);

var rotateRightMatrix = new THREE.Matrix4().makeRotationZ(-(Math.PI/2));
var rightUpperArmMatrix = new THREE.Matrix4().set(1,0,0,2, 0,1,0,2, 0,0,1,0, 0,0,0,1);
var rightUpperArmTorsoMatrix = new THREE.Matrix4().multiplyMatrices(torsoMatrix, rightUpperArmMatrix);
rightUpperArmTorsoMatrix.multiplyMatrices(rightUpperArmTorsoMatrix, rotateRightMatrix);

//ForeArm
var leftForeArmMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,3, 0,0,1,0, 0,0,0,1);
var leftForeArmUpperMatrix = new THREE.Matrix4().multiplyMatrices(leftUpperArmTorsoMatrix, leftForeArmMatrix);

var rightForeArmMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,3, 0,0,1,0, 0,0,0,1);
var rightForeArmUpperMatrix = new THREE.Matrix4().multiplyMatrices(rightUpperArmTorsoMatrix, rightForeArmMatrix);

//eyes
var leftEyeMatrix = new THREE.Matrix4().set(1,0,0,-.3, 0,1,0,1.9, 0,0,1,.7, 0,0,0,1);
var rightEyeMatrix = new THREE.Matrix4().set(1,0,0,.3, 0,1,0,1.9, 0,0,1,.7, 0,0,0,1);
var leftEyeHeadMatrix = new THREE.Matrix4().multiplyMatrices(headtorsoMatrix, leftEyeMatrix);
var rightEyeHeadMatrix = new THREE.Matrix4().multiplyMatrices(headtorsoMatrix, rightEyeMatrix);

//Upperlegs
var flip = new THREE.Matrix4().makeRotationX(Math.PI);
var leftUpperLegMatrix = new THREE.Matrix4().set(1,0,0,-1.6, 0,1,0,-3, 0,0,1,0, 0,0,0,1);
var leftUpperLegTorsoMatrix = new THREE.Matrix4().multiplyMatrices(torsoMatrix, leftUpperLegMatrix);
leftUpperLegTorsoMatrix.multiplyMatrices(leftUpperLegTorsoMatrix,flip);

var rightUpperLegMatrix = new THREE.Matrix4().set(1,0,0,1.6, 0,1,0,-3, 0,0,1,0, 0,0,0,1);
var rightUpperLegTorsoMatrix = new THREE.Matrix4().multiplyMatrices(torsoMatrix, rightUpperLegMatrix);
rightUpperLegTorsoMatrix.multiplyMatrices(rightUpperLegTorsoMatrix,flip);
//Lowerlegs
var leftLowerLegMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,3, 0,0,1,0, 0,0,0,1);
var leftLowerLegUpperMatrix = new THREE.Matrix4().multiplyMatrices(leftUpperLegTorsoMatrix, leftLowerLegMatrix);

var rightLowerLegMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,3, 0,0,1,0, 0,0,0,1);
var rightLowerLegUpperMatrix = new THREE.Matrix4().multiplyMatrices(rightUpperLegTorsoMatrix, rightLowerLegMatrix);

//foot
var leftFootMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,3.5, 0,0,1,-.5, 0,0,0,1);
var leftFootLowerLegMatrix = new THREE.Matrix4().multiplyMatrices(leftLowerLegUpperMatrix, leftFootMatrix);

var rightFootMatrix = new THREE.Matrix4().set(1,0,0,0, 0,1,0,3.5, 0,0,1,-.5, 0,0,0,1);
var rightFootLowerLegMatrix = new THREE.Matrix4().multiplyMatrices(rightLowerLegUpperMatrix, rightFootMatrix);


// CREATE GEOMETRY
var gem = new THREE.Mesh(sphere, gemMaterial);
scene.add(gem);

var torso = new THREE.Mesh(parallelepiped, normalMaterial);
torso.setMatrix(torsoMatrix)
scene.add(torso);

var head = new THREE.Mesh(elipse, normalMaterial);
head.setMatrix(headtorsoMatrix); 
scene.add(head);

// complete body here

var leftUpperArm = new THREE.Mesh(elipse, normalMaterial);
scene.add(leftUpperArm);

var leftForeArm = new THREE.Mesh(elipse,normalMaterial);
scene.add(leftForeArm);

var rightUpperArm = new THREE.Mesh(elipse, normalMaterial);
scene.add(rightUpperArm);

var rightForeArm = new THREE.Mesh(elipse,normalMaterial);
scene.add(rightForeArm);

var leftUpperLeg = new THREE.Mesh(elipse, normalMaterial);
scene.add(leftUpperLeg);

var rightUpperLeg = new THREE.Mesh(elipse, normalMaterial);
scene.add(rightUpperLeg);

var leftLowerLeg = new THREE.Mesh(elipse, normalMaterial);
scene.add(leftLowerLeg);

var rightLowerLeg = new THREE.Mesh(elipse, normalMaterial);
scene.add(rightLowerLeg);

var leftFoot = new THREE.Mesh(footBox, normalMaterial);
scene.add(leftFoot);

var rightFoot = new THREE.Mesh(footBox, normalMaterial);
scene.add(rightFoot);

var leftEye = new THREE.Mesh(eyesphere, whiteMaterial);
leftEye.setMatrix(leftEyeHeadMatrix);
scene.add(leftEye);

var rightEye = new THREE.Mesh(eyesphere, whiteMaterial);
rightEye.setMatrix(rightEyeHeadMatrix);
scene.add(rightEye);

var leftBeam = new THREE.Mesh(thinCylinder, redMaterial);
leftBeam.setMatrix(leftEyeHeadMatrix);
scene.add(leftBeam);

var rightBeam = new THREE.Mesh(thinCylinder, redMaterial);
rightBeam.setMatrix(rightEyeHeadMatrix);
scene.add(rightBeam);

// MOVE BODY
var clock = new THREE.Clock(true);
var wave = false;

function updateBody() {
  var t = clock.getElapsedTime(); // current time
  var angle = Math.sin(t) * Math.PI/4;
  var c = Math.cos(t) * Math.PI/4;
  var rotationZ = new THREE.Matrix4().makeRotationZ(angle);
  // s = Math.sin(angle);
  // c = Math.cos(angle);
  // var rotationX = new THREE.Matrix4().set(1,0,0,0, 0,c,-s,0, 0,s,c,0, 0,0,0,1);
  // var rotationY = new THREE.Matrix4().set(c,0,s,0, 0,1,0,0, -s,0,c,0, 0,0,0,1);
  // var rotationZ = new THREE.Matrix4().set(c,-s,0,0, s,c,0,0, 0,0,1,0, 0,0,0,1);

  // move elements here
  //arm
  var leftUpperArmRotateMatrix = new THREE.Matrix4().multiplyMatrices(leftUpperArmTorsoMatrix, rotationZ);
  leftUpperArm.setMatrix(leftUpperArmRotateMatrix);
  
  var leftForeUArmMatrix = new THREE.Matrix4().multiplyMatrices(leftUpperArmRotateMatrix, leftForeArmMatrix);
  var leftForeArmRotateMatrix = new THREE.Matrix4().multiplyMatrices(leftForeUArmMatrix, rotationZ);
  leftForeArm.setMatrix(leftForeArmRotateMatrix);

  if (wave == true)
  rotationZ.transpose();
  
  var rightUpperArmRotateMatrix = new THREE.Matrix4().multiplyMatrices(rightUpperArmTorsoMatrix, rotationZ);
  rightUpperArm.setMatrix(rightUpperArmRotateMatrix);
  
  var rightForeUArmMatrix = new THREE.Matrix4().multiplyMatrices(rightUpperArmRotateMatrix, rightForeArmMatrix);
  var rightForeArmRotateMatrix = new THREE.Matrix4().multiplyMatrices(rightForeUArmMatrix, rotationZ);
  rightForeArm.setMatrix(rightForeArmRotateMatrix);
  
  //gem
  gem.setMatrix(new THREE.Matrix4().set(
      gemRadius.value,0,0,gemPosition.value.x,
      0,gemRadius.value,0,gemPosition.value.y,
      0,0,gemRadius.value,gemPosition.value.z,
      0,0,0,1
  ));


  //beam
  xEyeLeft = leftEyeHeadMatrix.elements[12];
  xEyeRight = rightEyeHeadMatrix.elements[12];
  yEye = leftEyeHeadMatrix.elements[13];
  zEye = leftEyeHeadMatrix.elements[14];

  var leftEyePos = new THREE.Vector3(xEyeLeft, yEye, zEye);
  var rightEyePos = new THREE.Vector3(xEyeRight, yEye, zEye);
  var gemPos = new THREE.Vector3(gemPosition.value.x,gemPosition.value.y,gemPosition.value.z);

  var distLeft = leftEyePos.distanceTo(gemPos);
  var distRight = rightEyePos.distanceTo(gemPos);


  var scaleLeftBeamMatrix = new THREE.Matrix4().set(1,0,0,0, 0,distLeft/2,0,0, 0,0,1,0, 0,0,0,1);
  var scaleRightBeamMatrix = new THREE.Matrix4().set(1,0,0,0, 0,distLeft/2,0,0, 0,0,1,0, 0,0,0,1);

  
  var leftRotationY = -Math.atan2((gemPosition.value.z - zEye),(gemPosition.value.x-xEyeLeft));
  var leftRotationZ = -Math.acos((gemPosition.value.y - yEye)/ distLeft);
  var rightRotationY = -Math.atan2((gemPosition.value.z - zEye),(gemPosition.value.x-xEyeRight));
  var rightRotationZ = -Math.acos((gemPosition.value.y - yEye)/ distRight);


  var LRY = new THREE.Matrix4().makeRotationY(leftRotationY); 
  var LRZ = new THREE.Matrix4().makeRotationZ(leftRotationZ); 
  var RRY = new THREE.Matrix4().makeRotationY(rightRotationY); 
  var RRZ = new THREE.Matrix4().makeRotationZ(rightRotationZ); 

  var leftBeamMatrix = new THREE.Matrix4().multiplyMatrices(leftEyeHeadMatrix, LRY);
  leftBeamMatrix.multiplyMatrices(leftBeamMatrix,LRZ);
  leftBeamMatrix.multiplyMatrices(leftBeamMatrix,scaleLeftBeamMatrix);
  leftBeam.setMatrix(leftBeamMatrix);

  var rightBeamMatrix = new THREE.Matrix4().multiplyMatrices(rightEyeHeadMatrix, RRY);
  rightBeamMatrix.multiplyMatrices(rightBeamMatrix,RRZ);
  rightBeamMatrix.multiplyMatrices(rightBeamMatrix,scaleRightBeamMatrix);
  rightBeam.setMatrix(rightBeamMatrix);

  //Upperlegs
  b = -angle;
  
  if (b > 0){
    b=0;
  }
  if (angle > 0){
    angle = 0;
  }
  
  // angle = -Math.abs(angle);
  var rotationA = new THREE.Matrix4().makeRotationX(angle);
  var rotationB = new THREE.Matrix4().makeRotationX(b);
  var rotationNA = new THREE.Matrix4().makeRotationX(-angle);
  var rotationNB = new THREE.Matrix4().makeRotationX(-b);
  
  var leftUpperLegRotateMatrix = new THREE.Matrix4().multiplyMatrices(leftUpperLegTorsoMatrix, rotationA);
  leftUpperLeg.setMatrix(leftUpperLegRotateMatrix);

  
  // var aa22 = new THREE.Matrix4().makeRotationX(b);
  // console.log("b:  " + b);
  // console.log("a:  " + angle);


  var rightUpperLegRotateMatrix = new THREE.Matrix4().multiplyMatrices(rightUpperLegTorsoMatrix, rotationB);
  rightUpperLeg.setMatrix(rightUpperLegRotateMatrix);
  
  //Lowerlegs
  var leftLowerULegMatrix = new THREE.Matrix4().multiplyMatrices(leftUpperLegRotateMatrix, leftLowerLegMatrix);
  var leftLowerLegRotateMatrix = new THREE.Matrix4().multiplyMatrices(leftLowerULegMatrix, rotationNA);
  leftLowerLeg.setMatrix(leftLowerLegRotateMatrix);
  
  var rightLowerULegMatrix = new THREE.Matrix4().multiplyMatrices(rightUpperLegRotateMatrix, rightLowerLegMatrix);
  var rightLowerLegRotateMatrix = new THREE.Matrix4().multiplyMatrices(rightLowerULegMatrix, rotationNB);
  rightLowerLeg.setMatrix(rightLowerLegRotateMatrix);

  //foot
  var leftFootRotateMatrix = new THREE.Matrix4().multiplyMatrices(leftLowerLegRotateMatrix,leftFootMatrix)
  var rightFootRotateMatrix = new THREE.Matrix4().multiplyMatrices(rightLowerLegRotateMatrix,rightFootMatrix)
  leftFoot.setMatrix(leftFootRotateMatrix);
  rightFoot.setMatrix(rightFootRotateMatrix);

}

// LISTEN TO KEYBOARD
var keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
  if (keyboard.pressed("W"))
    gemPosition.value.z -= 0.1;
  else if (keyboard.pressed("S"))
    gemPosition.value.z += 0.1;

  if (keyboard.pressed("A"))
    gemPosition.value.x -= 0.1;
  else if (keyboard.pressed("D"))
    gemPosition.value.x += 0.1;

  if (keyboard.pressed("F"))
    gemPosition.value.y -= 0.1;
  else if (keyboard.pressed("R"))
    gemPosition.value.y += 0.1;

  if (keyboard.pressed("Q"))
    gemRadius.value += 0.1;
  else if (keyboard.pressed("E"))
    gemRadius.value -= 0.1;

  if (keyboard.pressed("1"))
    wave = true;
  else if (keyboard.pressed("2"))
    wave = false;

  gemMaterial.needsUpdate = true; // Tells three.js that some uniforms might have changed
  // whiteMaterial.needsUpdate = true;
}

// SETUP UPDATE CALL-BACK
function update() {
  checkKeyboard();
  updateBody();

  requestAnimationFrame(update);
  renderer.render(scene, camera);
}

update();