class Utils {
    static preloadSounds() {
        const sounds = [
            'shot.mp3', 'click.mp3', 'item-use.mp3',
            'reload.mp3', 'heartbeat.mp3', 'electric-zap.mp3'
        ];
        
        sounds.forEach(sound => {
            new Audio(`./assets/sounds/${sound}`).load().catch(e => {
                console.log(`音效预加载失败: ${sound}`, e);
            });
        });
    }
    
    static playSound(sound) {
        try {
            const audio = new Audio(`./assets/sounds/${sound}`);
            audio.volume = 0.7;
            audio.play().catch(e => console.log('音效播放需用户交互后生效'));
        } catch (e) {
            console.error('音效加载失败:', e);
        }
    }
    
    static spawnBloodEffect(element) {
        element.classList.add('blood-splatter');
        setTimeout(() => {
            element.classList.remove('blood-splatter');
        }, 1000);
    }
}
