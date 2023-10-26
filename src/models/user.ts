import { Entity, JoinColumn, ManyToOne } from "typeorm"
import { User as MedusaUser } from "@medusajs/medusa"
import { PolicyCluster } from "./policy-cluster"

@Entity()
export class User extends MedusaUser {
  @ManyToOne(() => PolicyCluster, (groupPolicy) => groupPolicy.user)
  @JoinColumn({ name: "policy_cluster" })
  policy_cluster: PolicyCluster
}
