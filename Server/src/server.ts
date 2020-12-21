import dotenv from "dotenv";
import { MikroORM } from "@mikro-orm/core";
import { User } from "./entities/User";
import microConfig from "./mikro-orm.config";
dotenv.config();

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();

  // const user = orm.em.create(User, { username: "Manan", password: "manan" });
  // await orm.em.persistAndFlush(user);

  const users = await orm.em.find(User, {});
  console.log(users);

  // console.log("----------sql2------------");
  // await orm.em.nativeInsert(User, { username: "Manan", password: "manan" });
};

main().catch((error) => {
  console.error(error);
});

console.log("Hello Typed Server");
