import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
enum UserRole {
  ADMIN = "admin",
  USER = "user",
}
@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({
    length: 100,
    nullable: false,
  })
  username: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  role: UserRole;
}
