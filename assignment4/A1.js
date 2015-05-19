/**
 * UBC CPSC 314, Vjan2015
 * Assignment 1 Template
 */
var scene = new THREE.Scene();

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

// WORLD COORDINATE FRAME: other objects are defined with respect to it
var worldFrame = new THREE.AxisHelper(5) ;
scene.add(worldFrame);

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
floor.parent = worldFrame;

// UNIFORMS
//var gemPosition = {type: 'v3', value: new THREE.Vector3(0,5,3)};
var gemPosition = {type: 'v3', value: new THREE.Vector3(0,1,1)};

var gemRadius = {type: 'f', value: 1.0};

var boxPosition = {type: 'v3', value: new THREE.Vector3(0,3,-5)};
var boxRotaAng = {type: 'f', value: 0.0};

// MATERIALS
var armadilloMaterial = new THREE.ShaderMaterial({
  uniforms: {
    gemPosition: gemPosition,
    gemRadius : gemRadius,
  },
});
var gemMaterial = new THREE.ShaderMaterial({
   uniforms: {
    gemPosition: gemPosition,
    gemRadius : gemRadius,
  },
});

var boxMaterial = new THREE.ShaderMaterial({
   uniforms: {
    boxPosition: boxPosition,
    boxRotaAng: boxRotaAng,
  },
});
// var boxMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, wireframeLinewidth: 2 } );

// LOAD SHADERS
var shaderFiles = [
  'glsl/armadillo.vs.glsl',
  'glsl/armadillo.fs.glsl',
  'glsl/gem.vs.glsl',
  'glsl/gem.fs.glsl',
  'glsl/box.vs.glsl',
  'glsl/box.fs.glsl',
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
  armadilloMaterial.vertexShader = shaders['glsl/armadillo.vs.glsl'];
  armadilloMaterial.fragmentShader = shaders['glsl/armadillo.fs.glsl'];

  gemMaterial.vertexShader = shaders['glsl/gem.vs.glsl'];
  gemMaterial.fragmentShader = shaders['glsl/gem.fs.glsl'];

  boxMaterial.vertexShader = shaders['glsl/box.vs.glsl'];
  boxMaterial.fragmentShader = shaders['glsl/box.fs.glsl'];
})

// LOAD ARMADILLO
function loadOBJ(file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
  var onProgress = function(query) {
    if ( query.lengthComputable ) {
      var percentComplete = query.loaded / query.total * 100;
      console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
  };

  var onError = function() {
    console.log('Failed to load ' + file);
  };

  var loader = new THREE.OBJLoader();
  loader.load(file, function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });

    object.position.set(xOff,yOff,zOff);
    object.rotation.x= xRot;
    object.rotation.y = yRot;
    object.rotation.z = zRot;
    object.scale.set(scale,scale,scale);
    object.parent = worldFrame;
    scene.add(object);

  }, onProgress, onError);
}

//loadOBJ('obj/armadillo.obj', armadilloMaterial, 3, 0,3,0, 0,Math.PI,0);
loadOBJ('obj/armadillo.obj', armadilloMaterial, 1, 0,0,0, 0,0,0);

// CREATE GEM
var gemGeometry = new THREE.SphereGeometry(1, 32, 32);
var gem = new THREE.Mesh(gemGeometry, gemMaterial);
gem.parent = worldFrame;
scene.add(gem);

// CREATE BOX
var boxGeometry = new THREE.CubeGeometry(3, 3, 3);
var box = new THREE.Mesh(boxGeometry, boxMaterial);
box.parent = worldFrame;
scene.add(box);

// LISTEN TO KEYBOARD
var keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
  if (keyboard.pressed("+"))
    gemRadius.value += 0.1;
  else if (keyboard.pressed("-"))
    gemRadius.value -= 0.1;

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

  gemMaterial.needsUpdate = true; // Tells three.js that some uniforms might have changed

}

// Helper function to rotate the box
function rotateBox(){
  boxRotaAng.value = (Date.now()*.005)%360;
  // console.log(box.face[1].a);
  boxMaterial.needsUpdate = true;

}

// SETUP UPDATE CALL-BACK
function update() {
  checkKeyboard();
  rotateBox();
  requestAnimationFrame(update);
  renderer.render(scene, camera);
}


update();

