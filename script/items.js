class Items {
    /**
     * 使用道具
     * @param {string} item 道具名稱
     * @param {string} user 使用者 ("player" 或 "ai")
     */
    static useItem(item, user) {
        const isPlayer = user === 'player';

        switch (item) {
            case 'huazi': // 香菸：恢復1點生命
                if (isPlayer) {
                    Game.playerHealth = Math.min(Game.playerHealth + 1, 3);
                    Game.showMessage('🚬 你吸了口煙，恢復1點生命！');
                } else {
                    Game.aiHealth = Math.min(Game.aiHealth + 1, 3);
                }
                break;

            case 'handcuffs': // 手銬：跳過對方下一回合
                Game.showMessage(`🔗 ${isPlayer ? '你' : 'AI'}使用了手銬！`);
                if (isPlayer) {
                    setTimeout(() => {
                        Game.showMessage('⏳ AI的回合被跳過！');
                        Game.playerTurn = true;
                        Game.updateUI();
                    }, 1500);
                } else {
                    Game.showMessage('⏳ 你的下一回合被跳過！');
                    Game.playerTurn = false;
                    setTimeout(() => Game.aiTurn(), 1500);
                }
                break;

            case 'knife': // 手鋸：下一發傷害翻倍
                Game.showMessage(`🔪 ${isPlayer ? '你' : 'AI'}锯短了槍管，下一發傷害翻倍！`);
                // 備註：實際傷害翻倍邏輯在射擊處理中實現
                break;

            case 'drink': // 啤酒：移除槍膛的頂端子彈
                if (Game.chamber.length > 0) {
                    const discarded = Game.chamber.pop();
                    Game.showMessage(`🍺 啤酒沖走了${discarded.isLive ? '實彈' : '空包彈'}！`);
                }
                break;

            case 'magnifier': // 放大鏡：查看下一發子彈類型
                if (Game.chamber.length > 0) {
                    const nextBullet = Game.chamber[Game.chamber.length - 1];
                    Game.showMessage(`🔍 下一發是${nextBullet.isLive ? '💀實彈' : '✅空包彈'}！`);
                }
                break;
        }

        // 播放道具使用音效
        Utils.playSound('item-use.mp3');
        Game.updateUI();
    }

    /**
     * 獲取道具名稱
     * @param {string} item 道具代碼
     * @returns {string} 道具名稱
     */
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
