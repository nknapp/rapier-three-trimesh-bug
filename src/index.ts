import {BoxGeometry, BufferGeometry, Material, Mesh, MeshStandardMaterial} from "three"
import rapier, {RigidBodyDesc} from "@dimforge/rapier3d-compat";
import {setupScene} from "./setupScene";



await rapier.init()
const world = new rapier.World(new rapier.Vector3(0.0, -9.81, 0.0))
const friction = Number(new URLSearchParams(document.location.search).get("friction") ?? "0.1")

const {scene, renderer, camera, controls} = await setupScene();

function addSimulationObject(geometry: BufferGeometry, material: Material, rigidBodyDesc: RigidBodyDesc, colliderType: "trimesh" | "convexhull") {
    const positions = geometry.getAttribute("position");
    const index = geometry.index;
    if (index == null) throw new Error("Mesh geometry does not have indexes");

    // Derive collider from three.js-geometry. I want to use "trimesh",
    // but that does not seem to work correctly. The convexHull collider works as expected.
    const colliderDesc = colliderType == "trimesh"
        ? rapier.ColliderDesc.trimesh(new Float32Array(positions.array), new Uint32Array(index.array),)
        : rapier.ColliderDesc.convexHull(new Float32Array(positions.array))!;

    const rigidBody = world.createRigidBody(rigidBodyDesc)
    const collider = world.createCollider(colliderDesc, rigidBody)
    collider.setFriction(friction)
    const mesh = new Mesh(geometry, material);
    mesh.castShadow = true
    mesh.receiveShadow = true
    scene.add(mesh);
    return {
        collider,
        update() {
            mesh.position.copy(rigidBody.translation());
            mesh.quaternion.copy(rigidBody.rotation());
        }
    }
}

const ground = addSimulationObject(
    new BoxGeometry(5, 1, 5).rotateZ(0.2),
    new MeshStandardMaterial({
        color: "white",
    }),
    rapier.RigidBodyDesc.fixed().setCcdEnabled(true),
    "trimesh"
)


const triMeshCube = addSimulationObject(
    new BoxGeometry(1, 1, 1).rotateZ(Math.PI / 5).translate(0, 5, 1),
    new MeshStandardMaterial({
        color: "red",
    }),
    rapier.RigidBodyDesc.dynamic().setCcdEnabled(true),
    "trimesh"
)

const convexHullCube = addSimulationObject(
    new BoxGeometry(1, 1, 1).rotateZ(Math.PI / 5).translate(0, 5, -1),
    new MeshStandardMaterial({
        color: "green",
    }),
    rapier.RigidBodyDesc.dynamic().setCcdEnabled(true),
    "convexhull"
)

renderer.setAnimationLoop(() => {
    world.step();
    ground.update()
    triMeshCube.update()
    convexHullCube.update()
    controls.update()
    renderer.render(scene, camera)
})



