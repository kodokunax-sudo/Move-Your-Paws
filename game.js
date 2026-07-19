// game.js — чистая логика, без отрисовки и DOM

const GameState = {
    WIDTH: 800,
    HEIGHT: 500,
    ants: [],
    foodItems: [],
    totalFood: 0,
    
    // Гнездо
    nest: {
        x: 400,
        y: 250,
        radius: 35
    },

    // Настройки муравьёв
    antSettings: {
        speed: 1.5,
        visionRadius: 80,
        wanderJitter: 1.2,
        wanderTimerRange: [20, 60]
    },

    // Инициализация мира
    init() {
        this.ants = [];
        this.foodItems = [];
        this.totalFood = 0;
        
        // Стартовые муравьи
        for (let i = 0; i < 10; i++) {
            this.spawnAnt();
        }
        
        // Стартовая еда
        for (let i = 0; i < 20; i++) {
            this.addRandomFood();
        }
    },

    spawnAnt() {
        const angle = Math.random() * Math.PI * 2;
        const dist = this.nest.radius + Math.random() * 30;
        const x = this.nest.x + Math.cos(angle) * dist;
        const y = this.nest.y + Math.sin(angle) * dist;
        this.ants.push(new Ant(x, y));
    },

    addRandomFood() {
        const margin = 40;
        this.foodItems.push({
            x: margin + Math.random() * (this.WIDTH - margin * 2),
            y: margin + Math.random() * (this.HEIGHT - margin * 2),
            size: 4 + Math.random() * 3
        });
    },

    addFood(x, y) {
        // Проверяем, чтобы не внутри гнезда
        const dx = x - this.nest.x;
        const dy = y - this.nest.y;
        if (Math.sqrt(dx * dx + dy * dy) > this.nest.radius + 10) {
            this.foodItems.push({
                x: x,
                y: y,
                size: 4 + Math.random() * 3
            });
        }
    },

    update() {
        for (let ant of this.ants) {
            ant.update(this);
        }
    },

    getStats() {
        return {
            totalFood: this.totalFood,
            antCount: this.ants.length,
            foodOnGround: this.foodItems.length
        };
    }
};

class Ant {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = GameState.antSettings.speed * (0.7 + Math.random() * 0.6);
        this.state = 'wander'; // 'wander', 'seekFood', 'returnHome'
        this.targetFood = null;
        this.carryingFood = false;
        this.wanderTimer = 0;
    }

    distTo(px, py) {
        const dx = this.x - px;
        const dy = this.y - py;
        return Math.sqrt(dx * dx + dy * dy);
    }

    distToNest() {
        return this.distTo(GameState.nest.x, GameState.nest.y);
    }

    update(gameState) {
        // Сдать еду в гнезде
        if (this.carryingFood && this.distToNest() < GameState.nest.radius) {
            this.carryingFood = false;
            gameState.totalFood++;
            this.state = 'wander';
        }

        switch (this.state) {
            case 'wander':
                this.wanderBehavior(gameState);
                break;
            case 'seekFood':
                this.seekFoodBehavior(gameState);
                break;
            case 'returnHome':
                this.returnHomeBehavior();
                break;
        }
    }

    wanderBehavior(gameState) {
        this.wanderTimer--;
        if (this.wanderTimer <= 0) {
            this.angle += (Math.random() - 0.5) * GameState.antSettings.wanderJitter;
            const [min, max] = GameState.antSettings.wanderTimerRange;
            this.wanderTimer = min + Math.floor(Math.random() * (max - min));
        }

        this.move();
        this.bounceOnEdges();

        // Ищем еду
        const vision = GameState.antSettings.visionRadius;
        for (let food of gameState.foodItems) {
            if (this.distTo(food.x, food.y) < vision) {
                this.state = 'seekFood';
                this.targetFood = food;
                break;
            }
        }
    }

    seekFoodBehavior(gameState) {
        // Проверяем, существует ли цель
        if (!this.targetFood || !gameState.foodItems.includes(this.targetFood)) {
            this.state = 'wander';
            this.targetFood = null;
            return;
        }

        const dx = this.targetFood.x - this.x;
        const dy = this.targetFood.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 5) {
            // Подбираем еду
            this.carryingFood = true;
            const index = gameState.foodItems.indexOf(this.targetFood);
            if (index > -1) gameState.foodItems.splice(index, 1);
            this.targetFood = null;
            this.state = 'returnHome';
        } else {
            this.angle = Math.atan2(dy, dx);
            this.move();
        }
    }

    returnHomeBehavior() {
        const dx = GameState.nest.x - this.x;
        const dy = GameState.nest.y - this.y;
        this.angle = Math.atan2(dy, dx);
        this.move();
    }

    move() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
    }

    bounceOnEdges() {
        const margin = 10;
        if (this.x < margin) { this.x = margin; this.angle = Math.PI - this.angle; }
        if (this.x > GameState.WIDTH - margin) { this.x = GameState.WIDTH - margin; this.angle = Math.PI - this.angle; }
        if (this.y < margin) { this.y = margin; this.angle = -this.angle; }
        if (this.y > GameState.HEIGHT - margin) { this.y = GameState.HEIGHT - margin; this.angle = -this.angle; }
    }
}
