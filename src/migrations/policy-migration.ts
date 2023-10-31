import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from "typeorm"

export class MyMigration1692953518124 implements MigrationInterface {
  name = "myMigration1692953518124"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "policy",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
          },
          {
            name: "name",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "description",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "method",
            type: "varchar",
          },
          {
            name: "base_router",
            type: "varchar",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "deleted_at",
            type: "timestamp",
            isNullable: true,
          },
        ],
      })
    )

    await queryRunner.createTable(
      new Table({
        name: "policy_cluster",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
          },
          {
            name: "name",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "description",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "deleted_at",
            type: "timestamp",
            isNullable: true,
          },
        ],
      })
    )

    await queryRunner.createTable(
      new Table({
        name: "policy_cluster_policy",
        columns: [
          {
            name: "policyClusterId",
            type: "varchar",
            isPrimary: true,
          },
          {
            name: "policyId",
            type: "varchar",
            isPrimary: true,
          },
        ],
      })
    )

    await queryRunner.createForeignKey(
      "policy_cluster_policy",
      new TableForeignKey({
        columnNames: ["policyClusterId"],
        referencedColumnNames: ["id"],
        referencedTableName: "policy_cluster",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    )

    await queryRunner.createForeignKey(
      "policy_cluster_policy",
      new TableForeignKey({
        columnNames: ["policyId"],
        referencedColumnNames: ["id"],
        referencedTableName: "policy",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    )

    await queryRunner.addColumn(
      "user",
      new TableColumn({
        name: "policy_cluster",
        type: "varchar",
        isNullable: true,
      })
    )

    await queryRunner.createForeignKey(
      "user",
      new TableForeignKey({
        columnNames: ["policy_cluster"],
        referencedColumnNames: ["id"],
        referencedTableName: "policy_cluster",
        onDelete: "SET NULL",
      })
    )

    const policies = [
      {
        id: "policy_01HDMPA5VDKGF72V5A19G1T1S4",
        name: "List Users",
        description:
          "If this policy attached to the cluster the cluster can list users.",
        method: "GET",
        base_router: "users",
      },
      {
        id: "policy_01HDMPA5VDKGF72V5A19G1T1S5",
        name: "Create/Update Users",
        description:
          "If this policy attached to the cluster the cluster can create/update users",
        method: "POST",
        base_router: "users",
      },
      {
        id: "policy_01HDMPA5VDKGF72V5A19G1T1S6",
        name: "Delete Users",
        description:
          "If this policy attached to the cluster the cluster can delete users",
        method: "DELETE",
        base_router: "users",
      },
      // {
      //   id: "policy_01HDMPA5VDKGF72V5A19G1T1S3",
      //   name: "List Invites",
      //   description:
      //     "If this policy attached to the cluster the cluster can list invites",
      //   method: "GET",
      //   base_router: "invites",
      // },
      // {
      //   id: "policy_01HDMPA5VDKGF72V5A19G1T1S2",
      //   name: "Create/Update Invites",
      //   description:
      //     "If this policy attached to the cluster the cluster can create/update invites",
      //   method: "POST",
      //   base_router: "invites",
      // },
      {
        id: "policy_01HDMPA5VDKGF72V5A19G1T1S1",
        name: "Delete Invites",
        description:
          "If this policy attached to the cluster the cluster can delete invites",
        method: "DELETE",
        base_router: "invites",
      },
      {
        id: "policy_01HDMPA5VDKGF72V5A19G1T1S7",
        name: "List Apps",
        description:
          "If this policy attached to the cluster the cluster can list apps",
        method: "GET",
        base_router: "apps",
      },
      {
        id: "policy_01HDMPA5VDKGF72V5A19G1T1S8",
        name: "Authorize Apps",
        description:
          "If this policy attached to the cluster the cluster can authorize apps",
        method: "POST",
        base_router: "apps",
      },
      {
        id: "policy_01HDMPA5VDKGF72V5A19G1T1S9",
        name: "List Batch Jobs",
        description:
          "If this policy attached to the cluster the cluster can list batch jobs",
        method: "GET",
        base_router: "batch-jobs",
      },
      {
        id: "policy_21HDMPA5VDKGF72V5A19G1T1S8",
        name: "Create/Update Jobs",
        description:
          "If this policy attached to the cluster the cluster can update/create batch jobs",
        method: "POST",
        base_router: "batch-jobs",
      },
      {
        id: "policy_31HDMPA5VDKGF72V5A19G1T1S8",
        name: "Create/Update Collection",
        description:
          "If this policy attached to the cluster the cluster can update/create collection",
        method: "POST",
        base_router: "collections",
      },
      {
        id: "policy_41HDMPA5VDKGF72V5A19G1T1S8",
        name: "List Collection",
        description:
          "If this policy attached to the cluster the cluster can list collection",
        method: "GET",
        base_router: "collections",
      },
      {
        id: "policy_51HDMPA5VDKGF72V5A19G1T1S8",
        name: "Delete Collection",
        description:
          "If this policy attached to the cluster the cluster can delete collection",
        method: "GET",
        base_router: "collections",
      },
      {
        id: "policy_61HDMPA5VDKGF72V5A19G1T1S8",
        name: "Create/Update Customer Groups",
        description:
          "If this policy attached to the cluster the cluster can create/update customer groups",
        method: "POST",
        base_router: "customer-groups",
      },
      {
        id: "policy_71HDMPA5VDKGF72V5A19G1T1S8",
        name: "List Customer Groups",
        description:
          "If this policy attached to the cluster the cluster can list customer groups",
        method: "GET",
        base_router: "customer-groups",
      },
      {
        id: "policy_81HDMPA5VDKGF72V5A19G1T1S8",
        name: "Delete Customer Groups",
        description:
          "If this policy attached to the cluster the cluster can delete customer groups",
        method: "DELETE",
        base_router: "customer-groups",
      },
      {
        id: "policy_891HDMPA5VDKGF72V5A19G1T1S8",
        name: "List Customers",
        description:
          "If this policy attached to the cluster the cluster can list customers",
        method: "GET",
        base_router: "customers",
      },
      {
        id: "policy_991HDMPA5VDKGF72V5A19G1T1S8",
        name: "Update/Create Customers",
        description:
          "If this policy attached to the cluster the cluster can update/create customers",
        method: "POST",
        base_router: "customers",
      },
      {
        id: "policy_901HDMPA5VDKGF72V5A19G1T1S8",
        name: "Delete Customers",
        description:
          "If this policy attached to the cluster the cluster can delete customers",
        method: "DELETE",
        base_router: "customers",
      },
      {
        id: "policy_911HDMPA5VDKGF72V5A19G1T1S8",
        name: "List Currency",
        description:
          "If this policy attached to the cluster the cluster can list currency",
        method: "GET",
        base_router: "currencies",
      },
      {
        id: "policy_921HDMPA5VDKGF72V5A19G1T1S8",
        name: "Update Currency",
        description:
          "If this policy attached to the cluster the cluster can list currency",
        method: "POST",
        base_router: "currencies",
      },
      {
        id: "policy_931HDMPA5VDKGF72V5A19G1T1S8",
        name: "List Discounts",
        description:
          "If this policy attached to the cluster the cluster can list discounts",
        method: "GET",
        base_router: "discounts",
      },
      {
        id: "policy_941HDMPA5VDKGF72V5A19G1T1S8",
        name: "Update/Create Discounts",
        description:
          "If this policy attached to the cluster the cluster can update/create discounts",
        method: "POST",
        base_router: "discounts",
      },
      {
        id: "policy_951HDMPA5VDKGF72V5A19G1T1S8",
        name: "Delete Discounts",
        description:
          "If this policy attached to the cluster the cluster can delete discounts",
        method: "DELETE",
        base_router: "discounts",
      },
      {
        id: "policy_961HDMPA5VDKGF72V5A19G1T1S8",
        name: "List Draft Orders",
        description:
          "If this policy attached to the cluster the cluster can list draft orders",
        method: "GET",
        base_router: "draft-orders",
      },
      {
        id: "policy_971HDMPA5VDKGF72V5A19G1T1S8",
        name: "Update/Create Draft Orders",
        description:
          "If this policy attached to the cluster the cluster can update/create draft orders",
        method: "POST",
        base_router: "draft-orders",
      },
      {
        id: "policy_981HDMPA5VDKGF72V5A19G1T1S8",
        name: "Delete Draft Orders",
        description:
          "If this policy attached to the cluster the cluster can delete draft orders",
        method: "DELETE",
        base_router: "draft-orders",
      },
      {
        id: "policy_982HDMPA5VDKGF72V5A19G1T1S8",
        name: "List Gift Cards",
        description:
          "If this policy attached to the cluster the cluster can list gift cards",
        method: "GET",
        base_router: "gift-cards",
      },
      {
        id: "policy_983HDMPA5VDKGF72V5A19G1T1S8",
        name: "Update/Create Gift Cards",
        description:
          "If this policy attached to the cluster the cluster can update/create gift cards",
        method: "POST",
        base_router: "gift-cards",
      },
      {
        id: "policy_984HDMPA5VDKGF72V5A19G1T1S8",
        name: "Delete Gift Cards",
        description:
          "If this policy attached to the cluster the cluster can delete gift cards",
        method: "DELETE",
        base_router: "gift-cards",
      },
      {
        id: "policy_985HDMPA5VDKGF72V5A19G1T1S8",
        name: "List Inventory Items",
        description:
          "If this policy attached to the cluster the cluster can list inventory items",
        method: "GET",
        base_router: "inventory-items",
      },
      {
        id: "policy_986HDMPA5VDKGF72V5A19G1T1S8",
        name: "Create/Update Inventory Items",
        description:
          "If this policy attached to the cluster the cluster can create/update inventory items",
        method: "POST",
        base_router: "inventory-items",
      },
      {
        id: "policy_987HDMPA5VDKGF72V5A19G1T1S8",
        name: "Delete Inventory Items",
        description:
          "If this policy attached to the cluster the cluster can delete inventory items",
        method: "DELETE",
        base_router: "inventory-items",
      },
      {
        id: "policy_988HDMPA5VDKGF72V5A19G1T1S8",
        name: "List Invites",
        description:
          "If this policy attached to the cluster the cluster can list invites",
        method: "GET",
        base_router: "invites",
      },
      {
        id: "policy_989HDMPA5VDKGF72V5A19G1T1S8",
        name: "Create/Update Invites",
        description:
          "If this policy attached to the cluster the cluster can create/update invites",
        method: "POST",
        base_router: "invites",
      },
      {
        id: "policy_987ADMPA5VDKGF72V5A19G1T1S8",
        name: "Delete Items",
        description:
          "If this policy attached to the cluster the cluster can delete invites",
        method: "DELETE",
        base_router: "invites",
      },
      {
        id: "policy_01HDMPB8WBYXSSD75DTWT4FZCG",
        name: "List Notes",
        description:
          "If this policy attached to the cluster the cluster can list notes",
        method: "GET",
        base_router: "notes",
      },
      {
        id: "policy_11HDMPB8WBYXSSD75DTWT4FZCG",
        name: "Create/Update Notes",
        description:
          "If this policy attached to the cluster the cluster can create/update notes",
        method: "POST",
        base_router: "notes",
      },
      {
        id: "policy_21HDMPB8WBYXSSD75DTWT4FZCG",
        name: "Delete Notes",
        description:
          "If this policy attached to the cluster the cluster can delete notes",
        method: "DELETE",
        base_router: "notes",
      },
      {
        id: "policy_31HDMPB8WBYXSSD75DTWT4FZCG",
        name: "List Notifications",
        description:
          "If this policy attached to the cluster the cluster can list notifications",
        method: "GET",
        base_router: "notifications",
      },
      {
        id: "policy_41HDMPB8WBYXSSD75DTWT4FZCG",
        name: "Send Notification",
        description:
          "If this policy attached to the cluster the cluster can send notifications",
        method: "POST",
        base_router: "notifications",
      },
      {
        id: "policy_51HDMPB8WBYXSSD75DTWT4FZCG",
        name: "List Order",
        description:
          "If this policy attached to the cluster the cluster can list orders",
        method: "GET",
        base_router: "orders",
      },
      {
        id: "policy_61HDMPB8WBYXSSD75DTWT4FZCG",
        name: "Create/Update Order",
        description:
          "If this policy attached to the cluster the cluster can create/update orders",
        method: "POST",
        base_router: "orders",
      },
      // order-edits
      {
        id: "policy_71HDMPB8WBYXSSD75DTWT4FZCG",
        name: "Create/Update Order Edits",
        description:
          "If this policy attached to the cluster the cluster can create/update order edits",
        method: "POST",
        base_router: "order-edits",
      },
      {
        id: "policy_81HDMPB8WBYXSSD75DTWT4FZCG",
        name: "List Order Edits",
        description:
          "If this policy attached to the cluster the cluster can list order edits",
        method: "get",
        base_router: "order-edits",
      },
      {
        id: "policy_91HDMPB8WBYXSSD75DTWT4FZCG",
        name: "Delete Order Edits",
        description:
          "If this policy attached to the cluster the cluster can delete order edits",
        method: "DELETE",
        base_router: "order-edits",
      },
      {
        id: "policy_92HDMPB8WBYXSSD75DTWT4FZCG",
        name: "List Price Lists",
        description:
          "If this policy attached to the cluster the cluster can list price lists",
        method: "GET",
        base_router: "price-lists",
      },
      {
        id: "policy_93HDMPB8WBYXSSD75DTWT4FZCG",
        name: "Create/Update Price Lists",
        description:
          "If this policy attached to the cluster the cluster can create/update price lists",
        method: "POST",
        base_router: "price-lists",
      },
      {
        id: "policy_94HDMPB8WBYXSSD75DTWT4FZCG",
        name: "Delete Price Lists",
        description:
          "If this policy attached to the cluster the cluster can delete price lists",
        method: "DELETE",
        base_router: "price-lists",
      },
      {
        id: "policy_95HDMPB8WBYXSSD75DTWT4FZCG",
        name: "List Product Tags",
        description:
          "If this policy attached to the cluster the cluster can list tags",
        method: "GET",
        base_router: "product-tags",
      },
      {
        id: "policy_96HDMPB8WBYXSSD75DTWT4FZCG",
        name: "Create/Update Products",
        description:
          "If this policy attached to the cluster the cluster can create/update products",
        method: "POST",
        base_router: "products",
      },
      {
        id: "policy_97HDMPB8WBYXSSD75DTWT4FZCG",
        name: "List Products",
        description:
          "If this policy attached to the cluster the cluster can list products",
        method: "GET",
        base_router: "products",
      },
      {
        id: "policy_98HDMPB8WBYXSSD75DTWT4FZCG",
        name: "Delete Products",
        description:
          "If this policy attached to the cluster the cluster can delete products",
        method: "DELETE",
        base_router: "products",
      },
      {
        id: "policy_99HDMPB8WBYXSSD75DTWT4FZCG",
        name: "List Product Types",
        description:
          "If this policy attached to the cluster the cluster can list product types",
        method: "GET",
        base_router: "product-types",
      },
      {
        id: "policy_01HDMP81YR1MQH8JS7S7Y2DTT9",
        name: "List Publishable API Keys",
        description:
          "If this policy attached to the cluster the cluster can list publishable API keys",
        method: "GET",
        base_router: "publishable-api-keys",
      },
      {
        id: "policy_11HDMP81YR1MQH8JS7S7Y2DTT9",
        name: "Create/Update Publishable API Keys",
        description:
          "If this policy attached to the cluster the cluster can create/update publishable API keys",
        method: "POST",
        base_router: "publishable-api-keys",
      },
      {
        id: "policy_21HDMP81YR1MQH8JS7S7Y2DTT9",
        name: "Delete Publishable API Keys",
        description:
          "If this policy attached to the cluster the cluster can delete publishable API keys",
        method: "DELETE",
        base_router: "publishable-api-keys",
      },
      {
        id: "policy_31HDMP81YR1MQH8JS7S7Y2DTT9",
        name: "List Regions",
        description:
          "If this policy attached to the cluster the cluster can list regions",
        method: "GET",
        base_router: "regions",
      },
      {
        id: "policy_41HDMP81YR1MQH8JS7S7Y2DTT9",
        name: "Create/Update Regions",
        description:
          "If this policy attached to the cluster the cluster can create/update regions",
        method: "POST",
        base_router: "regions",
      },
      {
        id: "policy_51HDMP81YR1MQH8JS7S7Y2DTT9",
        name: "Delete Regions",
        description:
          "If this policy attached to the cluster the cluster can delete regions",
        method: "DELETE",
        base_router: "regions",
      },
      {
        id: "policy_61HDMP81YR1MQH8JS7S7Y2DTT9",
        name: "List Reservations",
        description:
          "If this policy attached to the cluster the cluster can list reservations",
        method: "GET",
        base_router: "reservations",
      },
      {
        id: "policy_71HDMP81YR1MQH8JS7S7Y2DTT9",
        name: "Create/Update Reservations",
        description:
          "If this policy attached to the cluster the cluster can create/update reservations",
        method: "DELETE",
        base_router: "reservations",
      },
      {
        id: "policy_81HDMP81YR1MQH8JS7S7Y2DTT9",
        name: "Delete Reservations",
        description:
          "If this policy attached to the cluster the cluster can delete reservations",
        method: "DELETE",
        base_router: "reservations",
      },
      {
        id: "policy_91HDMP81YR1MQH8JS7S7Y2DTT9",
        name: "List Return Reasons",
        description:
          "If this policy attached to the cluster the cluster can list return reasons",
        method: "GET",
        base_router: "return-reasons",
      },
      {
        id: "policy_02HDMP81YR1MQH8JS7S7Y2DTT9",
        name: "Create/Update Return Reasons",
        description:
          "If this policy attached to the cluster the cluster can create/update return reasons",
        method: "POST",
        base_router: "return-reasons",
      },
      {
        id: "policy_03HDMP81YR1MQH8JS7S7Y2DTT9",
        name: "Delete Return Reasons",
        description:
          "If this policy attached to the cluster the cluster can delete return reasons",
        method: "DELETE",
        base_router: "return-reasons",
      },
      {
        id: "policy_04HDMP81YR1MQH8JS7S7Y2DTT9",
        name: "List Returns",
        description:
          "If this policy attached to the cluster the cluster can list returns",
        method: "GET",
        base_router: "returns",
      },
      {
        id: "policy_05HDMP81YR1MQH8JS7S7Y2DTT9",
        name: "Create/Update Returns",
        description:
          "If this policy attached to the cluster the cluster can create/update returns",
        method: "POST",
        base_router: "returns",
      },
      {
        id: "policy_06HDMP81YR1MQH8JS7S7Y2DTT9",
        name: "Create/Update Sales Channels",
        description:
          "If this policy attached to the cluster the cluster can create/update sales channels",
        method: "POST",
        base_router: "sales-channels",
      },
      {
        id: "policy_07HDMP81YR1MQH8JS7S7Y2DTT9",
        name: "List Sales Channels",
        description:
          "If this policy attached to the cluster the cluster can list sales channels",
        method: "GET",
        base_router: "sales-channels",
      },
      {
        id: "policy_09HDMP81YR1MQH8JS7S7Y2DTT9",
        name: "Delete Sales Channels",
        description:
          "If this policy attached to the cluster the cluster can delete sales channels",
        method: "DELETE",
        base_router: "sales-channels",
      },
      {
        id: "policy_01HDMP7YS9YB6DJQMMVBZDWZN5",
        name: "List Shipping Options",
        description:
          "If this policy attached to the cluster the cluster can list shipping options",
        method: "GET",
        base_router: "shipping-options",
      },
      {
        id: "policy_02HDMP7YS9YB6DJQMMVBZDWZN5",
        name: "Create/Update Shipping Options",
        description:
          "If this policy attached to the cluster the cluster can create/update shipping options",
        method: "POST",
        base_router: "shipping-options",
      },
      {
        id: "policy_03HDMP7YS9YB6DJQMMVBZDWZN5",
        name: "Delete Shipping Options",
        description:
          "If this policy attached to the cluster the cluster can delete shipping options",
        method: "DELETE",
        base_router: "shipping-options",
      },
      {
        id: "policy_04HDMP7YS9YB6DJQMMVBZDWZN5",
        name: "List Stock Locations",
        description:
          "If this policy attached to the cluster the cluster can list stock locations",
        method: "GET",
        base_router: "stock-locations",
      },
      {
        id: "policy_05HDMP7YS9YB6DJQMMVBZDWZN5",
        name: "Create/Update Stock Locations",
        description:
          "If this policy attached to the cluster the cluster can list stock locations",
        method: "POST",
        base_router: "stock-locations",
      },
      {
        id: "policy_06HDMP7YS9YB6DJQMMVBZDWZN5",
        name: "Delete Stock Locations",
        description:
          "If this policy attached to the cluster the cluster can delete stock locations",
        method: "DELETE",
        base_router: "stock-locations",
      },
      {
        id: "policy_07HDMP7YS9YB6DJQMMVBZDWZN5",
        name: "List Store Options",
        description:
          "If this policy attached to the cluster the cluster can list store options",
        method: "GET",
        base_router: "store",
      },
      {
        id: "policy_08HDMP7YS9YB6DJQMMVBZDWZN5",
        name: "Create/Update Store Options",
        description:
          "If this policy attached to the cluster the cluster can create/update store options",
        method: "POST",
        base_router: "store",
      },
      {
        id: "policy_09HDMP7YS9YB6DJQMMVBZDWZN5",
        name: "Delete Store Options",
        description:
          "If this policy attached to the cluster the cluster can delete store options",
        method: "DELETE",
        base_router: "store",
      },
      {
        id: "policy_10HDMP7YS9YB6DJQMMVBZDWZN5",
        name: "List Swaps",
        description:
          "If this policy attached to the cluster the cluster can list swaps",
        method: "GET",
        base_router: "swaps",
      },
      {
        id: "policy_11HDMP7YS9YB6DJQMMVBZDWZN5",
        name: "Create/Update Tax Rates",
        description:
          "If this policy attached to the cluster the cluster can create/update tax rates",
        method: "POST",
        base_router: "tax-rates",
      },
      {
        id: "policy_21HDMP7YS9YB6DJQMMVBZDWZN5",
        name: "List Tax Rates",
        description:
          "If this policy attached to the cluster the cluster can list tax rates",
        method: "GET",
        base_router: "tax-rates",
      },
      {
        id: "policy_31HDMP7YS9YB6DJQMMVBZDWZN5",
        name: "Delete Tax Rates",
        description:
          "If this policy attached to the cluster the cluster can delete tax rates",
        method: "DELETE",
        base_router: "tax-rates",
      },
      {
        id: "policy_41HDMP7YS9YB6DJQMMVBZDWZN5",
        name: "Upload File",
        description:
          "If this policy attached to the cluster the cluster can upload file",
        method: "POST",
        base_router: "uploads",
      },
      {
        id: "policy_51HDMP7YS9YB6DJQMMVBZDWZN5",
        name: "Delete File",
        description:
          "If this policy attached to the cluster the cluster can delete file",
        method: "DELETE",
        base_router: "uploads",
      },
      {
        id: "policy_61HDMP7YS9YB6DJQMMVBZDWZN5",
        name: "List Team Users",
        description:
          "If this policy attached to the cluster the cluster can list users",
        method: "GET",
        base_router: "users",
      },
      {
        id: "policy_71HDMP7YS9YB6DJQMMVBZDWZN5",
        name: "Delete Team Users",
        description:
          "If this policy attached to the cluster the cluster can delete users",
        method: "DELETE",
        base_router: "users",
      },
      {
        id: "policy_81HDMP7YS9YB6DJQMMVBZDWZN5",
        name: "Create/Update Team Users",
        description:
          "If this policy attached to the cluster the cluster can create/update users",
        method: "POST",
        base_router: "users",
      },
      {
        id: "policy_91HDMP7YS9YB6DJQMMVBZDWZN5",
        name: "List Variants",
        description:
          "If this policy attached to the cluster the cluster can list variants",
        method: "GET",
        base_router: "variants",
      },
      {
        id: "policy_01HDMP7TBDEFD32KKQBB6ZD1CZ",
        name: "List Payment Collections",
        description:
          "If this policy attached to the cluster the cluster can list payment collections",
        method: "GET",
        base_router: "payment-collections",
      },
      {
        id: "policy_02HDMP7TBDEFD32KKQBB6ZD1CZ",
        name: "Create/Update Payment Collections",
        description:
          "If this policy attached to the cluster the cluster can create/update payment collections",
        method: "POST",
        base_router: "payment-collections",
      },
      {
        id: "policy_03HDMP7TBDEFD32KKQBB6ZD1CZ",
        name: "Delete Payment Collections",
        description:
          "If this policy attached to the cluster the cluster can delete payment collections",
        method: "DELETE",
        base_router: "payment-collections",
      },
      {
        id: "policy_04HDMP7TBDEFD32KKQBB6ZD1CZ",
        name: "List Payment",
        description:
          "If this policy attached to the cluster the cluster can list payment",
        method: "GET",
        base_router: "payments",
      },
      {
        id: "policy_05HDMP7TBDEFD32KKQBB6ZD1CZ",
        name: "Create/Update Payment",
        description:
          "If this policy attached to the cluster the cluster can create/update payment",
        method: "POST",
        base_router: "payments",
      },
      {
        id: "policy_05HDMP7TBDEFD32KKQBB7ZD1CZ",
        name: "List Product Categories",
        description:
          "If this policy attached to the cluster the cluster can list product categories",
        method: "GET",
        base_router: "product-categories",
      },
      {
        id: "policy_06HDMP7TBDEFD32KKQBB6ZD1CZ",
        name: "Create/Update Product Categories",
        description:
          "If this policy attached to the cluster the cluster can create/update product categories",
        method: "POST",
        base_router: "product-categories",
      },
      {
        id: "policy_07HDMP7TBDEFD32KKQBB6ZD1CZ",
        name: "Delete Product Categories",
        description:
          "If this policy attached to the cluster the cluster can delete product categories",
        method: "DELETE",
        base_router: "product-categories",
      },
      {
        id: "policy_08HDMP7TBDEFD32KKQBB6ZD1CZ",
        name: "Create/Update Policy",
        description:
          "If this policy attached to the cluster the cluster can create/update policy",
        method: "POST",
        base_router: "policy",
      },
      {
        id: "policy_09HDMP7TBDEFD32KKQBB6ZD1CZ",
        name: "List Policy",
        description:
          "If this policy attached to the cluster the cluster can list policies",
        method: "GET",
        base_router: "policy",
      },
      {
        id: "policy_19HDMP7TBDEFD32KKQBB6ZD1CZ",
        name: "Delete Policy",
        description:
          "If this policy attached to the cluster the cluster can delete policies",
        method: "DELETE",
        base_router: "policy",
      },
      {
        id: "policy_29HDMP7TBDEFD32KKQBB6ZD1CZ",
        name: "List Policy Cluster",
        description:
          "If this policy attached to the cluster the cluster can list policy clusters",
        method: "GET",
        base_router: "policy-cluster",
      },
      {
        id: "policy_39HDMP7TBDEFD32KKQBB6ZD1CZ",
        name: "Create/Update Policy Cluster",
        description:
          "If this policy attached to the cluster the cluster can create/update policy clusters",
        method: "POST",
        base_router: "policy-cluster",
      },
      {
        id: "policy_49HDMP7TBDEFD32KKQBB6ZD1CZ",
        name: "DELETE Policy Cluster",
        description:
          "If this policy attached to the cluster the cluster can delete policy clusters",
        method: "DELETE",
        base_router: "policy-cluster",
      },
    ]

    for (let policy of policies) {
      await queryRunner.manager.insert("policy", policy)
    }

    const policyClusterId = "cluster_01HDMS8RCDW1AGWGGEXTE8SQEF"
    await queryRunner.manager.insert("policy_cluster", {
      id: policyClusterId,
      name: "Root", // You can give a meaningful name
    })

    for (let policy of policies) {
      await queryRunner.manager.insert("policy_cluster_policy", {
        policyClusterId: policyClusterId,
        policyId: policy.id,
      })
    }

    await queryRunner.manager.update(
      "user",
      {},
      { policy_cluster: policyClusterId }
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const usersTable = await queryRunner.getTable("user")
    const usersForeignKey = usersTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("policy_cluster") !== -1
    )
    await queryRunner.dropForeignKey("user", usersForeignKey)

    await queryRunner.dropColumn("user", "policy_cluster")

    const policiesGroupPoliciesTable = await queryRunner.getTable(
      "policy_cluster_policy"
    )
    const foreignKey1 = policiesGroupPoliciesTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("policyClusterId") !== -1
    )
    const foreignKey2 = policiesGroupPoliciesTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("policyId") !== -1
    )

    await queryRunner.dropForeignKeys("policy_cluster_policy", [
      foreignKey1,
      foreignKey2,
    ])
    await queryRunner.dropTable("policy_cluster_policy")

    await queryRunner.dropTable("policy_cluster")
    await queryRunner.dropTable("policy")
  }
}
