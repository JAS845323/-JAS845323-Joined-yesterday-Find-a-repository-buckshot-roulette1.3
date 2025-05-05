document.addEventListener('DOMContentLoaded', () => {
    // 确保DOM完全加载后初始化
    Game.init();
    
    // 绑定按钮事件（使用事件委托避免重复绑定）
    document.getElementById('revolver').addEventListener('click', (e) => {
        if (e.target.id === 'shoot-self') Game.playerShoot('self');
        if (e.target.id === 'shoot-ai') Game.playerShoot('ai');
    });

    // 预加载资源
    Utils.preloadSounds();
    Utils.preloadImages();
});
