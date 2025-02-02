import { EventWithTransactions } from 'src/schemas/event.schema';

export const calculations = (events: EventWithTransactions[]) => {
  return Object.values(
    //TODO: Update nestjs to latest version
    //@ts-ignore
    Object.groupBy(events, ({ month, year }) => `${month}-${year}`),
  ).map((events: EventWithTransactions[]) => {
    const { month, year } = events.at(0);
    return {
      month,
      year,
      revenue: round(calculateRevenue(events)),
      averageTicketSold: round(calculateAverageTicketSold(events)),
      nEvents: events.length,
    };
  });
};

export const calculateRevenue = (event: EventWithTransactions[]) => {
  return (
    event.reduce((acc, { transactions }) => {
      return (
        acc + transactions.reduce((acc, { nTickets }) => acc + nTickets, 0)
      );
    }, 0) * event.at(0).costPerTicket
  );
};

export const calculateAverageTicketSold = (event: EventWithTransactions[]) => {
  return (
    event.reduce((acc, { transactions }) => {
      return (
        acc + transactions.reduce((acc, { nTickets }) => acc + nTickets, 0)
      );
    }, 0) / event.length
  );
};

const round = (value: number, precision: number = 2) => {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};
