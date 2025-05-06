document.addEventListener('DOMContentLoaded', () => {
    const playerHealth = document.querySelector('#player-health .blood-fill');
    const aiHealth = document.querySelector('#ai-health .blood-fill');
    const messageDisplay = document.getElementById('message-display');
    const bloodEffect = document.querySelector('.blood-splatter');

    let playerHP = 100;
    let aiHP = 100;
    let round = 1;

    function updateHealthBar(el, hp) {
        el.style.width = `${hp}%`;
    }

    function showMessage(msg) {
        messageDisplay.textContent = msg;
    }

    function triggerBloodEffect() {
        bloodEffect.style.opacity = 1;
        setTimeout(() => bloodEffect.style.opacity = 0, 500);
    }

    document.getElementById('shoot-self').addEventListener('click', () => {
        const hit = Math.random() < 0.5;
        if (hit) {
            playerHP -= 50;
            updateHealthBar(playerHealth, playerHP);
            triggerBloodEffect();
            showMessage('你中了！');
        } else {
            showMessage('你倖免了...');
        }
        checkGameOver();
    });

    document.getElementById('shoot-ai').addEventListener('click', () => {
        const hit = Math.random() < 0.5;
        if (hit) {
            aiHP -= 50;
            updateHealthBar(aiHealth, aiHP);
            triggerBloodEffect();
            showMessage('AI 中彈！');
        } else {
            showMessage('AI 倖免...');
        }
        checkGameOver();
    });

    function checkGameOver() {
        if (playerHP <= 0) {
            showMessage('你死了！遊戲結束');
        } else if (aiHP <= 0) {
            showMessage('AI 死亡，你獲勝！');
        }
    }

    // 初始化狀態
    updateHealthBar(playerHealth, playerHP);
    updateHealthBar(aiHealth, aiHP);
    showMessage('準備開始...');
});
