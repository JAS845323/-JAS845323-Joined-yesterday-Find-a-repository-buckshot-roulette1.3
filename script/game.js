class Game {
    /**
     * 初始化遊戲
     */
    static init() {
        console.log("初始化血腥輪盤...");
        this.round = 1;
        this.playerHealth = 3;
        this.aiHealth = 3;
        this.chamber = [];
        this.playerTurn = true;
        this.playerItems = [];
        this.aiItems = [];

        this.setupRound();
        this.updateUI();
    }

    /**
     * 設置新一輪的遊戲狀態
     */
    static setupRound() {
        // 根據規則設定每局子彈數量和實彈數量
        const bulletCounts = [3, 5, 7]; // 每局子彈總數
        const liveBulletCounts = [1, 2, 3]; // 每局實彈數量

        // 設定子彈數量和實彈數量
        const bulletCount = bulletCounts[this.round - 1];
        const liveBullets = liveBulletCounts[this.round - 1];

        // 恢復玩家和 AI 的血量至滿血
        this.playerHealth = 3; // 玩家滿血
        this.aiHealth = 3; // AI 滿血

        // 初始化子彈
        this.chamber = Array.from({ length: bulletCount }, (_, i) => ({
            isLive: i < liveBullets,
            revealed: false,
        }));

        // 隨機打亂子彈順序
        this.shuffleBullets();

        // 分發道具
        this.distributeItems();

        // 更新 UI 並顯示回合開始訊息
        this.showMessage(`🔁 第 ${this.round} 局開始！`);
        this.updateUI();
    }

    /**
     * 將子彈隨機打亂
     */
    static shuffleBullets() {
        for (let i = this.chamber.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.chamber[i], this.chamber[j]] = [this.chamber[j], this.chamber[i]];
        }
    }

    /**
     * 分發道具給玩家和 AI
     */
    static distributeItems() {
        const itemCounts = [0, 2, 4]; // 每局玩家和 AI 的道具數量
        const itemCount = itemCounts[this.round - 1];

        const allItems = ['huazi', 'handcuffs', 'knife', 'drink', 'magnifier'];
        this.playerItems = this.getRandomItems(allItems, itemCount);
        this.aiItems = this.getRandomItems(allItems, itemCount);
    }

    /**
     * 隨機選擇道具
     * @param {Array} items 道具池
     * @param {number} count 道具數量
     * @returns {Array} 選擇的道具
     */
    static getRandomItems(items, count) {
        return Array.from({ length: count }, () =>
            items[Math.floor(Math.random() * items.length)]
        );
    }

    /**
     * 玩家射擊行為
     * @param {string} target 射擊目標 ('self' 或 'ai')
     */
    static playerShoot(target) {
        if (!this.playerTurn || this.chamber.length === 0) {
            this.nextRound();
            return;
        }

        const bullet = this.chamber.pop();
        Utils.playSound(bullet.isLive ? 'shot.mp3' : 'click.mp3');

        if (target === 'self') {
            this.handleShot(bullet.isLive, 'player');
        } else {
            this.handleShot(bullet.isLive, 'ai');
        }

        this.updateUI();
    }

    /**
     * 處理射擊結果
     * @param {boolean} isLive 是否命中
     * @param {string} target 射擊目標 ('player' 或 'ai')
     */
    static handleShot(isLive, target) {
        const isPlayer = target === 'player';
        const healthKey = isPlayer ? 'playerHealth' : 'aiHealth';

        if (isLive) {
            this[healthKey]--;
            this.showMessage(isPlayer ? '💀 你中彈了！' : '💀 AI中彈了！');
        } else {
            this.showMessage(isPlayer ? '✅ 空包彈！繼續你的回合' : '✅ 空包彈！');
        }

        this.checkGameOver();

        if (!isLive && !isPlayer) {
            setTimeout(() => this.aiTurn(), 1500); // AI 繼續執行回合
        }
    }

    /**
     * 檢查遊戲是否結束
     */
    static checkGameOver() {
        if (this.playerHealth <= 0) {
            this.handleGameOver(false);
        } else if (this.aiHealth <= 0) {
            this.round++;
            if (this.round > 3) {
                this.handleGameOver(true); // 第 3 局擊敗 AI，玩家獲勝
            } else {
                this.setupRound();
            }
        }
    }

    /**
     * 處理遊戲結束邏輯
     * @param {boolean} isPlayerWin 是否玩家獲勝
     */
    static handleGameOver(isPlayerWin) {
        if (isPlayerWin) {
            this.showMessage('🎉 恭喜！你擊敗了 AI！');
            this.endGame(true);
        } else {
            this.showMessage('☠️ 遊戲結束！你死了...');
            this.endGame(false);
        }
    }

    /**
     * 更新 UI
     */
    static updateUI() {
        document.getElementById('player-health').querySelector('.blood-fill').style.width = `${(this.playerHealth / 3) * 100}%`;
        document.getElementById('ai-health').querySelector('.blood-fill').style.width = `${(this.aiHealth / 3) * 100}%`;
        document.getElementById('round-display').textContent = `第 ${this.round} 局`;

        this.updateItemSlots('player');
        this.updateItemSlots('ai');
    }

    /**
     * 更新道具欄
     * @param {string} who 玩家或 AI ('player' 或 'ai')
     */
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

    /**
     * 玩家使用道具
     * @param {string} item 道具名稱
     */
    static usePlayerItem(item) {
        if (!this.playerTurn) return;

        const index = this.playerItems.indexOf(item);
        if (index !== -1) {
            this.playerItems.splice(index, 1);
            Items.useItem(item, 'player');
            this.updateUI();
        }
    }

    /**
     * 顯示訊息
     * @param {string} msg 訊息內容
     */
    static showMessage(msg) {
        const msgElement = document.getElementById('message-display');
        msgElement.textContent = msg;
        msgElement.style.opacity = 1;
        setTimeout(() => (msgElement.style.opacity = 0), 2000);
    }

    /**
     * 結束遊戲
     * @param {boolean} isWin 是否玩家獲勝
     */
    static endGame(isWin) {
        document.body.style.backgroundColor = isWin ? 'var(--blood-red)' : 'var(--dried-blood)';
        document.getElementById('shoot-self').disabled = true;
        document.getElementById('shoot-ai').disabled = true;
    }
}

window.Game = Game;
