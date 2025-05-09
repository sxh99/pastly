type CustomEvents = 'toggle-auto-start' | 'toggle-server';

class EventEmitter extends EventTarget {
  emit(name: CustomEvents) {
    this.dispatchEvent(new Event(name));
  }

  on(name: CustomEvents, listener: (e: Event) => void) {
    this.addEventListener(name, listener);
  }

  off(name: CustomEvents, listener: (e: Event) => void) {
    this.removeEventListener(name, listener);
  }
}

export const emitter = new EventEmitter();
