document.addEventListener('DOMContentLoaded', () => {
    const playerHealthBar = document.querySelector('#player-health .blood-fill');
    const aiHealthBar = document.querySelector('#ai-health .blood-fill');
    const messageDisplay = document.getElementById('message-display');
    const bloodEffect = document.querySelector('.blood-splatter');

    let playerHP = 100;
    let aiHP = 100;
    let round = 1;

    function updateHealthBar(element, hp) {
        element.style.width = `${Math.max(0, hp)}%`;
    }

    function showMessage(msg) {
        messageDisplay.textContent = msg;
    }

    function triggerBloodEffect() {
        if (!bloodEffect) return;
        bloodEffect.style.opacity = 1;
        setTimeout(() => bloodEffect.style.opacity = 0, 500);
    }

    function checkGameOver() {
        if (playerHP <= 0) {
            showMessage('你死了！遊戲結束');
            disableButtons();
        } else if (aiHP <= 0) {
            showMessage('AI 死亡，你獲勝！');
            disableButtons();
        }
    }

    function disableButtons() {
        document.getElementById('shoot-self').disabled = true;
        document.getElementById('shoot-ai').disabled = true;
    }

    function shoot(target) {
        const hit = Math.random() < 0.5;
        if (hit) {
            if (target === 'player') {
                playerHP -= 50;
                updateHealthBar(playerHealthBar, playerHP);
                triggerBloodEffect();
                showMessage('你中了！');
            } else {
                aiHP -= 50;
                updateHealthBar(aiHealthBar, aiHP);
                triggerBloodEffect();
                showMessage('AI 中彈！');
            }
        } else {
            showMessage(target === 'player' ? '你倖免了...' : 'AI 倖免...');
        }
        checkGameOver();
    }

    document.getElementById('shoot-self').addEventListener('click', () => shoot('player'));
    document.getElementById('shoot-ai').addEventListener('click', () => shoot('ai'));

    // 初始化狀態
    updateHealthBar(playerHealthBar, playerHP);
    updateHealthBar(aiHealthBar, aiHP);
    showMessage('準備開始...');
});
