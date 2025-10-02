import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTeamsAuditLogsSystemConfig1699000000003 implements MigrationInterface {
  name = 'AddTeamsAuditLogsSystemConfig1699000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create audit_action enum
    await queryRunner.query(`
      CREATE TYPE "audit_action" AS ENUM(
        'user_created', 'user_updated', 'user_deactivated', 'user_reactivated', 'user_deleted',
        'password_reset', 'role_changed', 'ticket_created', 'ticket_updated', 'ticket_assigned',
        'ticket_deleted', 'kpi_configured', 'sla_configured', 'team_created', 'team_updated',
        'invoice_created', 'invoice_updated', 'email_sent', 'backup_triggered', 'backup_failed',
        'secret_rotated', 'login_failed', 'login_success', 'account_locked', 'account_unlocked'
      )
    `);

    // Create config_key enum
    await queryRunner.query(`
      CREATE TYPE "config_key" AS ENUM(
        'sla_warning_threshold', 'sla_breach_threshold', 'failed_login_attempts_limit',
        'password_min_length', 'require_2fa_for_admin', 'backup_enabled', 'backup_schedule',
        'email_notifications_enabled', 'whatsapp_integration_enabled', 'invoicing_enabled',
        'ai_categorization_enabled'
      )
    `);

    // Create teams table
    await queryRunner.query(`
      CREATE TABLE "teams" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" text,
        "defaultTicketsResolvedKPI" integer NOT NULL DEFAULT 0,
        "defaultTicketsCreatedKPI" integer NOT NULL DEFAULT 0,
        "defaultAvgResolutionTimeKPI" double precision NOT NULL DEFAULT 0,
        "defaultOpportunitiesKPI" integer NOT NULL DEFAULT 0,
        "defaultSLAHours" double precision NOT NULL DEFAULT 4.0,
        "timezone" character varying NOT NULL DEFAULT 'UTC',
        "workingHoursStart" character varying NOT NULL DEFAULT '09:00',
        "workingHoursEnd" character varying NOT NULL DEFAULT '17:00',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_teams_id" PRIMARY KEY ("id")
      )
    `);

    // Create audit_logs table
    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "action" "audit_action" NOT NULL,
        "performedById" uuid,
        "targetUserId" uuid,
        "entityType" character varying,
        "entityId" character varying,
        "details" text,
        "ipAddress" character varying,
        "userAgent" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_audit_logs_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_audit_logs_performedById" FOREIGN KEY ("performedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_audit_logs_targetUserId" FOREIGN KEY ("targetUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    // Create system_config table
    await queryRunner.query(`
      CREATE TABLE "system_config" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "key" "config_key" NOT NULL,
        "value" text NOT NULL,
        "description" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_system_config_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_system_config_key" UNIQUE ("key")
      )
    `);

    // Add new columns to users table
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'teamId'
        ) THEN
          ALTER TABLE "users" ADD COLUMN "teamId" uuid;
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'failedLoginAttempts'
        ) THEN
          ALTER TABLE "users" ADD COLUMN "failedLoginAttempts" integer NOT NULL DEFAULT 0;
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'isLocked'
        ) THEN
          ALTER TABLE "users" ADD COLUMN "isLocked" boolean NOT NULL DEFAULT false;
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'lastLoginAt'
        ) THEN
          ALTER TABLE "users" ADD COLUMN "lastLoginAt" TIMESTAMP;
        END IF;
      END $$;
    `);

    // Add foreign key constraint for team relationship
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints 
          WHERE constraint_name = 'FK_users_teamId'
        ) THEN
          ALTER TABLE "users" ADD CONSTRAINT "FK_users_teamId" 
          FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
        END IF;
      END $$;
    `);

    // Create indexes for performance
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_tickets_status" ON "tickets" ("status")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_tickets_assignedToId" ON "tickets" ("assignedToId")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_tickets_createdAt" ON "tickets" ("createdAt")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_audit_logs_createdAt" ON "audit_logs" ("createdAt")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_audit_logs_performedById" ON "audit_logs" ("performedById")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_audit_logs_performedById"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_audit_logs_createdAt"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_tickets_createdAt"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_tickets_assignedToId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_tickets_status"`);

    // Drop foreign key constraint
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.table_constraints 
          WHERE constraint_name = 'FK_users_teamId'
        ) THEN
          ALTER TABLE "users" DROP CONSTRAINT "FK_users_teamId";
        END IF;
      END $$;
    `);

    // Drop new columns from users table
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'lastLoginAt'
        ) THEN
          ALTER TABLE "users" DROP COLUMN "lastLoginAt";
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'isLocked'
        ) THEN
          ALTER TABLE "users" DROP COLUMN "isLocked";
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'failedLoginAttempts'
        ) THEN
          ALTER TABLE "users" DROP COLUMN "failedLoginAttempts";
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'teamId'
        ) THEN
          ALTER TABLE "users" DROP COLUMN "teamId";
        END IF;
      END $$;
    `);

    // Drop tables
    await queryRunner.query(`DROP TABLE IF EXISTS "system_config"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "audit_logs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "teams"`);

    // Drop enums
    await queryRunner.query(`DROP TYPE IF EXISTS "config_key"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "audit_action"`);
  }
}
