import {PolicyCluster} from "./models/policy-cluster";

export declare module "@medusajs/medusa/dist/models/user" {
    declare interface User {
        policy_cluster: PolicyCluster
    }
}