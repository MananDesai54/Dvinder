import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Match } from "./Match";

@ObjectType()
@Entity()
export class Message extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Int)
  @Column({ nullable: true })
  matchId!: number;

  @ManyToOne(() => Match, (m) => m.messages, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "senderId" })
  match!: Promise<Match>;

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
