import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Updoot } from "./Updoot";
import { User } from "./User";

@ObjectType()
@Entity()
export class Feed extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.feeds)
  creator!: User;

  @OneToMany(() => Updoot, (updoot) => updoot.feed)
  updoots!: [Updoot];

  @Field(() => Int, { nullable: true })
  voteStatus!: number | null; // 1, -1 or null

  @Field(() => Int)
  @Column({ type: "number" })
  creatorId!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  type!: "showcase" | "matches";

  @Field(() => Int)
  @Column({ type: "int", default: 0 })
  points?: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  imageUrl?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  code?: String;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  theme?: String;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  language?: String;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  projectIdea?: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;
}
