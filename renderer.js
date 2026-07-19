// renderer.js — только функции рисования

const Renderer = {
    canvas: null,
    ctx: null,

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = GameState.WIDTH;
        this.canvas.height = GameState.HEIGHT;
    },

    clear() {
        this.ctx.clearRect(0, 0, GameState.WIDTH, GameState.HEIGHT);
    },

    drawNest() {
        const { x, y, radius } = GameState.nest;
        const ctx = this.ctx;

        // Тень муравейника
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 20;

        // Основной холм
        ctx.fillStyle = '#5c3d1a';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Внутренняя текстура
        ctx.fillStyle = '#3b260d';
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.75, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Вход
        ctx.fillStyle = '#1a0f00';
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Декоративные камешки
        ctx.fillStyle = '#7a6b5c';
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const cx = x + Math.cos(angle) * radius * 0.7;
            const cy = y + Math.sin(angle) * radius * 0.7;
            ctx.beginPath();
            ctx.arc(cx, cy, 2 + Math.random() * 3, 0, Math.PI * 2);
            ctx.fill();
        }
    },

    drawFoodItems() {
        const ctx = this.ctx;
        for (let food of GameState.foodItems) {
            // Тень
            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetY = 2;

            // Основной круг
            ctx.fillStyle = '#f7d44a';
            ctx.beginPath();
            ctx.arc(food.x, food.y, food.size, 0, Math.PI * 2);
            ctx.fill();

            // Блик
            ctx.fillStyle = '#b38b2a';
            ctx.beginPath();
            ctx.arc(food.x, food.y, food.size * 0.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    },

    drawAnt(ant) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(ant.x, ant.y);
        ctx.rotate(ant.angle);

        // Тень
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetY = 2;

        // Брюшко (задняя часть)
        ctx.fillStyle = '#2a1e0a';
        ctx.beginPath();
        ctx.ellipse(-3, 0, 5, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Грудка
        ctx.fillStyle = '#3a2a1a';
        ctx.beginPath();
        ctx.ellipse(2, 0, 4, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Голова
        ctx.fillStyle = '#1a0f00';
        ctx.beginPath();
        ctx.arc(7, 0, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Глаза
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.arc(8.5, -1.5, 1, 0, Math.PI * 2);
        ctx.fill();

        // Усики
        ctx.strokeStyle = '#1a1205';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(10, -1);
        ctx.lineTo(13, -4);
        ctx.moveTo(10, 1);
        ctx.lineTo(13, 4);
        ctx.stroke();

        // Лапки
        ctx.strokeStyle = '#1a1205';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-2, -3); ctx.lineTo(-4, -6);
        ctx.moveTo(-2, 3); ctx.lineTo(-4, 6);
        ctx.moveTo(3, -3); ctx.lineTo(5, -7);
        ctx.moveTo(3, 3); ctx.lineTo(5, 7);
        ctx.stroke();

        // Ноша (еда)
        if (ant.carryingFood) {
            ctx.fillStyle = '#f5c542';
            ctx.beginPath();
            ctx.arc(7, -4, 3.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#b38b2a';
            ctx.beginPath();
            ctx.arc(7, -4, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    },

    drawAllAnts() {
        for (let ant of GameState.ants) {
            this.drawAnt(ant);
        }
    },

    // Отладочная информация
    drawDebugInfo() {
        const stats = GameState.getStats();
        // Можно рисовать дополнительную информацию прямо на canvas
    },

    render() {
        this.clear();
        
        // Фон с текстурой травы
        const gradient = this.ctx.createLinearGradient(0, 0, 0, GameState.HEIGHT);
        gradient.addColorStop(0, '#6b9b3a');
        gradient.addColorStop(1, '#4a7a2e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, GameState.WIDTH, GameState.HEIGHT);
        
        // Случайные травинки
        this.ctx.fillStyle = '#5c8a3c';
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * GameState.WIDTH;
            const y = Math.random() * GameState.HEIGHT;
            this.ctx.fillRect(x, y, 2, 6 + Math.random() * 8);
        }

        this.drawNest();
        this.drawFoodItems();
        this.drawAllAnts();
    }
};
