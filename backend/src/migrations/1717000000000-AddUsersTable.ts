import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsersTable1717000000000 implements MigrationInterface {
    name = 'AddUsersTable1717000000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id"            nvarchar(255)  NOT NULL,
                "username"      nvarchar(100)  NOT NULL,
                "email"         nvarchar(255)  NOT NULL,
                "password_hash" nvarchar(255)  NOT NULL,
                "role"          nvarchar(20)   NOT NULL
                    CONSTRAINT "DF_users_role" DEFAULT 'client',
                "created_at"    datetime       NOT NULL
                    CONSTRAINT "DF_users_created_at" DEFAULT GETDATE(),
                "updated_at"    datetime       NOT NULL
                    CONSTRAINT "DF_users_updated_at" DEFAULT GETDATE(),
                CONSTRAINT "PK_users" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_users_username" UNIQUE ("username")
            )
        `);

        // Index on username for fast lookups during login
        await queryRunner.query(
            `CREATE INDEX "IDX_users_username" ON "users" ("username")`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_users_username" ON "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
