class Utils {
    /**
     * 預加載音效資源
     */
    static preloadSounds() {
        const sounds = [
            'shot.mp3', 'click.mp3', 'item-use.mp3',
            'reload.mp3', 'heartbeat.mp3', 'electric-zap.mp3'
        ];

        sounds.forEach(sound => {
            const audio = new Audio(`./assets/sounds/${sound}`);
            try {
                audio.load();
            } catch (e) {
                console.error(`音效预加载失败: ${sound}`, e);
            }
        });
    }

    /**
     * 播放指定音效
     * @param {string} sound 音效檔案名稱
     */
    static playSound(sound) {
        try {
            const audio = new Audio(`./assets/sounds/${sound}`);
            audio.volume = 0.7; // 設置音量
            audio.play().catch(() => {
                console.warn('音效播放需用户交互后生效');
            });
        } catch (e) {
            console.error('音效播放失敗:', e);
        }
    }

    /**
     * 生成血跡效果
     * @param {HTMLElement} element 目標元素
     */
    static spawnBloodEffect(element) {
        if (!element) return;
        element.classList.add('blood-splatter'); // 添加血跡樣式
        setTimeout(() => {
            element.classList.remove('blood-splatter'); // 1秒後移除效果
        }, 1000);
    }
}
