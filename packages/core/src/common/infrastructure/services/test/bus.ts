import { Bus, BusContext, DomainEvent } from "#common/domain/services/bus.js";

export class TestBus implements Bus {
  private _events: DomainEvent[] = [];

  async emit(event: DomainEvent): Promise<void> {
    this._events.push(event);
  }

  get events() {
    return this._events;
  }
}

export const testBus = new TestBus();

export const TestBusProvider = BusContext.with(testBus);
