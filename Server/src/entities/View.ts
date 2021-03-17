import { Field, Int } from "type-graphql";
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
  viewer!: User;

  @ManyToOne(() => User, (u) => u.targets, {
    primary: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "targetId" })
  target!: User;

  @Field(() => Boolean)
  @Column("boolean")
  liked!: boolean;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;
}
