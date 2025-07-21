let stats = {
	clicks: 0,
	clickPower: 1,
	autoClickers: 0
}

let upgrades = {
	click: {
		price: 10,
		count: 0,
		multiplier: 1.3,
		effect: 1,
	},
	autoClick: {
		price: 50,
		count: 0,
		multiplier: 1.5,
		effect: 0.5,
	}
}

let mapList = [
	{id: 1, name: "Cen", defender: 0, reward: 0, captured: false, locked: false},
	{id: 2, name: "Gom", defender: 0, reward: 0, captured: false, locked: false},
	{id: 3, name: "Sam", defender: 0, reward: 0, captured: false, locked: false},
	{id: 4, name: "Rem", defender: 0, reward: 0, captured: false, locked: false},
	{id: 5, name: "Vok", defender: 0, reward: 0, captured: false, locked: false},
	{id: 6, name: "Shi", defender: 0, reward: 0, captured: false, locked: false},
	{id: 7, name: "Nin", defender: 0, reward: 0, captured: false, locked: false},
	{id: 8, name: "Med", defender: 0, reward: 0, captured: false, locked: false},
	{id: 9, name: "Gon", defender: 0, reward: 0, captured: false, locked: false},
	{id: 10, name: "Nag", defender: 0, reward: 0, captured: false, locked: false},
	{id: 11, name: "Tar", defender: 0, reward: 0, captured: false, locked: false},
	{id: 12, name: "Zar", defender: 0, reward: 0, captured: false, locked: false},
];

let mapLocation = [
	[0, 0, 11, 0, 0, 0, 0],
	[8, 7, 2, 1, 3, 4, 10],
	[0, 0, 12, 5, 6, 0, 0],
	[0, 0, 0, 9, 0, 0, 0],
]

// Создаём карту
function renderMap() {
    const map = document.getElementById('clickerMap');
    map.innerHTML = '';
	map.style.cssText = `
		grid-template-columns: repeat(${mapLocation[0].length}, 1fr);
		grid-template-rows: repeat(${mapLocation.length}, 1fr);
	`

    mapLocation.forEach(row => {
		row.forEach(item => {
			const cell = document.createElement('div');

			if(item != 0) { 
				let el = mapList[item - 1];

				cell.className = `territory ${el.captured ? 'captured' : ''} ${el.locked ? 'locked' : ''}`;
				cell.textContent = el.name;
        		cell.dataset.id = el.id;

				if (!el.locked && !el.captured) {
					cell.addEventListener('click', () => captureTerritory(el.id));
				}
			}

			map.appendChild(cell);
		})

    });
}

// Захват территории
function captureTerritory(territoryId) {
    const territory = mapList.find(t => t.id === territoryId);
    
    if (stats.clicks >= territory.defender) {
        stats.clicks -= territory.defender;
		territory.defender += 10; 
        territory.captured = true;
        
        updateCounter();
        renderMap();
    } else {
        alert(`Нужно больше армии! Требуется: ${territory.defender}`);
    }
}
// Загрузка сохранения при старте
function loadGame() {
	const savedData = localStorage.getItem('clickerSave');
	if (savedData) {
		const gameData = JSON.parse(atob(savedData));
		stats.clicks = gameData.clicks || 0;
		stats.clickPower = gameData.clickPower || 1;
		stats.autoClickers = gameData.autoClickers || 0;
		upgrades = gameData.upgrades || {click: {price: 10, count: 0, multiplier: 1.3, effect: 1}, autoClick: {price: 50, count: 0, multiplier: 1.5, effect: 0.5}}
		updateCounter();
		console.log("Игра загружена!");
	}
	renderMap();
}

// Сохранение игры
function saveGame() {
    const gameData = btoa(JSON.stringify({
        clicks: stats.clicks,
        clickPower: stats.clickPower,
        autoClickers: stats.autoClickers,
				upgrades: upgrades
    }));
    localStorage.setItem('clickerSave', gameData);
    console.log("Игра сохранена!");
}

// Обновление характеристик
function updateStats() {
	document.getElementById("clickerValueClick").textContent = stats.clickPower;
	document.getElementById("clickerValueAutoclick").textContent = stats.autoClickers;
	
	document.getElementById("clickCount").textContent = `x${upgrades['click'].count}`;
	document.getElementById("autoClickCount").textContent = `x${upgrades['autoClick'].count}`;

	document.getElementById("clickCost").textContent = getPrice("click");
	document.getElementById("autoClickCost").textContent = getPrice("autoClick");
}

// Обновляем счетчик
function updateCounter() {
    document.getElementById("clickerCount").textContent = stats.clicks;
    updateStats();
}

// Клик по монетке
document.getElementById("clickerMainObject").addEventListener("click", function() {
    stats.clicks += stats.clickPower;
	updateCounter();
    saveGame();
});

// Расчёт цены
function getPrice(upgradeType) {
    const upg = upgrades[upgradeType];
		
		if(upg.count < 5) return Math.floor(upg.price + (upg.multiplier * upg.count));
    return Math.floor(upg.price * Math.pow(upg.multiplier, upg.count));
}

// Покупка улучшения
function buyUpgrade(upgradeType) {
	const upg = upgrades[upgradeType];
	const price = getPrice(upgradeType);

	if (stats.clicks >= price) {
		stats.clicks -= price;
		upg.count++;
		upg.price = price;
		
		if (upgradeType === "click") {
			stats.clickPower += upg.effect;
		} else if (upgradeType === "autoClick") {
			stats.autoClickers += upg.effect;
		}
		
		updateCounter();
	}
}

// Автоклики каждую секунду
setInterval(function() {
    stats.clicks += stats.autoClickers;
    updateCounter();
}, 1000);

// Сбросить игру
function resetGame() {
    if (confirm("Точно сбросить прогресс?")) {
        localStorage.removeItem('clickerSave');
        stats.clicks = 0;
        stats.clickPower = 1;
        stats.autoClickers = 0;
				upgrades = {click: {price: 10, count: 0, multiplier: 1.3, effect: 1}, autoClick: {price: 50, count: 0, multiplier: 1.5, effect: 0.5}}
        updateCounter();
    }
}

// Автосохранение каждые 30 сек (опционально)
setInterval(saveGame, 10000);

// Загружаем игру при старте
window.onload = loadGame;