let gltf = null;
let mixer = null;
let clock = new THREE.Clock();
let controls;
let camera;

init();
animate();
  
function init() {
    width = window.innerWidth;
    height = window.innerHeight;
    
    scene = new THREE.Scene();


    const light = new THREE.SpotLight(0xFFFFFF, 2, 100, Math.PI / 4, 8);
    light.position.set( 10, 25, 25 );
    light.castShadow = true;
    
    camera = new THREE.PerspectiveCamera( 60, width / height, 0.01, 10000 );
    camera.position.set(0, 3, 10);
    

    let manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {
        console.log( item, loaded, total );
    };

    let loader = new THREE.GLTFLoader();
    loader.setCrossOrigin( 'anonymous' );

    
    let scale = 0.01;
    // let url = "https://rawcdn.githack.com/BabylonJS/Exporters/422493778d6ffbc2980e83e46eb94729bbeada0c/Maya/Samples/glTF%202.0/T-Rex/trex_running.gltf";
    // let url = "https://raw.githubusercontent.com/leoneloliver/demo3d/main/house.gltf";
    let url = "https://rawcdn.githack.com/leoneloliver/demo3d/c32357eb594232f05bd9a03f5fd62f79e218b394/scene.gltf";
    
    loader.load(url, function (data) {
        gltf = data;
        let object = gltf.scene;
        object.scale.set(scale, scale, scale);
        //object.position.y = -5;
        //object.position.x = 4;
        object.castShadow = true;
        object.receiveShadow = true;

        let animations = gltf.animations;
        if ( animations && animations.length ) {
            mixer = new THREE.AnimationMixer( object );
            for ( let i = 0; i < animations.length; i ++ ) {
                let animation = animations[ i ];
                mixer.clipAction( animation ).play();
            }
        }
        scene.add(object);
    });

    renderer = new THREE.WebGLRenderer();
    //renderer.setClearColor( 0xbfe4ff );
    renderer.setClearColor( 0x000000 );
    renderer.shadowMap.enabled = true;
    
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.userPan = false;
    controls.userPanSpeed = 0.0;
    controls.maxDistance = 5000.0;
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.autoRotate = false;
    //controls.autoRotate = false;
    //controls.autoRotate = false;
    //controls.autoRotateSpeed = 2.0;
    controls.autoRotateSpeed = -2.0;

    renderer.setSize( width, height );
    renderer.gammaOutput = true;
    document.body.appendChild( renderer.domElement );
}

function animate() {
    requestAnimationFrame( animate );
    if (mixer) mixer.update(clock.getDelta());
    controls.update();
    render();
}

function render() {
    renderer.render( scene, camera );
}