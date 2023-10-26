import {
  Entity,
  Column,
  Index,
  BeforeInsert,
  JoinTable,
  ManyToMany,
  OneToMany,
} from "typeorm"
import { generateEntityId } from "@medusajs/medusa/dist/utils"
import { SoftDeletableEntity } from "@medusajs/medusa"
import { Policy } from "./policy"
import { User } from "./user"

@Entity()
export class PolicyCluster extends SoftDeletableEntity {
  @Index({ unique: true })
  @Column({ type: "varchar" })
  name: string

  @Column({ type: "varchar", nullable: true })
  description: string

  @ManyToMany(() => Policy, { cascade: ["remove", "soft-remove"] })
  @JoinTable({
    name: "policy_cluster_policy",
    joinColumn: {
      name: "policyClusterId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "policyId",
      referencedColumnName: "id",
    },
  })
  policy: Policy[]

  @OneToMany(() => User, (user) => user.policy_cluster, {
    cascade: true,
  })
  user: User[]
  @BeforeInsert()
  private handleBeforeInsert(): void {
    if (this.id) {
      return
    }
    this.id = generateEntityId(this.id, "cluster")
  }
}
