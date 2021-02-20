import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";
import { Feed } from "./Feed";

/**
 * Many to one for User and Feeds
 * many user can have like on one feeds
 * one user can have like on many feeds
 * so User -> Updoot <- Feed
 */

@ObjectType()
@Entity()
export class Updoot extends BaseEntity {
  @Field(() => Int)
  @Column()
  value!: number;

  @Field(() => Int)
  @PrimaryColumn()
  userId!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.updoots, { onDelete: "CASCADE" })
  user!: User;

  @Field(() => Int)
  @PrimaryColumn()
  feedId!: number;

  @Field(() => Feed)
  @ManyToOne(() => Feed, (feed) => feed.updoots, { onDelete: "CASCADE" })
  feed!: Feed;
}
