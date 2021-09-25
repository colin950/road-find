import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class CreatedUpdatedTime extends BaseEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
