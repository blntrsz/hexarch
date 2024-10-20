import { createContext } from "../../common/context";

export interface DomainEvent {
  name: string;
  data: object;
  metadata: object;
}

export interface Bus {
  emit(event: DomainEvent): Promise<void>;
}

export const BusContext = createContext<Bus>();
