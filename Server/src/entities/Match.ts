import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  // OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
// import { Message } from "./Message";
import { User } from "./User";

@ObjectType()
@Unique(["userId1", "userId2"])
@Entity()
export class Match extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  userId1!: string;

  @ManyToOne(() => User, (u) => u.matches1, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId1" })
  user1!: Promise<User>;

  @Field()
  @Column()
  userId2!: string;

  @ManyToOne(() => User, (u) => u.matches2, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId2" })
  user2!: Promise<User>;

  @Field(() => Boolean)
  @Column("boolean", { default: false })
  read1!: boolean;

  @Field(() => Boolean)
  @Column("boolean", { default: false })
  read2!: boolean;

  @Field(() => Boolean)
  @Column("boolean", { default: false })
  unmatched!: boolean;

  // @OneToMany(() => Message, (m) => m.match)
  // messages!: Promise<Message[]>;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;
}
