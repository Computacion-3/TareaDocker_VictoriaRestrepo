import { useState } from "react";
import EventCard from "../components/cards/EventCard";
import type { EventSummary } from "../types/fitness";

const initialEvents: EventSummary[] = [
  {
    id: 1,
    title: "Clase de Yoga",
    date: "10/06/2026"
  },
  {
    id: 2,
    title: "Torneo de Fútbol",
    date: "15/06/2026"
  }
];

function EventsPage() {

  const [events] = useState<EventSummary[]>(initialEvents);

  return (
    <>
      <h1>Eventos</h1>

      {events.map(event => (
        <EventCard
          key={event.id}
          title={event.title}
          date={event.date}
        />
      ))}
    </>
  );
}

export default EventsPage;
