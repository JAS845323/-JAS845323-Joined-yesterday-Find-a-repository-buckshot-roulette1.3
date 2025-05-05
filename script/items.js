class Items {
    static useItem(item, user) {
        switch(item) {
            case 'huazi':
                this.useHuazi(user);
                break;
            case 'handcuffs':
                this.useHandcuffs(user);
                break;
            case 'knife':
                this.useKnife(user);
                break;
            case 'drink':
                this.useDrink(user);
                break;
            case 'magnifier':
                this.useMagnifier(user);
                break;
        }
        
        Utils.playSound('item-use.mp3');
    }
    
    static useHuazi(user) {
        if (user === 'player') {
            Game.playerHealth = Math.min(Game.playerHealth + 1, 3);
        } else {
            Game.aiHealth = Math.min(Game.aiHealth + 1, 3);
        }
        Game.updateUI();
    }
    
    static useHandcuffs(user) {
        if (user === 'player') {
            // 跳過AI下一回合
            setTimeout(() => {
                Game.showMessage('AI被手銬鎖住，跳過一回合！');
                Game.playerTurn = true;
                Game.updateUI();
            }, 1500);
        } else {
            // AI使用手銬，跳過玩家下一回合
            Game.showMessage('AI用手銬鎖住你，跳過你的回合！');
            Game.playerTurn = false;
            setTimeout(() => Game.aiTurn(), 1500);
        }
    }
    
    static useKnife(user) {
        // 下一發子彈傷害翻倍
        Game.showMessage('槍管被割短，下一發傷害翻倍！');
        // 實際傷害處理在射擊邏輯中
    }
    
    static useDrink(user) {
        if (Game.chamber.length > 0) {
            const discarded = Game.chamber.pop();
            Game.showMessage(`啤酒沖走了${discarded.isLive ? '實彈' : '空包彈'}！`);
            Game.updateUI();
        }
    }
    
    static useMagnifier(user) {
        if (Game.chamber.length > 0) {
            const nextBullet = Game.chamber[Game.chamber.length - 1];
            Game.showMessage(`下一發是${nextBullet.isLive ? '實彈' : '空包彈'}！`);
        }
    }
    
    static getItemName(item) {
        const names = {
            'huazi': '香菸',
            'handcuffs': '手銬',
            'knife': '手鋸',
            'drink': '啤酒',
            'magnifier': '放大鏡'
        };
        return names[item] || item;
    }
}