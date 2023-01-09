import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

// Scene
const scene = new THREE.Scene();
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
  roughness: 0.5,
});

// Size
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//camera params
const fov = 45;
const aspectRatio = size.width / size.height;
const near = 0.1;
const far = 50;
const zPosition = 20;

//create mesh
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// set Light
const light = new THREE.PointLight(0xfffff, 1, 100);
light.position.set(0, 10, 10);
light.intensity = 1.25;
scene.add(light);

// set Camere
const camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
camera.position.z = zPosition;
scene.add(camera);

// set renderer
const canvas = document.querySelector(".webGl");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setPixelRatio(2);
renderer.setSize(size.width, size.height);
renderer.render(scene, camera);

//cntrols
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

window.addEventListener("resize", () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;

  // update camera
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
});

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};

loop();

// timeline
const timeline = gsap.timeline({ defaults: { duration: 1 } });
timeline.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
timeline.fromTo("nav", {y: "-100%"}, {y: "0%"});
timeline.fromTo(".title", {opacity: 0}, {opacity: 1});

// mouse animation color
let mouseDown = false;
let rgb = [];
window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseup", () => (mouseDown = false));

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / size.width) * 255),
      Math.round((e.pageY / size.height) * 255),
      100,
    ];
  }
  //lets animate
  let newcolor = new THREE.Color(`rgb(${rgb.join(",")})`);
  gsap.to(mesh.material.color, {
    r: newcolor.r,
    g: newcolor.g,
    b: newcolor.b,
  });
});
