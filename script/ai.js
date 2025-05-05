class AI {
    static makeDecision(aiItems, bulletsLeft, round, aiHealth) {
        const dangerLevel = (3 - aiHealth) / 3; // 血量越低越危險
        
        // 第三局狂戰士模式
        if (round === 3 && Math.random() < dangerLevel * 0.8) {
            if (aiItems.includes('knife') && bulletsLeft > 1) {
                return 'USE_KNIFE→SHOOT_SELF';
            }
            if (aiItems.includes('handcuffs')) {
                return 'USE_HANDCUFFS→SHOOT_PLAYER';
            }
        }
        
        // 使用道具的邏輯
        if (aiItems.includes('magnifier') && bulletsLeft > 1) {
            return 'USE_MAGNIFIER';
        }
        
        if (aiItems.includes('drink') && bulletsLeft > 2) {
            return 'USE_DRINK';
        }
        
        if (aiItems.includes('huazi') && aiHealth < 2) {
            return 'USE_HUAZI';
        }
        
        // 基礎決策
        const selfShootChance = 0.3 + (dangerLevel * 0.4); // 30%-70% 自殺率
        
        if (Math.random() < selfShootChance) {
            return 'SHOOT_SELF';
        } else {
            return 'SHOOT_PLAYER';
        }
    }
}