class ViewTracker {
    constructor() {
        this.processedItems = new Map();
        this.cooldownTime = 5000;
    }

    canIncrement(type, id) {
        const key = `${type}_${id}`;
        const now = Date.now();
        const lastTime = this.processedItems.get(key);

        if (lastTime && now - lastTime < this.cooldownTime) {
            return false;
        }

        this.processedItems.set(key, now);

        return true;
    }

    cleanup() {
        const now = Date.now();
        for (const [key, time] of this.processedItems.entries()) {
            if (now - time > this.cooldownTime) {
                this.processedItems.delete(key);
            }
        }
    }
}

const viewTracker = new ViewTracker();

setInterval(() => {
    viewTracker.cleanup();
}, 10000);

export default viewTracker;
