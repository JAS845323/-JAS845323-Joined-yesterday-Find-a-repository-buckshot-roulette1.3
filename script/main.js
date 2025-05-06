document.addEventListener('DOMContentLoaded', () => {
    // 預載資源
    Utils.preloadSounds();
    
    // 初始化遊戲
    Game.init();
    
    // 綁定按鈕事件
    document.getElementById('shoot-self').addEventListener('click', () => {
        Game.playerShoot('self');
    });
    
    document.getElementById('shoot-ai').addEventListener('click', () => {
        Game.playerShoot('ai');
    });
    
    console.log("遊戲初始化完成！");
});
