import { Field, Int, ObjectType, Float } from "type-graphql";
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

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  githubId!: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  bio!: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  flair!: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  gender!: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  showMe!: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  lookingFor!: string;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true, default: 18 })
  minAge!: number;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true, default: 29 })
  maxAge!: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  notificationSubscription!: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  birthDate!: String;

  @Field(() => Float, { nullable: true })
  @Column({ type: "float", nullable: true })
  latitude!: number;

  @Field(() => Float, { nullable: true })
  @Column({ type: "float", nullable: true })
  longitude!: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  address!: String;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;
}
