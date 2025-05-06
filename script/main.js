document.addEventListener('DOMContentLoaded', () => {
    const playerHealthBar = document.querySelector('#player-health .blood-fill');
    const aiHealthBar = document.querySelector('#ai-health .blood-fill');
    const messageDisplay = document.getElementById('message-display');
    const bloodEffectPlayer = document.getElementById('blood-splatter-player');
    const bloodEffectAI = document.getElementById('blood-splatter-ai');
    const nextRoundButton = document.getElementById('next-round-button');

    let playerHP = 100;
    let aiHP = 100;
    let currentRound = 1;
    const maxRounds = 3;

    /**
     * 更新生命條
     * @param {HTMLElement} element 生命條元素
     * @param {number} hp 生命值百分比
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
     * 顯示血跡效果
     * @param {HTMLElement} effect 血跡動畫元素
     */
    function triggerBloodEffect(effect) {
        if (!effect) return;
        effect.style.opacity = 1;
        setTimeout(() => (effect.style.opacity = 0), 500);
    }

    /**
     * 檢查遊戲是否結束
     */
    function checkGameOver() {
        if (playerHP <= 0) {
            endGame('☠️ 你死了！');
        } else if (aiHP <= 0) {
            endGame('🎉 AI 死亡，你贏了！');
        } else if (currentRound === maxRounds && playerHP === aiHP) {
            showMessage('🤝 平手！進入決勝回合！');
            enableNextRoundButton();
        }
    }

    /**
     * 結束遊戲並禁用按鍵
     * @param {string} finalMessage 最終訊息
     */
    function endGame(finalMessage) {
        showMessage(finalMessage);
        disableButtons();
        if (currentRound < maxRounds) {
            enableNextRoundButton();
        }
    }

    /**
     * 禁用射擊按鍵
     */
    function disableButtons() {
        document.getElementById('shoot-self').disabled = true;
        document.getElementById('shoot-ai').disabled = true;
    }

    /**
     * 啟用「下一回合」按鍵
     */
    function enableNextRoundButton() {
        nextRoundButton.style.display = 'block';
        nextRoundButton.disabled = false;
    }

    /**
     * 禁用「下一回合」按鍵
     */
    function disableNextRoundButton() {
        nextRoundButton.style.display = 'none';
        nextRoundButton.disabled = true;
    }

    /**
     * 初始化下一回合
     */
    function startNextRound() {
        currentRound++;
        playerHP = 100;
        aiHP = 100;
        updateHealthBar(playerHealthBar, playerHP);
        updateHealthBar(aiHealthBar, aiHP);
        showMessage(`🔄 第 ${currentRound} 回合開始！`);
        disableNextRoundButton();
        initializeGame();
    }

    /**
     * 處理射擊邏輯
     * @param {string} target 射擊目標 ('player' 或 'ai')
     */
    function shoot(target) {
        const hit = Math.random() < 0.5;
        if (hit) {
            if (target === 'player') {
                playerHP -= 50;
                updateHealthBar(playerHealthBar, playerHP);
                triggerBloodEffect(bloodEffectPlayer);
                showMessage('💥 你中彈了！');
            } else {
                aiHP -= 50;
                updateHealthBar(aiHealthBar, aiHP);
                triggerBloodEffect(bloodEffectAI);
                showMessage('🎯 AI 中彈！');
            }
        } else {
            showMessage(target === 'player' ? '😅 你僥倖逃過...' : '🤔 AI 僥倖逃過...');
        }
        checkGameOver();
    }

    // 綁定按鍵事件
    document.getElementById('shoot-self').addEventListener('click', () => shoot('player'));
    document.getElementById('shoot-ai').addEventListener('click', () => shoot('ai'));
    nextRoundButton.addEventListener('click', startNextRound);

    /**
     * 初始化遊戲狀態
     */
    function initializeGame() {
        playerHP = 100;
        aiHP = 100;
        updateHealthBar(playerHealthBar, playerHP);
        updateHealthBar(aiHealthBar, aiHP);
        showMessage('準備開始...');
        disableNextRoundButton();
    }

    // 初始化遊戲
    initializeGame();
});
