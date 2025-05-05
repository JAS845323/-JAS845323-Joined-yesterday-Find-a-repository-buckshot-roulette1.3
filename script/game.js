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
        // 根據回合設置子彈數量
        let bulletCount = 0;
        switch(this.round) {
            case 1: bulletCount = 2; break;
            case 2: bulletCount = 3; break;
            case 3: bulletCount = 4; break;
        }
        
        // 隨機生成實彈和空包彈
        this.currentBullets = [];
        const liveBullets = Math.ceil(bulletCount / 2);
        for (let i = 0; i < bulletCount; i++) {
            this.currentBullets.push({
                isLive: i < liveBullets,
                revealed: false
            });
        }
        
        // 洗牌
        this.shuffleBullets();
        
        // 分配道具
        this.distributeItems();
    }
    
    static shuffleBullets() {
        this.chamber = [...this.currentBullets];
        for (let i = this.chamber.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.chamber[i], this.chamber[j]] = [this.chamber[j], this.chamber[i]];
        }
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
        
        for (let i = 0; i < itemCount; i++) {
            const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
            this.playerItems.push(randomItem);
            
            const aiRandomItem = allItems[Math.floor(Math.random() * allItems.length)];
            this.aiItems.push(aiRandomItem);
        }
    }
    
    static playerShoot(target) {
        if (!this.playerTurn || this.chamber.length === 0) return;
        
        const bullet = this.chamber.pop();
        const isLive = bullet.isLive;
        
        // 播放音效
        Utils.playSound('shot.mp3');
        
        if (target === 'self') {
            if (isLive) {
                this.playerHealth--;
                this.showMessage('你中彈了！');
                this.playerTurn = false;
                this.checkGameOver();
                if (this.playerHealth > 0) {
                    setTimeout(() => this.aiTurn(), 1500);
                }
            } else {
                this.showMessage('空包彈！繼續你的回合');
            }
        } else {
            if (isLive) {
                this.aiHealth--;
                this.showMessage('AI中彈了！');
            } else {
                this.showMessage('空包彈！');
            }
            this.playerTurn = false;
            this.checkGameOver();
            if (this.aiHealth > 0) {
                setTimeout(() => this.aiTurn(), 1500);
            }
        }
        
        this.updateUI();
    }
    
    static aiTurn() {
        if (this.chamber.length === 0) {
            this.nextRound();
            return;
        }
        
        // AI決策
        const action = AI.makeDecision(this.aiItems, this.chamber.length, this.round, this.aiHealth);
        
        if (action.startsWith('USE_')) {
            const item = action.split('_')[1];
            this.useAIItem(item.toLowerCase());
            this.aiTurn(); // 使用道具後繼續行動
            return;
        }
        
        if (action === 'SHOOT_SELF') {
            const bullet = this.chamber.pop();
            if (bullet.isLive) {
                this.aiHealth--;
                this.showMessage('AI對自己開槍... 中彈了！');
                this.checkGameOver();
            } else {
                this.showMessage('AI對自己開槍... 空包彈！');
            }
        } else if (action === 'SHOOT_PLAYER') {
            const bullet = this.chamber.pop();
            if (bullet.isLive) {
                this.playerHealth--;
                this.showMessage('AI對你開槍... 你中彈了！');
                this.checkGameOver();
            } else {
                this.showMessage('AI對你開槍... 空包彈！');
            }
        }
        
        this.playerTurn = true;
        this.updateUI();
    }
    
    static useAIItem(item) {
        const index = this.aiItems.indexOf(item);
        if (index === -1) return;
        
        this.aiItems.splice(index, 1);
        Items.useItem(item, 'ai');
        this.showMessage(`AI使用了${Items.getItemName(item)}！`);
    }
    
    static checkGameOver() {
        if (this.playerHealth <= 0) {
            if (this.round < 3) {
                // 第一或第二局使用除顫器
                this.playerHealth = 1;
                this.showMessage('你被除顫器救活了... 繼續遊戲！');
                Utils.playSound('electric-zap.mp3');
                this.updateUI();
            } else {
                // 第三局遊戲結束
                this.showMessage('遊戲結束！你死了...');
                this.endGame(false);
            }
        } else if (this.aiHealth <= 0) {
            if (this.round < 3) {
                // 進入下一局
                this.round++;
                this.aiHealth = 3;
                this.setupRound();
                this.showMessage(`進入第${this.round}局！`);
                this.updateUI();
            } else {
                // 遊戲勝利
                this.showMessage('恭喜！你擊敗了AI！');
                this.endGame(true);
            }
        }
    }
    
    static nextRound() {
        this.showMessage('彈匣空了，進入下一輪！');
        this.setupRound();
        this.updateUI();
    }
    
    static updateUI() {
        // 更新血條
        document.getElementById('player-health').querySelector('.blood-fill').style.width = `${(this.playerHealth / 3) * 100}%`;
        document.getElementById('ai-health').querySelector('.blood-fill').style.width = `${(this.aiHealth / 3) * 100}%`;
        
        // 更新回合顯示
        document.getElementById('round-display').textContent = `第${this.round}局`;
        
        // 更新道具欄
        this.updateItemSlots('player');
        this.updateItemSlots('ai');
        
        // 更新按鈕狀態
        document.getElementById('shoot-self').disabled = !this.playerTurn || this.chamber.length === 0;
        document.getElementById('shoot-ai').disabled = !this.playerTurn || this.chamber.length === 0;
    }
    
    static updateItemSlots(who) {
        const container = document.getElementById(`${who}-items`);
        container.innerHTML = '';
        
        const items = who === 'player' ? this.playerItems : this.aiItems;
        
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item-icon';
            itemElement.style.backgroundImage = `url('assets/images/items/${item}.png')`;
            itemElement.title = Items.getItemName(item);
            
            if (who === 'player') {
                itemElement.addEventListener('click', () => this.usePlayerItem(item));
            }
            
            container.appendChild(itemElement);
        });
    }
    
    static usePlayerItem(item) {
        if (!this.playerTurn) return;
        
        const index = this.playerItems.indexOf(item);
        if (index === -1) return;
        
        this.playerItems.splice(index, 1);
        Items.useItem(item, 'player');
        this.showMessage(`你使用了${Items.getItemName(item)}！`);
        this.updateUI();
    }
    
    static showMessage(msg) {
        const msgElement = document.getElementById('message-display');
        msgElement.textContent = msg;
        msgElement.style.opacity = 1;
        
        setTimeout(() => {
            msgElement.style.opacity = 0;
        }, 2000);
    }
    
    static endGame(isWin) {
        this.playerTurn = false;
        document.getElementById('shoot-self').disabled = true;
        document.getElementById('shoot-ai').disabled = true;
        
        if (isWin) {
            document.body.style.backgroundColor = 'var(--blood-red)';
        } else {
            document.body.style.backgroundColor = 'var(--dried-blood)';
        }
    }
}