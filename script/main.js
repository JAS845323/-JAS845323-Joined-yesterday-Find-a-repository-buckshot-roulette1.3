document.addEventListener('DOMContentLoaded', () => {
    const playerHealthBar = document.querySelector('#player-health .blood-fill');
    const aiHealthBar = document.querySelector('#ai-health .blood-fill');
    const messageDisplay = document.getElementById('message-display');
    const bloodEffectPlayer = document.getElementById('blood-splatter-player');
    const bloodEffectAI = document.getElementById('blood-splatter-ai');

    let playerHP = 100;
    let aiHP = 100;

    /**
     * 更新健康條的長度
     * @param {HTMLElement} element 健康條元素
     * @param {number} hp 健康值 (百分比)
     */
    function updateHealthBar(element, hp) {
        element.style.width = `${Math.max(0, hp)}%`;
    }

    /**
     * 顯示遊戲訊息
     * @param {string} msg 訊息內容
     */
    function showMessage(msg) {
        messageDisplay.textContent = msg;
    }

    /**
     * 觸發血跡效果
     * @param {HTMLElement} effect 血跡動畫元素
     */
    function triggerBloodEffect(effect) {
        if (!effect) return;
        effect.style.opacity = 1;
        setTimeout(() => effect.style.opacity = 0, 500);
    }

    /**
     * 遊戲結束檢查
     */
    function checkGameOver() {
        if (playerHP <= 0) {
            endGame('你死了！遊戲結束');
        } else if (aiHP <= 0) {
            endGame('AI 死亡，你獲勝！');
        }
    }

    /**
     * 結束遊戲並禁用按鈕
     * @param {string} finalMessage 最終訊息
     */
    function endGame(finalMessage) {
        showMessage(finalMessage);
        disableButtons();
    }

    /**
     * 禁用射擊按鈕
     */
    function disableButtons() {
        document.getElementById('shoot-self').disabled = true;
        document.getElementById('shoot-ai').disabled = true;
    }

    /**
     * 處理射擊邏輯
     * @param {string} target 射擊目標 ('player' 或 'ai')
     */
    function shoot(target) {
        const hit = Math.random() < 0.5; // 命中率 50%
        if (hit) {
            if (target === 'player') {
                playerHP -= 50;
                updateHealthBar(playerHealthBar, playerHP);
                triggerBloodEffect(bloodEffectPlayer);
                showMessage('你中了！');
            } else {
                aiHP -= 50;
                updateHealthBar(aiHealthBar, aiHP);
                triggerBloodEffect(bloodEffectAI);
                showMessage('AI 中彈！');
            }
        } else {
            showMessage(target === 'player' ? '你倖免了...' : 'AI 倖免...');
        }
        checkGameOver();
    }

    // 綁定按鈕事件
    document.getElementById('shoot-self').addEventListener('click', () => shoot('player'));
    document.getElementById('shoot-ai').addEventListener('click', () => shoot('ai'));

    // 初始化遊戲狀態
    function initializeGame() {
        playerHP = 100;
        aiHP = 100;
        updateHealthBar(playerHealthBar, playerHP);
        updateHealthBar(aiHealthBar, aiHP);
        showMessage('準備開始...');
    }

    initializeGame();
});
