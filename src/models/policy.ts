import { Entity, Column, Index, BeforeInsert } from "typeorm"
import { generateEntityId } from "@medusajs/medusa/dist/utils"
import { SoftDeletableEntity } from "@medusajs/medusa"

@Entity()
export class Policy extends SoftDeletableEntity {
  @Index({ unique: true })
  @Column({ type: "varchar" })
  name: string

  @Column({ type: "varchar", nullable: true })
  description: string

  @Column({ type: "varchar" })
  method: string

  @Column({ type: "varchar" })
  base_router: string

  @BeforeInsert()
  private handleBeforeInsert(): void {
    if (this.id) {
      return
    }

    this.id = generateEntityId(this.id, "policy")
  }
}
