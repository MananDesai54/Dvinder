import { Field, Int, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { reactionType } from "../config/types";

@ObjectType()
@Entity()
export class Reaction {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  type!: reactionType;

  @ManyToOne(() => User, (user) => user.reactions)
  user!: User;

  @Field(() => Int)
  @Column({ type: "number" })
  userId!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;
}
