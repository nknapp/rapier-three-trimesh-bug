import {AmbientLight, PerspectiveCamera, Scene, SpotLight, WebGLRenderer} from "three";
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';


function createSpotlight() {
    const spotLight = new SpotLight("white", 50, 50, Math.PI / 3, Math.PI / 20);
    spotLight.position.set(0, 20, 0)
    spotLight.target.position.set(0, 0, 0)
    spotLight.castShadow = true
    return spotLight;
}

export async function setupScene() {
    const renderer = new WebGLRenderer()
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.append(renderer.domElement)

    const camera = new PerspectiveCamera(
        30,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
    )
    camera.position.set(0, 20, 20)
    const controls = new OrbitControls(camera, renderer.domElement)

    const scene = new Scene()
    scene.add(createSpotlight())
    scene.add(new AmbientLight("white", 0.2))

    return {scene, renderer,  camera, controls};
}
