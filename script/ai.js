class AI {
    static makeDecision() {
        const dangerLevel = (3 - Game.aiHealth) / 3; // 血量越低越危险
        
        // 第三局狂暴模式
        if (Game.round === 3 && Math.random() < dangerLevel * 0.8) {
            if (Game.aiItems.includes('knife')) {
                return 'USE_KNIFE→SHOOT_SELF'; // 赌命一击
            }
            if (Game.aiItems.includes('handcuffs')) {
                return 'USE_HANDCUFFS→SHOOT_PLAYER';
            }
        }

        // 优先使用道具
        if (Game.aiItems.includes('magnifier') && Game.chamber.length > 1) {
            return 'USE_MAGNIFIER';
        }
        if (Game.aiItems.includes('drink') && Game.chamber.length > 2) {
            return 'USE_DRINK';
        }
        if (Game.aiItems.includes('huazi') && Game.aiHealth < 2) {
            return 'USE_HUAZI';
        }

        // 基础射击决策（30%-70%自瞄率）
        return Math.random() < (0.3 + dangerLevel * 0.4) ? 'SHOOT_SELF' : 'SHOOT_PLAYER';
    }
}
