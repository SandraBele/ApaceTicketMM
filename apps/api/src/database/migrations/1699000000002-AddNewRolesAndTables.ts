import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewRolesAndTables1699000000002 implements MigrationInterface {
  name = 'AddNewRolesAndTables1699000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
          ALTER TYPE "user_role" RENAME TO "user_role_old";
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      CREATE TYPE "user_role" AS ENUM('admin', 'tech_support', 'business_dev', 'management', 'product_dev')
    `);

    await queryRunner.query(`
      ALTER TABLE "users" 
      ALTER COLUMN "role" DROP DEFAULT
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_old') THEN
          ALTER TABLE "users" 
          ALTER COLUMN "role" TYPE "user_role" USING 
          CASE 
            WHEN "role"::text = 'admin' THEN 'admin'::user_role
            WHEN "role"::text = 'agent' THEN 'tech_support'::user_role
            WHEN "role"::text = 'user' THEN 'tech_support'::user_role
            ELSE 'tech_support'::user_role
          END;
        ELSE
          ALTER TABLE "users" 
          ALTER COLUMN "role" TYPE "user_role" USING "role"::text::user_role;
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      ALTER TABLE "users" 
      ALTER COLUMN "role" SET DEFAULT 'tech_support'
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_old') THEN
          DROP TYPE "user_role_old";
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'country'
        ) THEN
          ALTER TABLE "users" ADD COLUMN "country" character varying;
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invoices_status_enum') THEN
          CREATE TYPE "invoices_status_enum" AS ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled');
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "invoices" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "invoiceNumber" character varying NOT NULL,
        "clientName" character varying NOT NULL,
        "clientEmail" character varying NOT NULL,
        "description" text,
        "amount" double precision NOT NULL,
        "status" "invoices_status_enum" NOT NULL DEFAULT 'draft',
        "ticketId" uuid,
        "createdById" uuid NOT NULL,
        "dueDate" TIMESTAMP,
        "paidDate" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_invoices_invoiceNumber" UNIQUE ("invoiceNumber"),
        CONSTRAINT "PK_invoices_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_invoices_ticketId" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_invoices_createdById" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "kpis" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "month" character varying NOT NULL,
        "ticketsResolved" integer NOT NULL DEFAULT 0,
        "ticketsCreated" integer NOT NULL DEFAULT 0,
        "avgResolutionTimeHours" double precision NOT NULL DEFAULT 0,
        "opportunitiesCreated" integer NOT NULL DEFAULT 0,
        "opportunityValue" double precision NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_kpis_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_kpis_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'opportunities_status_enum') THEN
          CREATE TYPE "opportunities_status_enum" AS ENUM('lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost');
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "opportunities" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "description" text NOT NULL,
        "clientName" character varying NOT NULL,
        "clientEmail" character varying NOT NULL,
        "clientPhone" character varying,
        "estimatedValue" double precision NOT NULL DEFAULT 0,
        "status" "opportunities_status_enum" NOT NULL DEFAULT 'lead',
        "createdById" uuid NOT NULL,
        "assignedToId" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_opportunities_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_opportunities_createdById" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_opportunities_assignedToId" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "opportunities"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "opportunities_status_enum"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "kpis"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "invoices"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "invoices_status_enum"`);
    
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'country'
        ) THEN
          ALTER TABLE "users" DROP COLUMN "country";
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
          ALTER TYPE "user_role" RENAME TO "user_role_old";
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      CREATE TYPE "user_role" AS ENUM('admin', 'agent', 'user')
    `);

    await queryRunner.query(`
      ALTER TABLE "users" 
      ALTER COLUMN "role" DROP DEFAULT
    `);

    await queryRunner.query(`
      ALTER TABLE "users" 
      ALTER COLUMN "role" TYPE "user_role" USING 
      CASE 
        WHEN "role"::text = 'admin' THEN 'admin'::user_role
        ELSE 'user'::user_role
      END
    `);

    await queryRunner.query(`
      ALTER TABLE "users" 
      ALTER COLUMN "role" SET DEFAULT 'user'
    `);

    await queryRunner.query(`
      DROP TYPE IF EXISTS "user_role_old"
    `);
  }
}
