class Items {
    static useItem(item, user) {
        const isPlayer = user === 'player';
        
        switch(item) {
            case 'huazi':
                if (isPlayer) {
                    Game.playerHealth = Math.min(Game.playerHealth + 1, 3);
                    Game.showMessage('🚬 你吸了口烟，恢复1点生命！');
                } else {
                    Game.aiHealth = Math.min(Game.aiHealth + 1, 3);
                }
                break;
                
            case 'handcuffs':
                Game.showMessage(`🔗 ${isPlayer ? '你' : 'AI'}使用了手铐！`);
                if (isPlayer) {
                    setTimeout(() => {
                        Game.showMessage('⏳ AI的回合被跳过！');
                        Game.playerTurn = true;
                        Game.updateUI();
                    }, 1500);
                } else {
                    Game.showMessage('⏳ 你的下一回合被跳过！');
                    Game.playerTurn = false;
                    setTimeout(() => Game.aiTurn(), 1500);
                }
                break;
                
            case 'knife':
                Game.showMessage(`🔪 ${isPlayer ? '你' : 'AI'}锯短了枪管，下一发伤害翻倍！`);
                // 实际伤害处理在射击逻辑中
                break;
                
            case 'drink':
                if (Game.chamber.length > 0) {
                    const discarded = Game.chamber.pop();
                    Game.showMessage(`🍺 啤酒冲走了${discarded.isLive ? '实弹' : '空包弹'}！`);
                }
                break;
                
            case 'magnifier':
                if (Game.chamber.length > 0) {
                    const nextBullet = Game.chamber[Game.chamber.length - 1];
                    Game.showMessage(`🔍 下一发是${nextBullet.isLive ? '💀实弹' : '✅空包弹'}！`);
                }
                break;
        }
        
        Utils.playSound('item-use.mp3');
        Game.updateUI();
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
