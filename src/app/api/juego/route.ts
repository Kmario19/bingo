import { v4 as uuidv4 } from 'uuid';

import { Juego } from '@/types/juego';

let juegos: Juego[] = [];

// Create a new juego
export async function POST(request: Request) {
  const { title, dateStart, dateEnd, numberOfCards } = await request.json();
  const newJuego: Juego = {
    id: uuidv4(),
    title,
    dateStart: new Date(dateStart),
    dateEnd: new Date(dateEnd),
    numberOfCards,
  };
  juegos.push(newJuego);
  return Response.json(newJuego);
}

// Read all juegos
export async function GET() {
  Response.json(juegos);
}

// Update a juego by ID
export async function PUT(request: Request) {
  const { id, title, dateStart, dateEnd, numberOfCards } = await request.json();
  const juegoIndex = juegos.findIndex((j) => j.id === id);
  if (juegoIndex !== -1) {
    juegos[juegoIndex] = {
      id,
      title,
      dateStart: new Date(dateStart),
      dateEnd: new Date(dateEnd),
      numberOfCards,
    };
    return Response.json(juegos[juegoIndex]);
  } else {
    return Response.json({ message: 'Juego not found' });
  }
}

// Delete a juego by ID
export async function DELETE(request: Request) {
  const { id } = await request.json();
  juegos = juegos.filter((j) => j.id !== id);
  return Response.json(juegos);
}
