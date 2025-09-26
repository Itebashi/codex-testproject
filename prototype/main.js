const verbs = [
  { id: 'Look', label: '調べる' },
  { id: 'Open', label: '開ける' },
  { id: 'Take', label: '取る' },
  { id: 'Use', label: '使う' },
  { id: 'Move', label: '移動' }
];

const itemCatalog = {
  studyKey: {
    id: 'studyKey',
    name: '書斎の鍵',
    description: '机の引き出しから見つかった古びた鍵。'
  },
  crowbar: {
    id: 'crowbar',
    name: '細いバール',
    description: '肖像画の裏に隠されていた軽いバール。'
  },
  brassKey: {
    id: 'brassKey',
    name: '真鍮の鍵',
    description: '木箱の中で光っていた装飾付きの鍵。'
  }
};

const state = {
  currentScene: 'study',
  inventory: [],
  selectedVerb: 'Look',
  selectedItemId: null,
  flags: {},
  visitedScenes: {}
};

const scenes = {
  study: {
    id: 'study',
    name: '書斎',
    caption: '埃と古い秘密が沈殿した静かな書斎だ。',
    entryMessage: '実験が始まった書斎にいる。扉は外側から施錠されている。',
    image: 'scenes/study.svg',
    hotspots: [
      {
        id: 'desk',
        name: '執務机',
        area: { x: 80, y: 300, width: 240, height: 140 },
        actions: {
          Look: () => {
            logMessage('使い込まれたオーク材の机だ。引き出しは膨らんで閉じている。');
          },
          Open: () => {
            if (!state.flags.deskOpened) {
              state.flags.deskOpened = true;
              logMessage('力を込めると引き出しが開き、内側で小さな鍵が光った。');
            } else {
              logMessage('引き出しはすでに開いている。');
            }
          },
          Take: () => {
            if (state.flags.deskOpened && !hasItem('studyKey')) {
              addItem('studyKey');
              logMessage('書斎の鍵を手に入れた。歯はすり減っている。');
            } else if (!state.flags.deskOpened) {
              logMessage('引き出しを引くがびくともしない。');
            } else {
              logMessage('机から取れるものはもう残っていない。');
            }
          }
        }
      },
      {
        id: 'portrait',
        name: '家族の肖像画',
        area: { x: 360, y: 120, width: 180, height: 220 },
        actions: {
          Look: () => {
            if (!state.flags.portraitShifted) {
              logMessage('厳しい表情の肖像画がこちらを見下ろしている。額縁が少し傾いているようだ。');
            } else {
              logMessage('肖像画は横に開かれており、浅い隙間が露出している。');
            }
          },
          Open: () => {
            if (!state.flags.portraitShifted) {
              state.flags.portraitShifted = true;
              logMessage('額縁を押すと隠し蝶番で回転し、細いバールが現れた。');
            } else {
              logMessage('隠しスペースはすでに露出している。');
            }
          },
          Take: () => {
            if (state.flags.portraitShifted && !hasItem('crowbar')) {
              addItem('crowbar');
              logMessage('細いバールを取った。固いものをこじ開けるのに良さそうだ。');
            } else if (!state.flags.portraitShifted) {
              logMessage('絵を探るが何も起こらない。');
            } else {
              logMessage('隙間にはもう何も残っていない。');
            }
          }
        }
      },
      {
        id: 'studyDoor',
        name: '書斎の扉',
        area: { x: 820, y: 160, width: 100, height: 240 },
        actions: {
          Look: () => {
            if (state.flags.studyDoorUnlocked) {
              logMessage('扉は少し開き、細い廊下へと続いている。');
            } else {
              logMessage('古い錠前が付いた重いオーク材の扉が行く手を塞いでいる。');
            }
          },
          Use: ({ item }) => {
            if (!item) {
              logMessage('扉に使う前にアイテムを選ぶ必要がある。');
              return;
            }
            if (item.id === 'studyKey') {
              if (!state.flags.studyDoorUnlocked) {
                state.flags.studyDoorUnlocked = true;
                removeItem('studyKey');
                logMessage('錠前で鍵が軋むが、ほどなくして解錠された。');
              } else {
                logMessage('扉はすでに解錠されている。');
              }
            } else {
              logMessage('そのアイテムでは錠前に変化はない。');
            }
          },
          Move: () => {
            if (state.flags.studyDoorUnlocked) {
              changeScene('hallway');
            } else {
              logMessage('取っ手はほとんど回らない。まず解錠しなければ。');
            }
          }
        }
      },
      {
        id: 'notes',
        name: '散らばったメモ',
        area: { x: 640, y: 340, width: 200, height: 120 },
        actions: {
          Look: () => {
            logMessage('メモには「真実をこじ開ける者だけが夜明けを見る」と記されている。');
          }
        }
      }
    ]
  },
  hallway: {
    id: 'hallway',
    name: '廊下',
    caption: '木箱と鉄格子が並ぶ風の通る廊下だ。',
    entryMessage: '床板が軋む廊下だ。木箱が鉄格子への道を塞いでいる。',
    image: 'scenes/hallway.svg',
    hotspots: [
      {
        id: 'backDoor',
        name: '書斎への扉',
        area: { x: 60, y: 160, width: 120, height: 240 },
        actions: {
          Look: () => {
            logMessage('書斎へ戻る扉はもう自由に開閉できる。');
          },
          Move: () => {
            changeScene('study');
          }
        }
      },
      {
        id: 'crate',
        name: '木箱',
        area: { x: 320, y: 300, width: 200, height: 150 },
        actions: {
          Look: () => {
            if (!state.flags.crateOpened) {
              logMessage('木箱は釘で固く閉じられている。中で何かが揺れる音がする。');
            } else {
              logMessage('木箱はこじ開けられ、藁の中に真鍮の鍵が見えている。');
            }
          },
          Use: ({ item }) => {
            if (!item) {
              logMessage('木箱をこじ開けるためのアイテムを選ぶ必要がある。');
              return;
            }
            if (item.id === 'crowbar') {
              if (!state.flags.crateOpened) {
                state.flags.crateOpened = true;
                logMessage('バールを隙間に差し込みこじ開けると、真鍮の鍵が輝いた。');
              } else {
                logMessage('木箱はすでに開いている。');
              }
            } else {
              logMessage('そのアイテムでは木箱はびくともしない。');
            }
          },
          Take: () => {
            if (state.flags.crateOpened && !hasItem('brassKey')) {
              addItem('brassKey');
              logMessage('木箱から真鍮の鍵を取り出した。');
            } else if (!state.flags.crateOpened) {
              logMessage('蓋が固すぎて何も取り出せない。');
            } else {
              logMessage('木箱に役立つものはもう残っていない。');
            }
          }
        }
      },
      {
        id: 'gate',
        name: '鉄格子',
        area: { x: 700, y: 150, width: 160, height: 250 },
        actions: {
          Look: () => {
            if (state.flags.foyerUnlocked) {
              logMessage('鉄格子は開いており、その先に玄関ホールが見える。');
            } else {
              logMessage('鉄の格子には装飾的な錠前が付いている。向こう側から新鮮な空気が流れ込む。');
            }
          },
          Use: ({ item }) => {
            if (!item) {
              logMessage('格子に使うアイテムを先に選んでほしい。');
              return;
            }
            if (item.id === 'brassKey') {
              if (!state.flags.foyerUnlocked) {
                state.flags.foyerUnlocked = true;
                removeItem('brassKey');
                logMessage('真鍮の鍵がぴたりとはまり、心地よい音を立てて解錠された。');
              } else {
                logMessage('格子はすでに開いている。');
              }
            } else {
              logMessage('そのアイテムは錠前に合わない。');
            }
          },
          Move: () => {
            if (state.flags.foyerUnlocked) {
              changeScene('foyer');
            } else {
              logMessage('格子はびくともしない。まず解錠が必要だ。');
            }
          }
        }
      },
      {
        id: 'sconce',
        name: '壁の燭台',
        area: { x: 460, y: 140, width: 120, height: 140 },
        actions: {
          Look: () => {
            logMessage('燭台が揺らめき、影が木箱と鉄格子を指し示すように伸びている。');
          },
          Use: () => {
            logMessage('燭台を動かしてみたが何も起こらない。手がかりは別にあるようだ。');
          }
        }
      }
    ]
  },
  foyer: {
    id: 'foyer',
    name: '玄関ホール',
    caption: '夜の冷たい空気が満ちている静かなホールだ。',
    entryMessage: '玄関ホールに夜風が流れ込んでいる。自由はもう一歩先だ。',
    image: 'scenes/foyer.svg',
    hotspots: [
      {
        id: 'backGate',
        name: '廊下への格子',
        area: { x: 700, y: 150, width: 160, height: 250 },
        layer: 2,
        actions: {
          Look: () => logMessage('廊下へ戻る格子は開いたままだ。'),
          Move: () => changeScene('hallway')
        }
      },
      {
        id: 'frontDoor',
        name: '玄関扉',
        area: { x: 360, y: 140, width: 240, height: 280 },
        layer: 3,
        actions: {
          Look: () => {
            if (state.flags.escaped) {
              logMessage('開いた扉の向こうに外の世界が広がる。夜は君のものだ。');
            } else {
              logMessage('玄関扉は半開きで、外の世界が呼びかけている。');
            }
          },
          Move: () => {
            if (!state.flags.escaped) {
              state.flags.escaped = true;
              logMessage('玄関を踏み越え、外気を大きく吸い込む。Codex 邸からの脱出に成功した！', { highlight: true });
              displayEnding();
            } else {
              logMessage('すでに自由を手に入れている。');
            }
          }
        }
      },
      {
        id: 'nightAir',
        name: '夜気',
        area: { x: 470, y: 230, width: 70, height: 110 },
        actions: {
          Look: () => {
            logMessage('扉の向こうで夜空が瞬いている。');
          },
          Take: () => {
            logMessage('夜気を瓶に詰めることはできないが、その冷たさを味わう。');
          }
        }
      }
    ]
  }
};

const verbButtons = document.getElementById('verb-buttons');
const inventoryList = document.getElementById('inventory-list');
const textLog = document.getElementById('text-log');
const sceneImage = document.getElementById('scene-image');
const sceneCaption = document.getElementById('scene-caption');
const hotspotsContainer = document.getElementById('hotspots');
const mobileNav = document.getElementById('mobile-nav');
const mobileButtons = mobileNav ? Array.from(mobileNav.querySelectorAll('.mobile-tab')) : [];
const mobilePanels = {
  actions: document.getElementById('actions-panel'),
  inventory: document.getElementById('inventory'),
  journal: document.getElementById('journal')
};
const mobileMediaQuery = window.matchMedia('(max-width: 720px)');
let activeMobilePanel = 'actions';

function applyMobileLayout() {
  if (!mobileNav) return;
  const isMobile = mobileMediaQuery.matches;
  Object.entries(mobilePanels).forEach(([panelId, panel]) => {
    if (!panel) return;
    if (isMobile) {
      const isActive = panelId === activeMobilePanel;
      panel.hidden = !isActive;
      panel.classList.toggle('mobile-active', isActive);
    } else {
      panel.hidden = false;
      panel.classList.remove('mobile-active');
    }
  });

  mobileButtons.forEach((button) => {
    const isActive = isMobile && button.dataset.panelTarget === activeMobilePanel;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    button.tabIndex = isMobile ? 0 : -1;
  });
}

function setMobilePanel(panelId) {
  if (!mobileNav) return;
  if (!mobilePanels[panelId]) {
    panelId = 'actions';
  }
  activeMobilePanel = panelId;
  applyMobileLayout();
}

if (mobileNav) {
  mobileButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setMobilePanel(button.dataset.panelTarget);
    });
  });
  const handleMobileChange = () => {
    if (!mobileMediaQuery.matches) {
      activeMobilePanel = 'actions';
    }
    applyMobileLayout();
  };
  if (typeof mobileMediaQuery.addEventListener === 'function') {
    mobileMediaQuery.addEventListener('change', handleMobileChange);
  } else if (typeof mobileMediaQuery.addListener === 'function') {
    mobileMediaQuery.addListener(handleMobileChange);
  }
}

function renderVerbs() {
  verbButtons.innerHTML = '';
  verbs.forEach((verb) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `verb-button${state.selectedVerb === verb.id ? ' selected' : ''}`;
    button.textContent = verb.label;
    button.addEventListener('click', () => selectVerb(verb.id));
    button.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectVerb(verb.id);
      }
    });
    verbButtons.appendChild(button);
  });
}

function selectVerb(verbId) {
  state.selectedVerb = verbId;
  if (verbId !== 'Use') {
    state.selectedItemId = null;
  }
  renderVerbs();
  renderInventory();
}

function renderInventory() {
  inventoryList.innerHTML = '';
  if (state.inventory.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = 'アイテムは所持していない';
    empty.className = 'empty';
    empty.style.cursor = 'default';
    empty.setAttribute('aria-disabled', 'true');
    inventoryList.appendChild(empty);
    return;
  }

  state.inventory.forEach((itemId) => {
    const item = itemCatalog[itemId];
    const li = document.createElement('li');
    if (state.selectedItemId === itemId) {
      li.classList.add('selected');
    }

    const name = document.createElement('span');
    name.className = 'inventory-name';
    name.textContent = item.name;
    li.appendChild(name);

    const description = document.createElement('span');
    description.className = 'inventory-description';
    description.textContent = item.description;
    li.appendChild(description);

    li.tabIndex = 0;
    li.addEventListener('click', () => toggleItemSelection(itemId));
    li.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleItemSelection(itemId);
      }
    });

    inventoryList.appendChild(li);
  });
}

function toggleItemSelection(itemId) {
  if (state.selectedItemId === itemId) {
    state.selectedItemId = null;
  } else {
    state.selectedItemId = itemId;
    if (state.selectedVerb !== 'Use') {
      state.selectedVerb = 'Use';
      renderVerbs();
    }
  }
  renderInventory();
}

function changeScene(sceneId) {
  const scene = scenes[sceneId];
  if (!scene) return;
  state.currentScene = sceneId;
  sceneImage.src = scene.image;
  sceneImage.alt = scene.name;
  sceneCaption.textContent = scene.caption;
  renderHotspots(scene);
  const firstVisit = !state.visitedScenes[sceneId];
  state.visitedScenes[sceneId] = true;
  if (scene.entryMessage) {
    logMessage(scene.entryMessage, { highlight: firstVisit });
  } else if (firstVisit) {
    logMessage(`${scene.name}に到着した。`, { highlight: true });
  } else if (scene.caption) {
    logMessage(scene.caption);
  }
}

function renderHotspots(scene) {
  hotspotsContainer.innerHTML = '';
  scene.hotspots.forEach((hotspot) => {
    const hotspotEl = document.createElement('div');
    hotspotEl.className = 'hotspot';
    hotspotEl.style.left = `${hotspot.area.x}px`;
    hotspotEl.style.top = `${hotspot.area.y}px`;
    hotspotEl.style.width = `${hotspot.area.width}px`;
    hotspotEl.style.height = `${hotspot.area.height}px`;
    hotspotEl.style.zIndex = hotspot.layer ?? 1;
    hotspotEl.dataset.name = hotspot.name;
    hotspotEl.title = hotspot.name;
    hotspotEl.tabIndex = 0;
    hotspotEl.addEventListener('click', () => handleHotspotInteraction(hotspot));
    hotspotEl.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleHotspotInteraction(hotspot);
      }
    });
    hotspotsContainer.appendChild(hotspotEl);
  });
}

function handleHotspotInteraction(hotspot) {
  const verb = state.selectedVerb || 'Look';
  const scene = scenes[state.currentScene];
  const context = {
    scene,
    hotspot,
    item: state.selectedItemId ? itemCatalog[state.selectedItemId] : null
  };

  if (verb === 'Use' && !context.item && hotspot.actions?.Use) {
    logMessage('先に使用するアイテムを選択してほしい。');
    return;
  }

  const action = hotspot.actions?.[verb];
  if (typeof action === 'function') {
    action(context);
    if (verb === 'Use' && context.item && !hasItem(context.item.id)) {
      state.selectedItemId = null;
      renderInventory();
      renderVerbs();
    }
    return;
  }

  if (verb === 'Take') {
    logMessage('ここで取れるものはない。');
    return;
  }

  if (verb === 'Move') {
    logMessage('その方向へは進めない。');
    return;
  }

  logMessage('特に変化は起こらなかった。');
}

function logMessage(message, options = {}) {
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  if (options.highlight) {
    const strong = document.createElement('strong');
    strong.textContent = message;
    entry.appendChild(strong);
  } else {
    entry.textContent = message;
  }
  textLog.appendChild(entry);
  textLog.scrollTop = textLog.scrollHeight;
}

function addItem(itemId) {
  if (!hasItem(itemId)) {
    state.inventory.push(itemId);
    renderInventory();
    if (mobileNav && mobileMediaQuery.matches) {
      setMobilePanel('inventory');
    }
  }
}

function removeItem(itemId) {
  state.inventory = state.inventory.filter((id) => id !== itemId);
  if (state.selectedItemId === itemId) {
    state.selectedItemId = null;
  }
  renderInventory();
}

function hasItem(itemId) {
  return state.inventory.includes(itemId);
}

function displayEnding() {
  hotspotsContainer.innerHTML = '';
  const ending = document.createElement('div');
  ending.className = 'log-entry';
  ending.innerHTML = '<strong>脱出成功！</strong> Codex 邸からの脱出シナリオをクリアした。SVG や効果音を差し替えて独自の冒険に仕立てよう。';
  textLog.appendChild(ending);
  textLog.scrollTop = textLog.scrollHeight;
}

function initialise() {
  applyMobileLayout();
  renderVerbs();
  renderInventory();
  logMessage('Codex 脱出プロトタイプへようこそ。書斎を探索し、外へ出る手段を見つけよう。', { highlight: true });
  changeScene(state.currentScene);
}

initialise();
