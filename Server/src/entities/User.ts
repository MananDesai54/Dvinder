import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Feed } from "./Feed";
import { Reaction } from "./Reaction";
import { Updoot } from "./Updoot";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  password!: string;

  @Field(() => [Feed])
  @OneToMany(() => Feed, (creator) => creator.creator)
  feeds!: [Feed];

  @Field(() => [Reaction])
  @OneToMany(() => Reaction, (reaction) => reaction.user)
  reactions!: [Feed];

  @OneToMany(() => Updoot, (updoot) => updoot.user)
  updoots!: [Updoot];

  @Field()
  @Column({
    default: "https://cloud-storage-uploads.s3.amazonaws.com/profile.jpg",
  })
  profileUrl!: string;
  @Field()
  @Column({ nullable: true })
  githubId!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;
}
