import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
};

export type UserData = {
  email: string;
  username: string;
  password: string;
};
