import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class View extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn()
  viewerId!: number;

  @Field(() => Int)
  @PrimaryColumn()
  targetId!: number;

  @ManyToOne(() => User, (u) => u.views, {
    primary: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "viewerId" })
  viewer!: Promise<User>;

  @ManyToOne(() => User, (u) => u.targets, {
    primary: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "targetId" })
  target!: Promise<User>;

  @Field(() => Boolean)
  @Column({ type: "boolean" })
  liked!: boolean;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;
}
