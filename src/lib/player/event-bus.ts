export type EventCallback = (...args: any[]) => void;

export class EventBus {
  // Хранилище для подписчиков, где ключом является имя события, а значением массив коллбэков
  private listeners: { [event: string]: EventCallback[] } = {};

  // Подписка на событие
  public subscribe(event: string, callback: EventCallback): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  // Подписка на одноразовое выполнение события
  public subscribeOnce(event: string, callback: EventCallback): void {
    const onceWrapper = (...args: any[]) => {
      callback(...args);
      this.unsubscribe(event, onceWrapper);
    };
    this.subscribe(event, onceWrapper);
  }

  // Отписка от события
  public unsubscribe(event: string, callback: EventCallback): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(
      (listener) => listener !== callback
    );
  }

  // Публикация события
  public publish(event: string, ...args: any[]): void {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach((listener) => listener(...args));
  }

  // Отписка от всех событий или от конкретного события
  public unsubscribeAll(event?: string): void {
    if (event) {
      delete this.listeners[event];
    } else {
      this.listeners = {};
    }
  }
}
