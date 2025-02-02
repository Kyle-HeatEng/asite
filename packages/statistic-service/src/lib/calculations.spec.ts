import {
    calculateAverageTicketSold,
    calculateRevenue,
    calculations,
} from './calculations';

describe('calculations', () => {
  const mockEvents = [
    {
      month: '01',
      year: '2024',
      costPerTicket: 50,
      transactions: [{ nTickets: 2 }, { nTickets: 3 }],
    },
    {
      month: '01',
      year: '2024',
      costPerTicket: 50,
      transactions: [{ nTickets: 1 }],
    },
    {
      month: '02',
      year: '2024',
      costPerTicket: 30,
      transactions: [{ nTickets: 4 }],
    },
  ];

  it('should group events by month-year and calculate metrics', () => {
    const result = calculations(mockEvents as any);

    expect(result).toEqual([
      {
        month: '01',
        year: '2024',
        revenue: 300, 
        averageTicketSold: 3, 
        nEvents: 2,
      },
      {
        month: '02',
        year: '2024',
        revenue: 120, 
        averageTicketSold: 4, 
        nEvents: 1,
      },
    ]);
  });
});

describe('calculateRevenue', () => {
  it('should correctly calculate total revenue', () => {
    const events = [
      {
        month: '03',
        year: '2024',
        costPerTicket: 20,
        transactions: [{ nTickets: 5 }, { nTickets: 3 }],
      },
    ];

    const revenue = calculateRevenue(events as any);
    expect(revenue).toBe(160); 
  });

  it('should return 0 for events with no transactions', () => {
    const events = [
      {
        month: '03',
        year: '2024',
        costPerTicket: 20,
        transactions: [],
      },
    ];

    const revenue = calculateRevenue(events as any);
    expect(revenue).toBe(0);
  });
});

describe('calculateAverageTicketSold', () => {
  it('should correctly calculate average tickets sold per event', () => {
    const events = [
      {
        month: '04',
        year: '2024',
        costPerTicket: 40,
        transactions: [{ nTickets: 4 }, { nTickets: 6 }],
      },
      {
        month: '04',
        year: '2024',
        costPerTicket: 40,
        transactions: [{ nTickets: 2 }],
      },
    ];

    const averageTickets = calculateAverageTicketSold(events as any);
    expect(averageTickets).toBe(6); 
  });

  it('should return 0 for events with no transactions', () => {
    const events = [
      {
        month: '05',
        year: '2024',
        costPerTicket: 30,
        transactions: [],
      },
    ];

    const averageTickets = calculateAverageTicketSold(events as any);
    expect(averageTickets).toBe(0);
  });
});
