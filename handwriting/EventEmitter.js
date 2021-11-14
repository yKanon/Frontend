class EventEmitter {
  constructor() {
    this.getInstance();
    this.handlers = {};
  }

  static getInstance() {
    if (EventEmitter.instance === null) {
      EventEmitter.instance = new EventEmitter();
    }

    return EventEmitter.instance;
  }

  on(event, cb) {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }

    this.handlers[event].push(cb);
  }

  emit(event, ...args) {
    if (this.handlers[event]) {
      const handlers = this.handlers[event].slice();

      handlers.forEach((cb) => cb(...args));
    }
  }

  off(event, cb) {
    if (this.handlers[event]) {
      const idx = this.handlers[event].indexOf(cb);

      idx !== -1 && this.handlers[event].splice(idx, 1);
    }
  }

  once(event, cb) {
    const wrapper = (...args) => {
      cb(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}
