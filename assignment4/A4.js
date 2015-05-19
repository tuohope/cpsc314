/**
 * UBC CPSC 314, Vjan2015
 * Assignment 4 Template
 */

var scene = new THREE.Scene();

// SETUP RENDERER
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffffff); // white background colour
document.body.appendChild(renderer.domElement);
renderer.shadowMapEnabled = true;
renderer.shadowMapType = THREE.PCFSoftShadowMap;


// SETUP CAMERA
var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 2000); // view angle, aspect ratio, near, far
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
var floorTexture = new THREE.ImageUtils.loadTexture('images/gravel-rocks-texture.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(1,1 );
var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
var floorGeometry = new THREE.PlaneBufferGeometry(30, 30);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.1;
floor.rotation.x = Math.PI / 2;
floor.castShadow = false;
floor.receiveShadow = true;
scene.add(floor);
floor.parent = worldFrame;

// BASIC LIGHTING
var ambientLight = new THREE.AmbientLight( 0x5f5f5f );
scene.add( ambientLight );

var pointLight = new THREE.SpotLight(0xffffff);
pointLight.parent = worldFrame;
pointLight.position.set(0,20,0);

pointLight.castShadow = true;

pointLight.shadowDarkness = .7;

pointLight.shadowCameraNear = 1;
pointLight.shadowCameraFar = 2500;
pointLight.shadowCameraFov = 50;

// pointLight.shadowCameraVisible = true;
scene.add(pointLight); 


var phongMaterial1 = new THREE.MeshPhongMaterial({
  ambient: 0x444444,
  color   : 0x2194ce,
});
var phongMaterial2 = new THREE.MeshPhongMaterial({
  ambient: 0x444444,
  color   : 0x2194ce,
});

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
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    object.position.set(xOff,yOff,zOff);
    object.rotation.x = xRot;
    object.rotation.y = yRot;
    object.rotation.z = zRot;
    object.scale.set(scale,scale,scale);
    object.parent = worldFrame;

    scene.add(object);
  }, onProgress, onError);
}


loadOBJ('obj/armadillo.obj', phongMaterial2, 3, 0,3,-2, 0,3.14,0);

//add a gem
var gemGeometry = new THREE.SphereGeometry(1, 32, 32);
var gem = new THREE.Mesh(gemGeometry, phongMaterial1);
gem.position.set(0,1,0);
gem.parent = worldFrame;
gem.castShadow = true;
gem.receiveShadow = true;
scene.add(gem);

var mirrorSphereMat = new THREE.SphereGeometry(2, 32, 32);
mirrorSphereCamera = new THREE.CubeCamera(1, 10000, 128 );
scene.add( mirrorSphereCamera );
var mirrorSphereMaterial = new THREE.MeshBasicMaterial( { envMap: mirrorSphereCamera.renderTarget } );
mirrorSphere = new THREE.Mesh( mirrorSphereMat, mirrorSphereMaterial );
mirrorSphere.position.set(5,5,5);
mirrorSphereCamera.position.set(5,5,5);
mirrorSphere.castShadow = true;
mirrorSphere.receiveShadow = true;
scene.add(mirrorSphere);

// SKYBOX/FOG
var materialArray = [];
materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/cubemap_real/cube1.png' ) }));
materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/cubemap_real/cube2.png' ) }));
materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/cubemap_real/cube3.png' ) }));
materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/cubemap_real/cube4.png' ) }));
materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/cubemap_real/cube5.png' ) }));
materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/cubemap_real/cube6.png' ) }));
for (var i = 0; i < 6; i++)
   materialArray[i].side = THREE.BackSide;
var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );
var skyboxGeom = new THREE.BoxGeometry( 2000, 2000, 2000, 1, 1, 1 );
var skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );
scene.add( skybox );  




var keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
  if (keyboard.pressed("S"))
    pointLight.position.z += 1;
  else if (keyboard.pressed("W"))
    pointLight.position.z -= 1;

  if (keyboard.pressed("D"))
    pointLight.position.x += 1;
  else if (keyboard.pressed("A"))
    pointLight.position.x -= 1;

   if (keyboard.pressed("R"))
    pointLight.position.y += 1;
  else if (keyboard.pressed("F"))
    pointLight.position.y -= 1;

  if (keyboard.pressed("K"))
{    mirrorSphere.position.z += 1;
  mirrorSphereCamera.position.z += 1;
  }  else if (keyboard.pressed("I"))
{    mirrorSphere.position.z -= 1;
  mirrorSphereCamera.position.z -= 1;
}
  if (keyboard.pressed("L"))
{    mirrorSphere.position.x += 1;
  mirrorSphereCamera.position.x += 1;
  }  else if (keyboard.pressed("J"))
{    mirrorSphere.position.x -= 1;
  mirrorSphereCamera.position.x -= 1;
}
   if (keyboard.pressed("Y"))
{    mirrorSphere.position.y += 1;
  mirrorSphereCamera.position.y += 1;
  }  else if (keyboard.pressed("H"))
{    mirrorSphere.position.y -= 1;
  mirrorSphereCamera.position.y -= 1;
}



}

// SETUP UPDATE CALL-BACK
function update() {
  checkKeyboard();
  requestAnimationFrame(update);
  
  mirrorSphereCamera.position = mirrorSphere.position;
  mirrorSphere.visible = false;
  mirrorSphereCamera.updateCubeMap( renderer, scene );
  mirrorSphere.visible = true;

  renderer.render(scene, camera);
}

update();
