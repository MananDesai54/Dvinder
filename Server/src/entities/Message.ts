import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class Message extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Int)
  @Column({ nullable: true })
  matchId!: number;

  @Field(() => Int)
  @Column()
  senderId!: number;

  @Field(() => Int)
  @Column()
  recipientId!: number;

  @Field()
  @Column("text")
  text!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;
}
