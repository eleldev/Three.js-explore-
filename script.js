// Сцена
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Параметры кристаллов
const crystalSize = 3000;
const center = Math.floor(crystalSize / 2);
const maxCrystals = 50; // Максимальное количество кристаллов
let crystalCount = 0; // Текущее количество кристаллов
const crystalPositions = new Set(); // Для отслеживания занятых позиций

function createCrystal(x, y, z) {
    // Случайный размер кристалла от 0.5 до 2
    const size = Math.random() * 1.5 + 0.5;
    const geometry = new THREE.DodecahedronGeometry(size, 0);
    const material = new THREE.MeshPhongMaterial({ color: 0x8A2BE2, transparent: true, opacity: 0.8 });
    const crystal = new THREE.Mesh(geometry, material);
    crystal.position.set(x - center, y - center, z - center);
    scene.add(crystal);
    crystalPositions.add(`${x},${y},${z}`); // Добавляем позицию кристалла
}

// Инициализация: начальная точка
createCrystal(center, center, center);
crystalCount++;

// Случайное блуждание из начальной точки
function randomWalk() {
    if (crystalCount < maxCrystals) { // Проверка на максимальное количество
        const directions = [
            [1, 0, 0], [-1, 0, 0],
            [0, 1, 0], [0, -1, 0],
            [0, 0, 1], [0, 0, -1]
        ];

        // Выбираем случайное направление
        const [dx, dy, dz] = directions[Math.floor(Math.random() * directions.length)];

        const lastCrystal = Array.from(crystalPositions)[Math.floor(Math.random() * crystalPositions.size)].split(',').map(Number);
        const newX = lastCrystal[0] + dx;
        const newY = lastCrystal[1] + dy;
        const newZ = lastCrystal[2] + dz;

        // Проверяем, не превышает ли кристалл границы
        if (newX >= 0 && newX < crystalSize && newY >= 0 && newY < crystalSize && newZ >= 0 && newZ < crystalSize) {
            const newPosition = `${newX},${newY},${newZ}`;
            if (!crystalPositions.has(newPosition)) { // Проверяем, занята ли позиция
                createCrystal(newX, newY, newZ);
                crystalCount++;
            }
        }
    }
}

// Свет
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);

// Параметры для движения камеры
let angle = 0;
const radius = 25;
// Анимация
function animate() {
    requestAnimationFrame(animate);
    randomWalk();

    // Движение камеры
    camera.position.x = radius * Math.sin(angle);
    camera.position.z = radius * Math.cos(angle);
    camera.lookAt(0, 0, 0); // Всегда смотрим на центр

    angle += 0.01; // Увеличиваем угол для плавного вращения
    renderer.render(scene, camera);
}

animate();
