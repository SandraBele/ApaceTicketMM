import { AppDataSource } from '../data-source';
import { User, UserRole } from '../../users/entities/user.entity';
import { Ticket, TicketStatus, TicketPriority } from '../../tickets/entities/ticket.entity';
import { KPI } from '../../kpis/entities/kpi.entity';
import { Invoice, InvoiceStatus } from '../../invoices/entities/invoice.entity';
import { Opportunity, OpportunityStatus } from '../../opportunities/entities/opportunity.entity';
import * as bcrypt from 'bcryptjs';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected for seeding');

    const userRepository = AppDataSource.getRepository(User);
    const ticketRepository = AppDataSource.getRepository(Ticket);
    const kpiRepository = AppDataSource.getRepository(KPI);
    const invoiceRepository = AppDataSource.getRepository(Invoice);
    const opportunityRepository = AppDataSource.getRepository(Opportunity);

    await AppDataSource.query('TRUNCATE TABLE "opportunities", "invoices", "kpis", "tickets", "users" RESTART IDENTITY CASCADE');

    // Create users with requested credentials
    const adminUser = userRepository.create({
      email: 'admin@apace.local',
      firstName: 'Admin',
      lastName: 'User',
      password: await bcrypt.hash('admin123', 10),
      role: UserRole.ADMIN,
    });

    const supportUser = userRepository.create({
      email: 'support@apace.local',
      firstName: 'Support',
      lastName: 'Agent',
      password: await bcrypt.hash('support123', 10),
      role: UserRole.TECH_SUPPORT,
      country: 'USA',
    });

    const bdUser = userRepository.create({
      email: 'bd@apace.local',
      firstName: 'Business',
      lastName: 'Development',
      password: await bcrypt.hash('bd123456', 10),
      role: UserRole.BUSINESS_DEV,
      country: 'UK',
    });

    const mgmtUser = userRepository.create({
      email: 'mgmt@apace.local',
      firstName: 'Management',
      lastName: 'Team',
      password: await bcrypt.hash('mgmt123', 10),
      role: UserRole.MANAGEMENT,
      country: 'USA',
    });

    const productDevUser = userRepository.create({
      email: 'productdev@apace.local',
      firstName: 'Product',
      lastName: 'Developer',
      password: await bcrypt.hash('productdev123', 10),
      role: UserRole.PRODUCT_DEV,
      country: 'Germany',
    });

    await userRepository.save([adminUser, supportUser, bdUser, mgmtUser, productDevUser]);
    console.log('Users created successfully');

    // Create tickets with SLA demo data
    const now = new Date();
    const tickets = [
      {
        title: 'SLA Demo: GREEN Status',
        description: 'This ticket demonstrates GREEN SLA status (recently created)',
        status: TicketStatus.OPEN,
        priority: TicketPriority.HIGH,
        category: 'SLA Demo',
        createdById: bdUser.id,
        assignedToId: supportUser.id,
        slaMinutes: 4, // 4 minutes for demo
        slaWarningPercent: 75,
        createdAt: new Date(now.getTime() - 1 * 60 * 1000), // 1 minute ago
      },
      {
        title: 'SLA Demo: YELLOW Status',
        description: 'This ticket demonstrates YELLOW SLA status (75% threshold reached)',
        status: TicketStatus.IN_PROGRESS,
        priority: TicketPriority.HIGH,
        category: 'SLA Demo',
        createdById: bdUser.id,
        assignedToId: supportUser.id,
        slaMinutes: 4, // 4 minutes for demo
        slaWarningPercent: 75,
        createdAt: new Date(now.getTime() - 3 * 60 * 1000), // 3 minutes ago (75% of 4 min)
      },
      {
        title: 'SLA Demo: RED Status',
        description: 'This ticket demonstrates RED SLA status (SLA exceeded)',
        status: TicketStatus.OPEN,
        priority: TicketPriority.URGENT,
        category: 'SLA Demo',
        createdById: mgmtUser.id,
        assignedToId: supportUser.id,
        slaMinutes: 4, // 4 minutes for demo
        slaWarningPercent: 75,
        createdAt: new Date(now.getTime() - 5 * 60 * 1000), // 5 minutes ago (exceeds 4 min SLA)
      },
      {
        title: 'Login Issue',
        description: 'Unable to login to the system with correct credentials',
        status: TicketStatus.OPEN,
        priority: TicketPriority.HIGH,
        category: 'Authentication',
        createdById: bdUser.id,
        assignedToId: supportUser.id,
        slaMinutes: 240, // 4 hours
        slaWarningPercent: 75,
      },
      {
        title: 'Feature Request: Dark Mode',
        description: 'Please add dark mode support to the application',
        status: TicketStatus.IN_PROGRESS,
        priority: TicketPriority.MEDIUM,
        category: 'Feature Request',
        createdById: bdUser.id,
        assignedToId: supportUser.id,
        slaMinutes: 480, // 8 hours
        slaWarningPercent: 75,
      },
      {
        title: 'Database Performance Issue',
        description: 'Queries are running slowly, need optimization',
        status: TicketStatus.RESOLVED,
        priority: TicketPriority.URGENT,
        category: 'Performance',
        createdById: adminUser.id,
        assignedToId: supportUser.id,
        slaMinutes: 120, // 2 hours
        slaWarningPercent: 75,
        resolvedAt: new Date(),
      },
    ];

    for (const ticketData of tickets) {
      const ticket = ticketRepository.create(ticketData);
      // Set custom createdAt if provided
      if (ticketData.createdAt) {
        ticket.createdAt = ticketData.createdAt;
      }
      await ticketRepository.save(ticket);
    }

    console.log('Tickets created successfully');

    const currentMonth = new Date().toISOString().substring(0, 7);
    const kpis = [
      {
        userId: adminUser.id,
        month: currentMonth,
        ticketsResolved: 15,
        ticketsCreated: 20,
        avgResolutionTimeHours: 4.5,
        opportunitiesCreated: 0,
        opportunityValue: 0,
      },
      {
        userId: supportUser.id,
        month: currentMonth,
        ticketsResolved: 25,
        ticketsCreated: 5,
        avgResolutionTimeHours: 3.2,
        opportunitiesCreated: 0,
        opportunityValue: 0,
      },
      {
        userId: bdUser.id,
        month: currentMonth,
        ticketsResolved: 0,
        ticketsCreated: 10,
        avgResolutionTimeHours: 0,
        opportunitiesCreated: 8,
        opportunityValue: 125000,
      },
      {
        userId: mgmtUser.id,
        month: currentMonth,
        ticketsResolved: 5,
        ticketsCreated: 15,
        avgResolutionTimeHours: 6.0,
        opportunitiesCreated: 0,
        opportunityValue: 0,
      },
      {
        userId: productDevUser.id,
        month: currentMonth,
        ticketsResolved: 12,
        ticketsCreated: 18,
        avgResolutionTimeHours: 8.5,
        opportunitiesCreated: 0,
        opportunityValue: 0,
      },
    ];

    for (const kpiData of kpis) {
      const kpi = kpiRepository.create(kpiData);
      await kpiRepository.save(kpi);
    }
    console.log('KPIs created successfully');

    const opportunities = [
      {
        title: 'Enterprise Software Deal - Acme Corp',
        description: 'Large enterprise looking for custom ticketing solution',
        clientName: 'Acme Corporation',
        clientEmail: 'contact@acmecorp.com',
        clientPhone: '+1-555-0100',
        estimatedValue: 50000,
        status: OpportunityStatus.PROPOSAL,
        createdById: bdUser.id,
        assignedToId: bdUser.id,
      },
      {
        title: 'SaaS Integration - TechStart Inc',
        description: 'Startup needs API integration for their platform',
        clientName: 'TechStart Inc',
        clientEmail: 'hello@techstart.io',
        clientPhone: '+1-555-0101',
        estimatedValue: 25000,
        status: OpportunityStatus.NEGOTIATION,
        createdById: bdUser.id,
        assignedToId: bdUser.id,
      },
      {
        title: 'Support Contract - Global Systems',
        description: 'Annual support contract renewal',
        clientName: 'Global Systems Ltd',
        clientEmail: 'support@globalsystems.com',
        estimatedValue: 15000,
        status: OpportunityStatus.WON,
        createdById: bdUser.id,
        assignedToId: bdUser.id,
      },
      {
        title: 'New Lead - Small Business',
        description: 'Initial inquiry from small business',
        clientName: 'Small Biz Co',
        clientEmail: 'owner@smallbiz.com',
        clientPhone: '+1-555-0102',
        estimatedValue: 5000,
        status: OpportunityStatus.LEAD,
        createdById: bdUser.id,
      },
    ];

    for (const oppData of opportunities) {
      const opportunity = opportunityRepository.create(oppData);
      await opportunityRepository.save(opportunity);
    }
    console.log('Opportunities created successfully');

    const invoices = [
      {
        invoiceNumber: 'INV-2025-001',
        clientName: 'Global Systems Ltd',
        clientEmail: 'billing@globalsystems.com',
        description: 'Q1 2025 Support Services',
        amount: 15000,
        status: InvoiceStatus.PAID,
        createdById: bdUser.id,
        dueDate: new Date('2025-01-31'),
        paidDate: new Date('2025-01-28'),
      },
      {
        invoiceNumber: 'INV-2025-002',
        clientName: 'Acme Corporation',
        clientEmail: 'ap@acmecorp.com',
        description: 'Custom Development - Phase 1',
        amount: 25000,
        status: InvoiceStatus.SENT,
        createdById: bdUser.id,
        dueDate: new Date('2025-10-15'),
      },
      {
        invoiceNumber: 'INV-2025-003',
        clientName: 'TechStart Inc',
        clientEmail: 'finance@techstart.io',
        description: 'API Integration Services',
        amount: 12500,
        status: InvoiceStatus.OVERDUE,
        createdById: bdUser.id,
        dueDate: new Date('2025-09-15'),
      },
    ];

    for (const invData of invoices) {
      const invoice = invoiceRepository.create(invData);
      await invoiceRepository.save(invoice);
    }
    console.log('Invoices created successfully');

    console.log('Seeding completed!');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed();
