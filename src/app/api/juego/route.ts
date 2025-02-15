import { v4 as uuidv4 } from 'uuid';

interface Juego {
  id: string;
  title: string;
  dateStart: Date;
  dateEnd: Date;
  numberOfCards: number;
}

let juegos: Juego[] = [];

// Create a new juego
export async function POST(request: Request, response: Response) {
  const { title, dateStart, dateEnd, numberOfCards } = await request.json();
  const newJuego: Juego = {
    id: uuidv4(),
    title,
    dateStart: new Date(dateStart),
    dateEnd: new Date(dateEnd),
    numberOfCards,
  };
  juegos.push(newJuego);
  return response.json(newJuego);
}

// Read all juegos
export async function GET(request: Request, response: Response) {
  response.json(juegos);
}

// Update a juego by ID
export async function PUT(request: Request, response: Response) {
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
    return response.json(juegos[juegoIndex]);
  } else {
    return response.json({ message: 'Juego not found' });
  }
}

// Delete a juego by ID
export async function DELETE(request: Request, response: Response) {
  const { id } = await request.json();
  juegos = juegos.filter((j) => j.id !== id);
  return response.json();
}
