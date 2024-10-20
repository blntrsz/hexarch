import { Bus, BusContext, DomainEvent } from "#domain/services/bus.js";

class AwsBus implements Bus {
  async emit(event: DomainEvent): Promise<void> {
    console.log(event);
  }
}

export const AwsBusProvider = BusContext.with(new AwsBus());
