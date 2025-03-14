import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class SwiftCode {
  @PrimaryColumn()
  swiftCode: string;

  @Column()
  bankName: string;

  @Column()
  address: string;

  @Column()
  countryISO2: string;

  @Column()
  countryName: string;

  @Column()
  isHeadquarter: boolean;
}
