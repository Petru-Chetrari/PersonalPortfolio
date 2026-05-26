import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1748250000000 implements MigrationInterface {
    name = 'InitialSchema1748250000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ─── projects ────────────────────────────────────────────────
        await queryRunner.query(`
            CREATE TABLE "projects" (
                "id"         nvarchar(255) NOT NULL,
                "title"      nvarchar(255) NOT NULL,
                "type"       nvarchar(255) NOT NULL,
                "desc"       ntext         NOT NULL,
                "image"      nvarchar(255) NOT NULL,
                "imageAlt"   nvarchar(255) NOT NULL,
                "updated_at" datetime      NOT NULL
                    CONSTRAINT "DF_projects_updated_at" DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "PK_projects" PRIMARY KEY ("id")
            )
        `);

        // ─── tags (normalised from Project.tags[] → 3NF) ────────────
        await queryRunner.query(`
            CREATE TABLE "tags" (
                "id"   int           NOT NULL IDENTITY(1,1),
                "name" nvarchar(255) NOT NULL,
                CONSTRAINT "PK_tags"     PRIMARY KEY ("id"),
                CONSTRAINT "UQ_tags_name" UNIQUE ("name")
            )
        `);

        // ─── project_tags  (M:N junction) ────────────────────────────
        await queryRunner.query(`
            CREATE TABLE "project_tags" (
                "projectsId" nvarchar(255) NOT NULL,
                "tagsId"     int           NOT NULL,
                CONSTRAINT "PK_project_tags" PRIMARY KEY ("projectsId", "tagsId")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "project_tags"
                ADD CONSTRAINT "FK_project_tags_projects"
                FOREIGN KEY ("projectsId") REFERENCES "projects"("id")
                ON DELETE CASCADE ON UPDATE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "project_tags"
                ADD CONSTRAINT "FK_project_tags_tags"
                FOREIGN KEY ("tagsId") REFERENCES "tags"("id")
                ON DELETE CASCADE ON UPDATE CASCADE
        `);

        await queryRunner.query(
            `CREATE INDEX "IDX_project_tags_projectsId" ON "project_tags" ("projectsId")`
        );

        await queryRunner.query(
            `CREATE INDEX "IDX_project_tags_tagsId" ON "project_tags" ("tagsId")`
        );

        // ─── commissions ─────────────────────────────────────────────
        await queryRunner.query(`
            CREATE TABLE "commissions" (
                "id"         nvarchar(255) NOT NULL,
                "client"     nvarchar(255) NOT NULL,
                "title"      nvarchar(255) NOT NULL,
                "appType"    nvarchar(255) NOT NULL,
                "status"     nvarchar(255) NOT NULL,
                "date"       nvarchar(255) NOT NULL,
                "dueDate"    nvarchar(255) NOT NULL,
                "note"       nvarchar(255)     NULL,
                "budget"     nvarchar(255)     NULL,
                "shortDesc"  nvarchar(255)     NULL,
                "longDesc"   nvarchar(255)     NULL,
                "updated_at" datetime      NOT NULL
                    CONSTRAINT "DF_commissions_updated_at" DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "PK_commissions" PRIMARY KEY ("id")
            )
        `);

        // ─── interactions ────────────────────────────────────────────
        await queryRunner.query(`
            CREATE TABLE "interactions" (
                "date"        nvarchar(255) NOT NULL,
                "links"       int           NOT NULL CONSTRAINT "DF_interactions_links"       DEFAULT 0,
                "projects"    int           NOT NULL CONSTRAINT "DF_interactions_projects"    DEFAULT 0,
                "commissions" int           NOT NULL CONSTRAINT "DF_interactions_commissions" DEFAULT 0,
                CONSTRAINT "PK_interactions" PRIMARY KEY ("date")
            )
        `);

        // ─── Triggers: auto-update updated_at ────────────────────────
        await queryRunner.query(`
            CREATE TRIGGER trg_projects_updated_at
            ON "projects"
            AFTER UPDATE
            AS
            BEGIN
                SET NOCOUNT ON;
                UPDATE p
                SET p."updated_at" = GETDATE()
                FROM "projects" p
                INNER JOIN inserted i ON p."id" = i."id";
            END
        `);

        await queryRunner.query(`
            CREATE TRIGGER trg_commissions_updated_at
            ON "commissions"
            AFTER UPDATE
            AS
            BEGIN
                SET NOCOUNT ON;
                UPDATE c
                SET c."updated_at" = GETDATE()
                FROM "commissions" c
                INNER JOIN inserted i ON c."id" = i."id";
            END
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Triggers
        await queryRunner.query(`DROP TRIGGER IF EXISTS trg_commissions_updated_at`);
        await queryRunner.query(`DROP TRIGGER IF EXISTS trg_projects_updated_at`);

        // Junction indexes & foreign keys
        await queryRunner.query(`DROP INDEX "IDX_project_tags_tagsId"     ON "project_tags"`);
        await queryRunner.query(`DROP INDEX "IDX_project_tags_projectsId" ON "project_tags"`);
        await queryRunner.query(`ALTER TABLE "project_tags" DROP CONSTRAINT "FK_project_tags_tags"`);
        await queryRunner.query(`ALTER TABLE "project_tags" DROP CONSTRAINT "FK_project_tags_projects"`);

        // Tables (reverse dependency order)
        await queryRunner.query(`DROP TABLE "project_tags"`);
        await queryRunner.query(`DROP TABLE "interactions"`);
        await queryRunner.query(`DROP TABLE "commissions"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`DROP TABLE "projects"`);
    }
}
