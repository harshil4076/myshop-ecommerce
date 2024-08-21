import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  quantity: number;

  @Column("decimal")
  totalPrice: number;

  @Column()
  status: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  orderDate: Date;
}
