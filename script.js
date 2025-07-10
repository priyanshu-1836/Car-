
let scene, camera, renderer, car, road, enemyCars = [], score = 0, highScore = 0;
let moveLeft = false, moveRight = false, boosting = false, speed = 0.3;
const keys = { left: false, right: false };

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x101010);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 6, 10);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(5, 10, 7.5);
  scene.add(ambient, dirLight);

  // Road
  const roadGeo = new THREE.PlaneGeometry(10, 200);
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const road = new THREE.Mesh(roadGeo, roadMat);
  road.rotation.x = -Math.PI / 2;
  road.position.z = -90;
  scene.add(road);

  // Car
  const carGeo = new THREE.BoxGeometry(1, 0.5, 2);
  const carMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  car = new THREE.Mesh(carGeo, carMat);
  car.position.y = 0.25;
  scene.add(car);

  // Events
  window.addEventListener('resize', onWindowResize);
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  document.getElementById("restartBtn").onclick = restartGame;
  document.getElementById("boostBtn").onmousedown = () => boosting = true;
  document.getElementById("boostBtn").onmouseup = () => boosting = false;

  spawnEnemies();
  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(e) {
  if (e.key === 'ArrowLeft') keys.left = true;
  if (e.key === 'ArrowRight') keys.right = true;
  if (e.key === ' ') boosting = true;
}

function onKeyUp(e) {
  if (e.key === 'ArrowLeft') keys.left = false;
  if (e.key === 'ArrowRight') keys.right = false;
  if (e.key === ' ') boosting = false;
}

function restartGame() {
  car.position.set(0, 0.25, 0);
  enemyCars.forEach(e => scene.remove(e));
  enemyCars = [];
  score = 0;
  document.getElementById("score").textContent = score;
  spawnEnemies();
}

function spawnEnemies() {
  for (let i = 0; i < 5; i++) {
    const geo = new THREE.BoxGeometry(1, 0.5, 2);
    const mat = new THREE.MeshStandardMaterial({ color: 0x00ffff });
    const enemy = new THREE.Mesh(geo, mat);
    enemy.position.set((Math.random() * 8) - 4, 0.25, -Math.random() * 100 - 20);
    enemyCars.push(enemy);
    scene.add(enemy);
  }
}

function detectCollision(a, b) {
  const dx = a.position.x - b.position.x;
  const dz = a.position.z - b.position.z;
  return Math.abs(dx) < 1.0 && Math.abs(dz) < 2.0;
}

function animate() {
  requestAnimationFrame(animate);

  // Car Movement
  if (keys.left && car.position.x > -4) car.position.x -= speed;
  if (keys.right && car.position.x < 4) car.position.x += speed;

  const currentSpeed = boosting ? speed * 2 : speed;

  // Move enemies
  enemyCars.forEach(enemy => {
    enemy.position.z += currentSpeed;
    if (enemy.position.z > 10) {
      enemy.position.z = -Math.random() * 100 - 50;
      enemy.position.x = (Math.random() * 8) - 4;
      score++;
      if (score > highScore) highScore = score;
      document.getElementById("score").textContent = score;
      document.getElementById("highscore").textContent = highScore;
    }
    if (detectCollision(car, enemy)) {
      alert("💥 Crash! Game Over.");
      restartGame();
    }
  });

  renderer.render(scene, camera);
}

init();
