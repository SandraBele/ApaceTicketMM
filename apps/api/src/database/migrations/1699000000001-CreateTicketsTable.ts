import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTicketsTable1699000000001 implements MigrationInterface {
  name = 'CreateTicketsTable1699000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "tickets" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "description" text NOT NULL,
        "status" "ticket_status" NOT NULL DEFAULT 'open',
        "priority" "ticket_priority" NOT NULL DEFAULT 'medium',
        "category" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "resolvedAt" TIMESTAMP,
        "createdById" uuid NOT NULL,
        "assignedToId" uuid,
        "slaMinutes" integer NOT NULL DEFAULT 240,
        "slaWarningPercent" integer NOT NULL DEFAULT 75,
        CONSTRAINT "PK_tickets_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_tickets_createdById" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_tickets_assignedToId" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tickets"`);
  }
}
