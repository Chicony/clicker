let clicks = 0;
let clickPower = 1;
let clickCost = 10;

let autoClickers = 0;
let autoClickCost = 50;

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
    document.getElementById("clickCost").textContent = clickCost;
    document.getElementById("autoClickCost").textContent = autoClickCost;
}

// Обновляем счетчик
function updateCounter() {
    document.getElementById("clickerCount").textContent = clicks;
    updateStats();
}

// Клик по плазме
document.getElementById("clickerPlazm").addEventListener("click", function() {
    clicks += clickPower;
    updateCounter();
    saveGame();
});

// Покупка улучшения
function buyUpgrade() {
    if (clicks >= clickCost) {
        clicks -= clickCost;
        clickPower += 1;
        clickCost *= 2;
        updateCounter();
    } else {
        alert("Недостаточно кликов!");
    }
}

// Автокликер (если есть)
function buyAutoClicker() {
    if (clicks >= autoClickCost) {
        clicks -= autoClickCost;
        autoClickers += 1;
        autoClickCost *= 2;
        updateCounter();
        saveGame();
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