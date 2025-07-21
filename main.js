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
	document.getElementById("clickerValueGang").textContent = stats.clickPower;
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