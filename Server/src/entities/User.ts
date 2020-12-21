import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property({ type: "date" })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date(), type: "date" })
  updatedAt = new Date();

  @Property({ type: "text" })
  username!: string;

  @Property({ type: "text" })
  password!: string;

  // @ManyToOne() // when you provide correct type hint, ORM will read it for you
  // author!: Author;

  // @ManyToOne(() => Publisher) // or you can specify the entity as class reference or string name
  // publisher?: Publisher;

  // @ManyToMany() // owning side can be simple as this!
  // tags = new Collection<BookTag>(this);
}
