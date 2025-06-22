const gameData = {
  scene: 'room',
  inventory: [],
  scenes: {
    room: {
      image: 'room.svg',
      hotspots: [
        {
          id: 'box',
          x: 250,
          y: 220,
          width: 100,
          height: 60,
          onClick: () => openBox()
        },
        {
          id: 'door',
          x: 520,
          y: 120,
          width: 80,
          height: 180,
          onClick: () => tryDoor()
        }
      ]
    }
  }
};

const textBox = document.getElementById('text-box');
const inventoryList = document.getElementById('inventory-list');
const sceneImage = document.getElementById('scene-image');
const hotspotsDiv = document.getElementById('hotspots');

function showMessage(msg) {
  textBox.textContent = msg;
}

function renderInventory() {
  inventoryList.innerHTML = '';
  gameData.inventory.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    inventoryList.appendChild(li);
  });
}

function loadScene(name) {
  const scene = gameData.scenes[name];
  sceneImage.src = scene.image;
  hotspotsDiv.innerHTML = '';
  scene.hotspots.forEach(h => {
    const div = document.createElement('div');
    div.className = 'hotspot';
    div.style.left = h.x + 'px';
    div.style.top = h.y + 'px';
    div.style.width = h.width + 'px';
    div.style.height = h.height + 'px';
    div.addEventListener('click', h.onClick);
    hotspotsDiv.appendChild(div);
  });
  showMessage('You are in a locked room. Find a way to escape.');
}

function openBox() {
  if (!gameData.inventory.includes('Key')) {
    gameData.inventory.push('Key');
    renderInventory();
    showMessage('You found a small key inside the box.');
  } else {
    showMessage('The box is empty.');
  }
}

function tryDoor() {
  if (gameData.inventory.includes('Key')) {
    showMessage('You unlocked the door and escaped! Congratulations!');
    hotspotsDiv.innerHTML = '';
  } else {
    showMessage('The door is locked. Perhaps there is a key somewhere.');
  }
}

loadScene(gameData.scene);
renderInventory();
