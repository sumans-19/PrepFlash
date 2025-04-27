// Simple EventEmitter implementation for browser use
export class EventEmitter {
    private events: {[key: string]: Function[]} = {};
  
    constructor() {
      this.events = {};
    }
  
    on(event: string, listener: Function): this {
      if (!this.events[event]) {
        this.events[event] = [];
      }
      this.events[event].push(listener);
      return this;
    }
  
    off(event: string, listener: Function): this {
      if (!this.events[event]) return this;
      this.events[event] = this.events[event].filter(l => l !== listener);
      return this;
    }
  
    emit(event: string, ...args: any[]): boolean {
      if (!this.events[event]) return false;
      this.events[event].forEach(listener => listener(...args));
      return true;
    }
  
    once(event: string, listener: Function): this {
      const onceWrapper = (...args: any[]) => {
        listener(...args);
        this.off(event, onceWrapper);
      };
      this.on(event, onceWrapper);
      return this;
    }
  }