class Utils {
    static preloadSounds() {
        const sounds = [
            'shot.mp3', 'click.mp3', 'item-use.mp3', 
            'reload.mp3', 'heartbeat.mp3', 'electric-zap.mp3'
        ];
        
        sounds.forEach(sound => {
            new Audio(`assets/sounds/${sound}`).load();
        });
    }
    
    static preloadImages() {
        // 圖片預載會在CSS中自動處理
    }
    
    static playSound(sound) {
        const audio = new Audio(`assets/sounds/${sound}`);
        audio.volume = 0.7;
        audio.play().catch(e => console.log('音效播放失敗:', e));
    }
    
    static spawnBloodParticles(position, count) {
        const bloodContainer = document.createElement('div');
        bloodContainer.className = 'blood-splatter';
        bloodContainer.style.left = `${position.left}px`;
        bloodContainer.style.top = `${position.top}px`;
        bloodContainer.style.width = `${position.width}px`;
        bloodContainer.style.height = `${position.height}px`;
        
        document.body.appendChild(bloodContainer);
        
        setTimeout(() => {
            bloodContainer.style.opacity = 1;
        }, 10);
        
        setTimeout(() => {
            bloodContainer.style.opacity = 0;
            setTimeout(() => {
                document.body.removeChild(bloodContainer);
            }, 500);
        }, 1000);
    }
}