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

const complianceState = {
  accepted: false
};

const accessibilityState = {
  highContrast: false,
  largeText: false,
  reducedMotion: false
};

const textBox = document.getElementById('text-box');
const inventoryList = document.getElementById('inventory-list');
const sceneImage = document.getElementById('scene-image');
const hotspotsDiv = document.getElementById('hotspots');
const gameRoot = document.getElementById('game');
const overlay = document.getElementById('compliance-overlay');
const ageConfirm = document.getElementById('age-confirm');
const privacyConfirm = document.getElementById('privacy-confirm');
const startButton = document.getElementById('start-game');
const viewReportButton = document.getElementById('view-report');
const helpButton = document.getElementById('help-button');
const accessibilityButton = document.getElementById('accessibility-button');
const resetButton = document.getElementById('reset-button');
const supportButton = document.getElementById('support-button');
const panelDialog = document.getElementById('panel-dialog');
const panelTitle = document.getElementById('panel-title');
const panelContent = document.getElementById('panel-content');
const closePanelButton = document.getElementById('close-panel');

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
    div.tabIndex = 0;
    div.addEventListener('click', h.onClick);
    div.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        h.onClick();
      }
    });
    hotspotsDiv.appendChild(div);
  });
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

function updateStartButton() {
  const ready = ageConfirm.checked && privacyConfirm.checked;
  startButton.disabled = !ready;
}

function applyAccessibilitySettings() {
  document.body.classList.toggle('high-contrast', accessibilityState.highContrast);
  document.body.classList.toggle('large-text', accessibilityState.largeText);
  document.body.classList.toggle('reduced-motion', accessibilityState.reducedMotion);
}

function setOverlayVisibility(visible) {
  if (visible) {
    overlay.classList.remove('hidden');
    gameRoot.classList.add('blurred');
    gameRoot.setAttribute('aria-hidden', 'true');
    showMessage('Please complete the safety checklist to begin.');
  } else {
    overlay.classList.add('hidden');
    gameRoot.classList.remove('blurred');
    gameRoot.removeAttribute('aria-hidden');
  }
}

function resetGameState() {
  gameData.scene = 'room';
  gameData.inventory = [];
  renderInventory();
  loadScene(gameData.scene);
  showMessage('You are in a locked room. Find a way to escape.');
}

function startGame() {
  if (startButton.disabled) {
    return;
  }
  complianceState.accepted = true;
  setOverlayVisibility(false);
  resetGameState();
}

function openPanel(title, html) {
  panelTitle.textContent = title;
  panelContent.innerHTML = html;
  if (typeof panelDialog.showModal === 'function') {
    panelDialog.showModal();
  } else {
    panelDialog.setAttribute('open', 'open');
  }
}

function closePanel() {
  if (typeof panelDialog.close === 'function') {
    if (panelDialog.open) {
      panelDialog.close();
    }
  } else {
    panelDialog.removeAttribute('open');
  }
}

function openHelpPanel() {
  openPanel('Help & Safety', `
    <p>Remember to take a short break every 30 minutes and stop playing if you feel unwell.</p>
    <p>If you are prone to photosensitive reactions, reduce screen brightness and enable reduced motion mode.</p>
    <p>You can leave the game at any time by closing the browser tab or pressing the restart button below the scene.</p>
  `);
}

function openAccessibilityPanel() {
  openPanel('Accessibility Options', `
    <form id="accessibility-form">
      <label><input type="checkbox" data-setting="highContrast" ${accessibilityState.highContrast ? 'checked' : ''}> High contrast mode</label>
      <label><input type="checkbox" data-setting="largeText" ${accessibilityState.largeText ? 'checked' : ''}> Large text</label>
      <label><input type="checkbox" data-setting="reducedMotion" ${accessibilityState.reducedMotion ? 'checked' : ''}> Reduced motion</label>
    </form>
    <p>Accessibility settings remain active until the session is restarted.</p>
  `);

  const form = panelContent.querySelector('#accessibility-form');
  form.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', () => {
      const setting = input.dataset.setting;
      accessibilityState[setting] = input.checked;
      applyAccessibilitySettings();
    });
  });
}

function openSupportPanel() {
  openPanel('Player Support', `
    <p>No personal data is stored by this demo. For questions or to report an issue, email <a href="mailto:support@example.com">support@example.com</a>.</p>
    <p>If you experience persistent discomfort, stop playing immediately and consult a guardian or medical professional.</p>
  `);
}

function resetSession() {
  complianceState.accepted = false;
  ageConfirm.checked = false;
  privacyConfirm.checked = false;
  updateStartButton();
  closePanel();
  resetGameState();
  setOverlayVisibility(true);
}

ageConfirm.addEventListener('change', updateStartButton);
privacyConfirm.addEventListener('change', updateStartButton);
startButton.addEventListener('click', startGame);
viewReportButton.addEventListener('click', () => {
  window.open('../GAME_COMPLIANCE_REPORT.md', '_blank', 'noopener');
});
helpButton.addEventListener('click', openHelpPanel);
accessibilityButton.addEventListener('click', openAccessibilityPanel);
supportButton.addEventListener('click', openSupportPanel);
resetButton.addEventListener('click', resetSession);
closePanelButton.addEventListener('click', closePanel);
if (panelDialog) {
  panelDialog.addEventListener('cancel', event => {
    event.preventDefault();
    closePanel();
  });
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closePanel();
  }
});

applyAccessibilitySettings();
resetGameState();
setOverlayVisibility(true);
updateStartButton();
