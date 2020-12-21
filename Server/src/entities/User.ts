import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ onUpdate: () => new Date(), type: "date" })
  updatedAt = new Date();

  @Field()
  @Property({ type: "text" })
  username!: string;

  @Field()
  @Property({ type: "text" })
  email!: string;

  @Property({ type: "text" })
  password!: string;

  // @ManyToOne() // when you provide correct type hint, ORM will read it for you
  // author!: Author;

  // @ManyToOne(() => Publisher) // or you can specify the entity as class reference or string name
  // publisher?: Publisher;

  // @ManyToMany() // owning side can be simple as this!
  // tags = new Collection<BookTag>(this);
}
