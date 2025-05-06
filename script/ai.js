class AI {
    /**
     * AI 決策邏輯
     * @returns {string} AI 的行動指令
     */
    static makeDecision() {
        const dangerLevel = (3 - Game.aiHealth) / 3; // 危險程度（生命越低越危險）

        // 狂暴模式：危險程度高 + 第三局
        if (Game.round === 3 && Math.random() < dangerLevel * 0.8) {
            if (Game.aiItems.includes('knife')) {
                return 'USE_KNIFE→SHOOT_SELF'; // 使用手鋸並對自己開槍
            }
            if (Game.aiItems.includes('handcuffs')) {
                return 'USE_HANDCUFFS→SHOOT_PLAYER'; // 使用手銬並對玩家開槍
            }
        }

        // 優先使用道具
        if (Game.aiItems.includes('magnifier') && Game.chamber.length > 1) {
            return 'USE_MAGNIFIER'; // 使用放大鏡查看下一發子彈
        }
        if (Game.aiItems.includes('drink') && Game.chamber.length > 2) {
            return 'USE_DRINK'; // 使用啤酒移除槍膛內的子彈
        }
        if (Game.aiItems.includes('huazi') && Game.aiHealth < 2) {
            return 'USE_HUAZI'; // 使用香菸恢復生命
        }

        // 基本決策：根據危險程度選擇自殺或攻擊玩家
        const suicideProbability = 0.3 + dangerLevel * 0.4;
        return Math.random() < suicideProbability ? 'SHOOT_SELF' : 'SHOOT_PLAYER';
    }
}
