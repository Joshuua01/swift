import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class SwiftCode {
  @PrimaryColumn()
  swiftCode: number;

  @Column()
  bankName: string;

  @Column()
  address: string;

  @Column()
  contryISO2: string;

  @Column()
  countryName: string;

  @Column()
  isHeadquarter: boolean;
}
