document.addEventListener('DOMContentLoaded', () => {
    // 初始化遊戲
    Game.init();
    
    // 綁定按鈕事件
    document.getElementById('shoot-self').addEventListener('click', () => {
        Game.playerShoot('self');
    });
    
    document.getElementById('shoot-ai').addEventListener('click', () => {
        Game.playerShoot('ai');
    });
    
    // 預載資源
    Utils.preloadSounds();
    Utils.preloadImages();
});