class Items {
    /**
     * 使用道具
     * @param {string} item 道具名稱
     * @param {string} user 使用者 ("player" 或 "ai")
     */
    static useItem(item, user) {
        const isPlayer = user === 'player';

        // 根據道具名稱執行對應的行為
        switch (item) {
            case 'huazi': // 香菸：恢復1點生命
                this.useHuazi(isPlayer);
                break;

            case 'handcuffs': // 手銬：跳過對方下一回合
                this.useHandcuffs(isPlayer);
                break;

            case 'knife': // 手鋸：下一發傷害翻倍
                this.useKnife(isPlayer);
                break;

            case 'drink': // 啤酒：移除槍膛的頂端子彈
                this.useDrink();
                break;

            case 'magnifier': // 放大鏡：查看下一發子彈類型
                this.useMagnifier();
                break;

            default:
                console.warn(`未知道具: ${item}`);
                Game.showMessage('❓ 未知的道具，無法使用！');
                return;
        }

        // 播放道具使用音效並更新UI
        Utils.playSound('item-use.mp3');
        Game.updateUI();
    }

    /**
     * 使用香菸：恢復1點生命
     * @param {boolean} isPlayer 是否為玩家
     */
    static useHuazi(isPlayer) {
        if (isPlayer) {
            Game.playerHealth = Math.min(Game.playerHealth + 1, 3);
            Game.showMessage('🚬 你吸了口煙，恢復1點生命！');
        } else {
            Game.aiHealth = Math.min(Game.aiHealth + 1, 3);
            Game.showMessage('🚬 AI吸了口煙，恢復1點生命！');
        }
    }

    /**
     * 使用手銬：跳過對方下一回合
     * @param {boolean} isPlayer 是否為玩家
     */
    static useHandcuffs(isPlayer) {
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
    }

    /**
     * 使用手鋸：下一發傷害翻倍
     * @param {boolean} isPlayer 是否為玩家
     */
    static useKnife(isPlayer) {
        Game.showMessage(`🔪 ${isPlayer ? '你' : 'AI'}锯短了槍管，下一發傷害翻倍！`);
        // 實際傷害翻倍處理應在射擊邏輯中實現
    }

    /**
     * 使用啤酒：移除槍膛的頂端子彈
     */
    static useDrink() {
        if (Game.chamber.length > 0) {
            const discarded = Game.chamber.pop();
            Game.showMessage(`🍺 啤酒沖走了${discarded.isLive ? '實彈' : '空包彈'}！`);
        } else {
            Game.showMessage('🍺 槍膛已空，啤酒無效！');
        }
    }

    /**
     * 使用放大鏡：查看下一發子彈類型
     */
    static useMagnifier() {
        if (Game.chamber.length > 0) {
            const nextBullet = Game.chamber[Game.chamber.length - 1];
            Game.showMessage(`🔍 下一發是${nextBullet.isLive ? '💀實彈' : '✅空包彈'}！`);
        } else {
            Game.showMessage('🔍 槍膛已空，無法查看下一發！');
        }
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
            'magnifier': '放大鏡',
        };
        return names[item] || item;
    }
}
