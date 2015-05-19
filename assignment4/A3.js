/**
 * UBC CPSC 314, Vjan2015
 * Assignment 3 Template
 */

var scene = new THREE.Scene();

// SETUP RENDERER
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

// SETUP CAMERA
var aspect = window.innerWidth/window.innerHeight;
var camera = new THREE.PerspectiveCamera(30, aspect, 0.1, 10000);
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
// scene.add(floor);

// LIGHTING UNIFORMS
var lightColor = new THREE.Color(1,1,1);
var ambientColor = new THREE.Color(0.4,0.4,0.4);
var lightPosition = new THREE.Vector3(70,100,70);
var coolColor = new THREE.Vector3(.0,0.0,.7);
var warmColor = new THREE.Vector3(.7,0.0,.0);
var objectColor = new THREE.Vector3(0.0,0.0,0.0);

var mode = {type : 'i', value: 0};

// MATERIALS
var defaultMaterial = new THREE.MeshLambertMaterial();
var armadilloMaterial = new THREE.ShaderMaterial({
   uniforms: {
     lightColor : {type : 'c', value: lightColor},
     ambientColor : {type : 'c', value: ambientColor},
     lightPosition : {type: 'v3', value: lightPosition},
     mode : mode,
   },
});

var gouraudMaterial = new THREE.ShaderMaterial({
   uniforms: {
     ambientColor : {type : 'c', value: ambientColor},
     lightPosition : {type: 'v3', value: lightPosition},
   },
});

var phongMaterial = new THREE.ShaderMaterial({
   uniforms: {
     lightColor : {type : 'c', value: lightColor},
     ambientColor : {type : 'c', value: ambientColor},
     lightPosition : {type: 'v3', value: lightPosition},
   },
});

var blinnPhongMaterial = new THREE.ShaderMaterial({
   uniforms: {
     lightColor : {type : 'c', value: lightColor},
     ambientColor : {type : 'c', value: ambientColor},
     lightPosition : {type: 'v3', value: lightPosition},
   },
});

var toonMaterial = new THREE.ShaderMaterial({
   uniforms: {
     lightColor : {type : 'c', value: lightColor},
     ambientColor : {type : 'c', value: ambientColor},
     lightPosition : {type: 'v3', value: lightPosition},
   },
});

var hatchMaterial = new THREE.ShaderMaterial({
   uniforms: {
     lightColor : {type : 'c', value: lightColor},
     ambientColor : {type : 'c', value: ambientColor},
     lightPosition : {type: 'v3', value: lightPosition},
   },
});

var goochMaterial = new THREE.ShaderMaterial({
   uniforms: {
     lightColor : {type : 'c', value: lightColor},
     ambientColor : {type : 'c', value: ambientColor},
     lightPosition : {type: 'v3', value: lightPosition},
     coolColor : {type: 'v3', value: coolColor},
     warmColor : {type: 'v3', value: warmColor},
     objectColor : {type: 'v3', value: objectColor},
   },
});

// LOAD SHADERS
var shaderFiles = [
  'glsl/example.vs.glsl',
  'glsl/example.fs.glsl',
  'glsl/gouraud.vs.glsl',
  'glsl/gouraud.fs.glsl',
  'glsl/phong.vs.glsl',
  'glsl/phong.fs.glsl',
  'glsl/blinn.vs.glsl',
  'glsl/blinn.fs.glsl',
  'glsl/toon.vs.glsl',
  'glsl/toon.fs.glsl',
  'glsl/hatch.vs.glsl',
  'glsl/hatch.fs.glsl',
  'glsl/gooch.vs.glsl',
  'glsl/gooch.fs.glsl'
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
  armadilloMaterial.vertexShader = shaders['glsl/example.vs.glsl'];
  armadilloMaterial.fragmentShader = shaders['glsl/example.fs.glsl'];
  armadilloMaterial.needsUpdate = true;

  gouraudMaterial.vertexShader = shaders['glsl/gouraud.vs.glsl'];
  gouraudMaterial.fragmentShader = shaders['glsl/gouraud.fs.glsl'];
  gouraudMaterial.needsUpdate = true;

  phongMaterial.vertexShader = shaders['glsl/phong.vs.glsl'];
  phongMaterial.fragmentShader = shaders['glsl/phong.fs.glsl'];
  phongMaterial.needsUpdate = true;

  blinnPhongMaterial.vertexShader = shaders['glsl/blinn.vs.glsl'];
  blinnPhongMaterial.fragmentShader = shaders['glsl/blinn.fs.glsl'];
  blinnPhongMaterial.needsUpdate = true;

  toonMaterial.vertexShader = shaders['glsl/toon.vs.glsl'];
  toonMaterial.fragmentShader = shaders['glsl/toon.fs.glsl'];
  toonMaterial.needsUpdate = true;

  hatchMaterial.vertexShader = shaders['glsl/hatch.vs.glsl'];
  hatchMaterial.fragmentShader = shaders['glsl/hatch.fs.glsl'];
  hatchMaterial.needsUpdate = true;

  goochMaterial.vertexShader = shaders['glsl/gooch.vs.glsl'];
  goochMaterial.fragmentShader = shaders['glsl/gooch.fs.glsl'];
  goochMaterial.needsUpdate = true;
})

var armadillo;

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

  var loader = new THREE.OBJLoader()
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
    object.parent = floor;
    scene.add(object);
    armadillo = object;
  }, onProgress, onError);
}

loadOBJ('obj/armadillo.obj', armadilloMaterial, 3, 0,3,-2, 0,Math.PI,0);

// CREATE SPHERES
var sphere = new THREE.SphereGeometry(1, 32, 32);
var gem_gouraud = new THREE.Mesh(sphere, gouraudMaterial); // tip: make different materials for each sphere
gem_gouraud.position.set(-3, 1, -1);
scene.add(gem_gouraud);
gem_gouraud.parent = floor;

var gem_phong = new THREE.Mesh(sphere, phongMaterial);
gem_phong.position.set(-1, 1, -1);
scene.add(gem_phong);
gem_phong.parent = floor;

var gem_phong_blinn = new THREE.Mesh(sphere, blinnPhongMaterial);
gem_phong_blinn.position.set(1, 1, -1);
scene.add(gem_phong_blinn);
gem_phong_blinn.parent = floor;

var gem_toon = new THREE.Mesh(sphere, toonMaterial);
gem_toon.position.set(3, 1, -1);
scene.add(gem_toon);
gem_toon.parent = floor;

var gem_hatch = new THREE.Mesh(sphere, hatchMaterial);
gem_hatch.position.set(-5, 1, -1);
scene.add(gem_hatch);
gem_hatch.parent = floor;

var gem_gooch = new THREE.Mesh(sphere, goochMaterial);
gem_gooch.position.set(5, 1, -1);
scene.add(gem_gooch);
gem_gooch.parent = floor;

// SETUP UPDATE CALL-BACK
var keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
  if (keyboard.pressed("1")) //gouraud
    mode.value = 1;
  else if (keyboard.pressed("2")) //phong
    mode.value = 2;
  else if (keyboard.pressed("3")) //blinnphong
    mode.value = 3;
  else if (keyboard.pressed("4")) //toon
    mode.value = 4;
  else if (keyboard.pressed("5")) //normal
    mode.value = 0;
  else if (keyboard.pressed("Q")) //hatch
    mode.value = 5;
  else if (keyboard.pressed("W")) //gooch
    mode.value = 6;
  
  else if (keyboard.pressed("Z"))
    lightPosition.x += .1;
  else if (keyboard.pressed("X"))
    lightPosition.y += .1;
  else if (keyboard.pressed("C"))
    lightPosition.z += .1;

  else if (keyboard.pressed("A"))
    lightPosition.x -= .1;
  else if (keyboard.pressed("S"))
    lightPosition.y -= .1;
  else if (keyboard.pressed("D"))
    lightPosition.z -= .1;

  else if (keyboard.pressed("V"))
    warmColor.x += .1;
  else if (keyboard.pressed("B"))
    warmColor.y += .1;
  else if (keyboard.pressed("N"))
    warmColor.z += .1;

  else if (keyboard.pressed("F"))
    warmColor.x -= .1;
  else if (keyboard.pressed("G"))
    warmColor.y -= .1;
  else if (keyboard.pressed("H"))
    warmColor.z -= .1;

  else if (keyboard.pressed("M"))
    coolColor.x += .1;
  else if (keyboard.pressed(","))
    coolColor.y += .1;
  else if (keyboard.pressed("."))
    coolColor.z += .1;

  else if (keyboard.pressed("J"))
    coolColor.x -= .1;
  else if (keyboard.pressed("K"))
    coolColor.y -= .1;
  else if (keyboard.pressed("L"))
    coolColor.z -= .1;

  goochMaterial.needsUpdate = true;
  armadilloMaterial.needsUpdate = true; // Tells three.js that some uniforms might have changed
}

var render = function() {
 // tip: change armadillo shading here according to keyboard
 checkKeyboard();
 requestAnimationFrame(render);
 renderer.render(scene, camera);
}

render();
