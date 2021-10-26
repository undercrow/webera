export default class Channel<T> {
	private queue: T[];
	private resolvePop?: (value: T) => void;
	private resolveFlush?: () => void;

	public constructor() {
		this.queue = [];
	}

	public push(value: T): void {
		if (this.resolvePop == null) {
			this.queue.push(value);
		} else {
			this.resolvePop(value);
			this.resolvePop = undefined;
		}
	}

	public async pop(): Promise<T> {
		if (this.queue.length !== 0) {
			if (this.queue.length === 1 && this.resolveFlush != null) {
				this.resolveFlush();
			}
			return this.queue.pop()!;
		}

		return new Promise<T>((res) => {
			this.resolvePop = res;
		});
	}

	public async flush() {
		if (this.queue.length === 0) {
			return;
		}

		return new Promise<void>((res) => {
			this.resolveFlush = res;
		});
	}
}
