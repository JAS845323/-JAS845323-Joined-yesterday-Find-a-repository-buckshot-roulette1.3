class Game {
    static init() {
        console.log("初始化血腥輪盤...");
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
        // 根據回合設置子彈
        let bulletCount = this.round + 1;
        let liveBullets = Math.max(1, Math.ceil(bulletCount / 2));
        
        this.currentBullets = [];
        for (let i = 0; i < bulletCount; i++) {
            this.currentBullets.push({
                isLive: i < liveBullets,
                revealed: false
            });
        }
        
        this.shuffleBullets();
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
        
        const allItems = ['huazi', 'handcuffs', 'knife', 'drink', 'magnifier'];
        const itemCount = this.round === 1 ? 0 : this.round + 1;
        
        for (let i = 0; i < itemCount; i++) {
            this.playerItems.push(allItems[Math.floor(Math.random() * allItems.length)]);
            this.aiItems.push(allItems[Math.floor(Math.random() * allItems.length)]);
        }
    }
    
    static playerShoot(target) {
        if (!this.playerTurn || this.chamber.length === 0) {
            this.nextRound();
            return;
        }
        
        const bullet = this.chamber.pop();
        const isLive = bullet.isLive;
        
        Utils.playSound(isLive ? 'shot.mp3' : 'click.mp3');
        
        if (target === 'self') {
            if (isLive) {
                this.playerHealth--;
                this.showMessage('💀 你中彈了！');
                this.playerTurn = false;
                this.checkGameOver();
                if (this.playerHealth > 0) setTimeout(() => this.aiTurn(), 1500);
            } else {
                this.showMessage('✅ 空包彈！繼續你的回合');
            }
        } else {
            this.playerTurn = false;
            if (isLive) {
                this.aiHealth--;
                this.showMessage('💀 AI中彈了！');
            } else {
                this.showMessage('✅ 空包彈！');
            }
            this.checkGameOver();
            if (this.aiHealth > 0) setTimeout(() => this.aiTurn(), 1500);
        }
        
        this.updateUI();
    }
    
    static aiTurn() {
        if (this.chamber.length === 0) {
            this.nextRound();
            return;
        }
        
        const action = AI.makeDecision();
        console.log("AI 行動:", action);
        
        if (action.startsWith('USE_')) {
            const item = action.split('_')[1].toLowerCase();
            this.useAIItem(item);
            this.aiTurn();
            return;
        }
        
        const bullet = this.chamber.pop();
        const isLive = bullet.isLive;
        
        if (action === 'SHOOT_SELF') {
            if (isLive) {
                this.aiHealth--;
                this.showMessage('AI對自己開槍... 💀 中彈了！');
            } else {
                this.showMessage('AI對自己開槍... ✅ 空包彈！');
            }
        } else {
            if (isLive) {
                this.playerHealth--;
                this.showMessage('AI對你開槍... 💀 你中彈了！');
            } else {
                this.showMessage('AI對你開槍... ✅ 空包彈！');
            }
        }
        
        this.checkGameOver();
        this.playerTurn = true;
        this.updateUI();
    }
    
    static useAIItem(item) {
        const index = this.aiItems.indexOf(item);
        if (index !== -1) {
            this.aiItems.splice(index, 1);
            Items.useItem(item, 'ai');
        }
    }
    
    static nextRound() {
        this.showMessage('🔁 彈匣空了，進入下一輪！');
        this.setupRound();
        this.updateUI();
    }
    
    static checkGameOver() {
        if (this.playerHealth <= 0) {
            if (this.round < 3) {
                this.playerHealth = 1;
                this.showMessage('⚡ 你被除顫器救活了！');
                Utils.playSound('electric-zap.mp3');
            } else {
                this.showMessage('☠️ 遊戲結束！你死了...');
                this.endGame(false);
            }
        } else if (this.aiHealth <= 0) {
            if (this.round < 3) {
                this.round++;
                this.aiHealth = 3;
                this.setupRound();
                this.showMessage(`🎯 進入第 ${this.round} 局！`);
            } else {
                this.showMessage('🎉 恭喜！你擊敗了AI！');
                this.endGame(true);
            }
        }
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
        if (index !== -1) {
            this.playerItems.splice(index, 1);
            Items.useItem(item, 'player');
            this.updateUI();
        }
    }
    
    static showMessage(msg) {
        const msgElement = document.getElementById('message-display');
        msgElement.textContent = msg;
        msgElement.style.opacity = 1;
        setTimeout(() => msgElement.style.opacity = 0, 2000);
    }
    
    static endGame(isWin) {
        document.body.style.backgroundColor = isWin ? 'var(--blood-red)' : 'var(--dried-blood)';
        document.getElementById('shoot-self').disabled = true;
        document.getElementById('shoot-ai').disabled = true;
    }
}

window.Game = Game;
