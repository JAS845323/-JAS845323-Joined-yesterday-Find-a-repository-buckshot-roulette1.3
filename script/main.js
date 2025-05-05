document.addEventListener('DOMContentLoaded', () => {
    // 预加载资源
    Utils.preloadResources();
    
    // 初始化游戏
    Game.init();
    
    // 绑定按钮事件
    document.getElementById('shoot-self').addEventListener('click', () => {
        if (Game.playerTurn) Game.playerShoot('self');
    });
    
    document.getElementById('shoot-ai').addEventListener('click', () => {
        if (Game.playerTurn) Game.playerShoot('ai');
    });
    
    console.log("游戏初始化完成");
});
