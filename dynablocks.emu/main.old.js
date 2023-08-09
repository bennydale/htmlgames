import * as THREE from 'three';
const { AmmoPhysics, PhysicsLoader } = ENABLE3D

let cameraMove = {
    x: 0,
    y: 0,
    z: 0,
}

let buildmenu = true

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, 640 / 480, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( 640, 480 );
document.body.appendChild( renderer.domElement );

// add image to the dom
const img = document.createElement('img');
img.style.position = 'absolute';
// do not allow draging the image
img.setAttribute('draggable', false);
img.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
img.style.width = 100 + 'px';
img.style.top = (480-95-40) + 'px';
img.style.left = (640-100) + 'px';
img.src = 'camera_menu.png';
document.body.appendChild(img);


if (buildmenu == true){
    const bottomMenu = document.createElement('div');
    bottomMenu.style.position = 'absolute';
    bottomMenu.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
    bottomMenu.style.width = 640 + 'px';
    bottomMenu.style.height = 40 + 'px';
    bottomMenu.style.top = (480-40) + 'px';
    bottomMenu.style.left = 0 + 'px';
    bottomMenu.style.backgroundColor = '#ece9d8';
    document.body.appendChild(bottomMenu);
}




let circleLeft = false
let circleRight = false
let zoomin = false 
let zoomout = false
const getButton = (event) =>{    
    
    let x = event.offsetX * (120/event.toElement.offsetWidth)
    let y = event.offsetY * (115/event.toElement.offsetHeight)
        
    if (x > 20 && x < 33 && y > 26 && y < 63){
        return 'zoom-in'
    }
    if (x > 86 && x < 101 && y > 26 && y < 63){
        return 'zoom-out'
    }
    if (x > 43 && x < 77 && y > 36 && y < 57){        
        return 'up'
    }
    if (x > 43 && x < 77 && y > 90 && y < 110){        
        return 'down'
    }
    if (x > 13 && x < 38 && y > 70 && y < 98){     
        return 'left'
    }
    if (x > 83 && x < 107 && y > 70 && y < 98){  
        return 'right'
    }
}
// capture clicks on the image
img.addEventListener('mousedown', function(event) {
    console.log(event.clientX, event.clientY, getButton(event))
    switch(getButton(event)){
        case 'zoom-in':
            zoomin = true
            break;
        case 'zoom-out':
            zoomout = true
            break;
        case 'up':
            cameraMove.y = +.1;
            break;
        case 'down':
            cameraMove.y = -.1;
            break;
        case 'left':
            circleLeft = true
            break;
        case 'right':
            circleRight = true
            break;            
    }
}, false);
img.addEventListener('mouseup', function(event) {
    switch(getButton(event)){
        case 'zoom-in':
            zoomin = false
            break;
        case 'zoom-out':
            zoomout = false
            break;
        case 'up':
            cameraMove.y = 0;
            break;
        case 'down':
            cameraMove.y = 0;
            break;
        case 'left':
            circleLeft = false
            break;
        case 'right':
            circleRight = false
            break;
    }
}, false);

const objectWithGravity = []
const addToScene = (object) => {
    scene.add(object)
    objectWithGravity.push(object)
}

const geometry = new THREE.BoxGeometry( 2, 1, 1 );
// have the material affected by the light
const material = new THREE.MeshPhongMaterial( { color: "red" } );
const cube = new THREE.Mesh( geometry, material );
addToScene( cube );
cube.position.x = 0;
cube.position.y = 5.5;
const lowerShirtMaterial = new THREE.MeshPhongMaterial( { color: "white" } );
const lowerShirt = new THREE.Mesh( geometry, lowerShirtMaterial );
addToScene( lowerShirt );
lowerShirt.position.x = 0;
lowerShirt.position.y = 4.5;
// add arms
const armGeometry = new THREE.BoxGeometry( 1, 2, 1 );
const armMaterial = new THREE.MeshPhongMaterial( { color: "yellow" } );
const leftArm = new THREE.Mesh( armGeometry, armMaterial );
addToScene( leftArm );
leftArm.position.x = -1.5;
leftArm.position.y = 5.001;
const rightArm = new THREE.Mesh( armGeometry, armMaterial );
addToScene( rightArm );
rightArm.position.x = 1.5;
rightArm.position.y = 5.001;
// add legs
const legGeometry = new THREE.BoxGeometry( 1, 2, 1 );
const legMaterial = new THREE.MeshPhongMaterial( { color: "red" } );
const leftLeg = new THREE.Mesh( legGeometry, legMaterial );
addToScene( leftLeg );
leftLeg.position.x = -.5;
leftLeg.position.y = 3;
const rightLeg = new THREE.Mesh( legGeometry, legMaterial );
addToScene( rightLeg );
rightLeg.position.x = .5;
rightLeg.position.y = 3;

const textureLoader = new THREE.TextureLoader();
const backgroundTexture = textureLoader.load('sky__360.png');
const sphereGeometry = new THREE.SphereGeometry(500, 32, 32); // The first parameter is the radius of the sphere.

const skyMaterial = new THREE.MeshBasicMaterial({ map: backgroundTexture });
skyMaterial.side = THREE.BackSide; // This ensures the material is visible from the inside of the sphere.
const backgroundMesh = new THREE.Mesh(sphereGeometry, skyMaterial);
scene.add(backgroundMesh);

// a sphere on top of the cubue
const geometry2 = new THREE.SphereGeometry( 1, 35, 35 );
const material2 = new THREE.MeshPhongMaterial( { color: 0xffff00 } );
const sphere = new THREE.Mesh( geometry2, material2 );
addToScene( sphere );
sphere.position.x = 0;
sphere.position.y = 7;
sphere.position.z = .7;

// add a baseplate ground
for(var i=0;i<15;i++){
    for(var j=0;j<15;j++){
        const geometry3 = new THREE.BoxGeometry( 1.1, 1, 1.1 );
        // a material that diffuses light

        const material3 = new THREE.MeshPhongMaterial( { color: "green" } );
        const baseplate = new THREE.Mesh( geometry3, material3 );
        scene.add( baseplate );
        const geometryNudge = new THREE.BoxGeometry( .8, 1.1, .8 );
        const materialNudge = new THREE.MeshPhongMaterial( { color: "green" } );
        const baseplateNudge = new THREE.Mesh( geometryNudge, materialNudge );
        scene.add( baseplateNudge );

        baseplate.position.x = i*1.1-5;
        baseplate.position.y = 0;
        baseplate.position.z = j*1.1-5;
        baseplateNudge.position.x = i*1.1-5;
        baseplateNudge.position.y = +.1;
        baseplateNudge.position.z = j*1.1-5;
    }
}

// add a direction light pointed to the center of the secene
const light = new THREE.DirectionalLight( 0xffffff, 3 );
light.position.set( 5, 10, 2 ).normalize();
scene.add(light);

// add ambient light
const ambientLight = new THREE.AmbientLight( 0x404040,20 ); // soft white light
scene.add( ambientLight );

camera.position.y = 3
camera.position.z = 10

const physics = new AmmoPhysics(scene)
const { factory } = physics
physics.add.ground({ width: 20, height: 20 })


// clock
const clock = new THREE.Clock()

function animate() {

    camera.position.x = camera.position.x + cameraMove.x
    camera.position.z = camera.position.z + cameraMove.z
    camera.position.y = camera.position.y + cameraMove.y

    if (zoomin){
        // look at the center of the scene
        camera.lookAt(0, 0, 0);
        //moe the camera towards the center
        camera.position.x = camera.position.x * .99
        camera.position.y = camera.position.y * .99
        camera.position.z = camera.position.z * .99
    }
    if (zoomout){
        // look at the center of the scene
        camera.lookAt(0, 0, 0);
        //moe the camera towards the center
    
        camera.position.x = camera.position.x * 1.01
        camera.position.y = camera.position.y * 1.01
        camera.position.z = camera.position.z * 1.01
    }
    if (circleLeft){
        // Get the distance of the camera from the center
        const distanceFromCenter = Math.sqrt(
        camera.position.x * camera.position.x +
        camera.position.z * camera.position.z
        );

        // Calculate the angle of the camera position from the center
        const angle = Math.atan2(camera.position.z, camera.position.x);

        // Define the rotation speed (you can adjust this value)
        const rotationSpeed = 0.1;

        // Calculate the new angle after applying the rotation
        const newAngle = angle + rotationSpeed;

        // Calculate the new camera position based on the new angle and distance
        camera.position.x = distanceFromCenter * Math.cos(newAngle);
        camera.position.z = distanceFromCenter * Math.sin(newAngle);

        // Look at the center of the scene
        camera.lookAt(0, 0, 0);                
    }
    if (circleRight){
       // Rotate the camera around the center of the scene to the right

        // Get the distance of the camera from the center
        const distanceFromCenter = Math.sqrt(
            camera.position.x * camera.position.x +
            camera.position.z * camera.position.z
        );

        // Calculate the angle of the camera position from the center
        const angle = Math.atan2(camera.position.z, camera.position.x);

        // Calculate the new camera position based on the new angle and distance
        camera.position.x = distanceFromCenter * Math.cos(newAngle);
        camera.position.z = distanceFromCenter * Math.sin(newAngle);

        // Look at the center of the scene
        camera.lookAt(0, 0, 0);
    }             

    physics.update(clock.getDelta() * 1000)
    physics.updateDebugger()
	renderer.render( scene, camera );
    requestAnimationFrame( animate );
}
PhysicsLoader('/lib/ammo/kripken', () => MainScene())
animate();