
import { Container } from "inversify";

const container = new Container();

export const resolve = <T>(identifier: symbol): T => {
  return container.get<T>(identifier);
};

export default container;