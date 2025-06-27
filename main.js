let clicks = 0;
let clickPower = 1;
let autoClickers = 0;

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

// Загрузка сохранения при старте
function loadGame() {
	const savedData = localStorage.getItem('clickerSave');
	if (savedData) {
		const gameData = JSON.parse(atob(savedData));
		clicks = gameData.clicks || 0;
		clickPower = gameData.clickPower || 1;
		autoClickers = gameData.autoClickers || 0;
		updateCounter();
		console.log("Игра загружена!");
	}
}

// Сохранение игры
function saveGame() {
    const gameData = btoa(JSON.stringify({
        clicks: clicks,
        clickPower: clickPower,
        autoClickers: autoClickers
    }));
    localStorage.setItem('clickerSave', gameData);
    console.log("Игра сохранена!");
}

// Обновление характеристик
function updateStats() {
	document.getElementById("clickerValueClick").textContent = clickPower;
	document.getElementById("clickerValueAutoclick").textContent = autoClickers;
	document.getElementById("clickCost").textContent = upgrades["click"].price;
	document.getElementById("autoClickCost").textContent = upgrades["autoClick"].price;
}

// Обновляем счетчик
function updateCounter() {
    document.getElementById("clickerCount").textContent = clicks;
    updateStats();
}

// Клик по плазме
document.getElementById("clickerMainObject").addEventListener("click", function() {
    clicks += clickPower;
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

	if (clicks >= price) {
		clicks -= price;
		upg.count++;
		
		if (upgradeType === "click") {
			clickPower += upg.effect;
		} else if (upgradeType === "autoClicker") {
			autoClickers += upg.effect;
		}
		
		updateCounter();
	}
}

// Автоклики каждую секунду
setInterval(function() {
    clicks += autoClickers;
    updateCounter();
}, 1000);

// Сбросить игру
function resetGame() {
    if (confirm("Точно сбросить прогресс?")) {
        localStorage.removeItem('clickerSave');
        clicks = 0;
        clickPower = 1;
        autoClickers = 0;
        updateCounter();
    }
}

// Автосохранение каждые 30 сек (опционально)
setInterval(saveGame, 10000);

// Загружаем игру при старте
window.onload = loadGame;