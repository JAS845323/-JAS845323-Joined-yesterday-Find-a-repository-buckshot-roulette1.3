class Game {
    static init() {
        this.round = 1;
        this.playerHealth = 3;
        this.aiHealth = 3;
        this.currentBullets = [];
        this.chamber = [];
        this.playerTurn = true;
        this.playerItems = [];
        this.aiItems = [];
        
        this.setupRound();
        this.updateUI();
    }
    
    static setupRound() {
        // 重置枪膛
        this.chamber = [];
        
        // 根据回合设置子弹数量
        let bulletCount = 0;
        switch(this.round) {
            case 1: bulletCount = 2; break;
            case 2: bulletCount = 3; break;
            case 3: bulletCount = 4; break;
        }
        
        // 生成实弹和空包弹（至少1发实弹）
        this.currentBullets = [];
        const liveBullets = Math.max(1, Math.ceil(bulletCount / 2));
        for (let i = 0; i < bulletCount; i++) {
            this.currentBullets.push({
                isLive: i < liveBullets,
                revealed: false
            });
        }
        
        this.shuffleBullets();
        this.distributeItems(); // 确保调用道具分配
    }
    
    static distributeItems() {
        this.playerItems = [];
        this.aiItems = [];
        
        let itemCount = 0;
        switch(this.round) {
            case 1: itemCount = 0; break;
            case 2: itemCount = 2; break;
            case 3: itemCount = 4; break;
        }
        
        const allItems = ['huazi', 'handcuffs', 'knife', 'drink', 'magnifier'];
        
        // 确保玩家和AI获得随机道具
        for (let i = 0; i < itemCount; i++) {
            const randomPlayerItem = allItems[Math.floor(Math.random() * allItems.length)];
            const randomAIItem = allItems[Math.floor(Math.random() * allItems.length)];
            
            this.playerItems.push(randomPlayerItem);
            this.aiItems.push(randomAIItem);
        }
    }
    
    static playerShoot(target) {
        if (!this.playerTurn || this.chamber.length === 0) {
            this.nextRound(); // 子弹用尽时自动进入下一轮
            return;
        }
        
        const bullet = this.chamber.pop();
        const isLive = bullet.isLive;
        
        Utils.playSound('shot.mp3');
        
        if (target === 'self') {
            if (isLive) {
                this.playerHealth--;
                this.showMessage('你中弹了！');
                this.playerTurn = false;
                this.checkGameOver();
                if (this.playerHealth > 0) {
                    setTimeout(() => this.aiTurn(), 1500);
                }
            } else {
                this.showMessage('空包弹！继续你的回合');
            }
        } else {
            this.playerTurn = false;
            if (isLive) {
                this.aiHealth--;
                this.showMessage('AI中弹了！');
            } else {
                this.showMessage('空包弹！');
            }
            this.checkGameOver();
            if (this.aiHealth > 0) {
                setTimeout(() => this.aiTurn(), 1500);
            }
        }
        
        this.updateUI();
    }

    // ...（保留其他原有方法，如 aiTurn、usePlayerItem 等）...

    static nextRound() {
        this.showMessage('弹匣空了，进入下一轮！');
        this.setupRound(); // 关键修正：重新装弹和分配道具
        this.updateUI();
    }
}

// 初始化游戏
Game.init();
