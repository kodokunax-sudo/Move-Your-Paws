// main.js — инициализация и связывание всего вместе

document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем Canvas
    Renderer.init('gameCanvas');
    
    // Инициализируем игру
    GameState.init();
    
    // Обновляем UI
    updateUI();

    // Игровой цикл
    function gameLoop() {
        GameState.update();
        Renderer.render();
        updateUI();
        requestAnimationFrame(gameLoop);
    }

    // Обновление счётчиков в UI
    function updateUI() {
        const stats = GameState.getStats();
        document.getElementById('foodCounter').textContent = stats.totalFood;
        document.getElementById('antCounter').textContent = stats.antCount;
    }

    // Добавление муравья по кнопке
    document.getElementById('addAntBtn').addEventListener('click', () => {
        GameState.spawnAnt();
        updateUI();
    });

    // Рассыпать случайные крошки
    document.getElementById('addFoodBtn').addEventListener('click', () => {
        for (let i = 0; i < 5; i++) {
            GameState.addRandomFood();
        }
    });

    // Клик по canvas — добавить еду
    document.getElementById('gameCanvas').addEventListener('click', (e) => {
        const rect = Renderer.canvas.getBoundingClientRect();
        const scaleX = GameState.WIDTH / rect.width;
        const scaleY = GameState.HEIGHT / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        GameState.addFood(x, y);
    });

    // Запускаем игру!
    gameLoop();
    console.log('🐜 Муравьиная колония запущена!');
});
