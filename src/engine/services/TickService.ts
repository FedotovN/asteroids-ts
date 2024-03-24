export default class TickService {
    tickRequestId: number;
    updateCallbacks: Set<Function> = new Set();
    perfectFramerate = 60;
    stopped: boolean;

    private deltaTime: number = 0;
    private lastTimestamp: number = 0;

    onUpdate(callback: Function) {
        this.updateCallbacks.add(callback);
        return () => {
            this.updateCallbacks.delete(callback);
        }
    }

    start() {
        this.stopped = false;
        this.tickRequestId = requestAnimationFrame((now) => this._update(now));
    }

    freeze() {
        cancelAnimationFrame(this.tickRequestId);
    }
    private _update(timestamp: number) {
        this.updateCallbacks.forEach(c => c(this._getUpdateCallbackContext()));
        this.tickRequestId = requestAnimationFrame(now => this._update(now));

        this.deltaTime = (timestamp - this.lastTimestamp) / (1000 / this.perfectFramerate);
        this.lastTimestamp = timestamp;
    }
    private _getUpdateCallbackContext() {
        return {
            deltaTime: this.deltaTime
        }
    }
}
