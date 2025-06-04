type ActressNationality =
  | "American"
  | "British"
  | "Australian"
  | "Israeli-American"
  | "South African"
  | "French"
  | "Indian"
  | "Israeli"
  | "Spanish"
  | "South Korean"
  | "Chinese"

type Person = {
  readonly id: number,
  readonly name: string,
  birth_year: number,
  death_year?: number,
  biography: string,
  image: string,
}

type Actress = Person & {
  most_famous_movies: [string, string, string],
  awards: string,
  nationality: ActressNationality,
}

function isActress(dati: unknown): dati is Actress {
  return (
    typeof dati === 'object' && dati !== null &&
    "id" in dati && typeof dati.id === 'number' &&
    "name" in dati && typeof dati.name === 'string' &&
    "birth_year" in dati && typeof dati.birth_year === 'number' &&
    (!("death_year" in dati) || typeof dati.death_year === 'number') &&
    "biography" in dati && typeof dati.biography === 'string' &&
    "image" in dati && typeof dati.image === 'string' &&
    "most_famous_movies" in dati &&
    dati.most_famous_movies instanceof Array &&
    dati.most_famous_movies.length === 3 &&
    dati.most_famous_movies.every(m => typeof m === 'string') &&
    "awards" in dati && typeof dati.awards === 'string' &&
    "nationality" in dati && typeof dati.nationality === 'string'
  )
}

const BASE_URL = 'http://localhost:3333';

async function getActress(id: number): Promise<Actress | null> {
  try {
    const response = await fetch(`${BASE_URL}/actresses/${id}`);
    const dati: unknown = await response.json();
    if (!isActress(dati)) {
      throw new Error('formato dei dati non valido');
    }
    return dati;
  } catch (error) {
    if (error instanceof Error) {
      console.log("Errore durante il recupero dell'attrice:", error.message);
    } else {
      console.log("Errore sconosciuto:", error);
    }
    return null;
  }
}

async function getAllActresses(): Promise<Actress[]> {
  try {
    const response = await fetch(`${BASE_URL}/actresses`);
    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`);
    }
    const dati: unknown = await response.json();
    if (!(dati instanceof Array)) {
      throw new Error(`Formato dei dati non valido`);
    }
    const actressesValid = dati.filter(isActress);
    return actressesValid;
  } catch (error) {
    if (error instanceof Error) {
      console.log("Errore durante il recupero delle attrici:", error.message);
    } else {
      console.log("Errore sconosciuto:", error);
    }
    return [];
  }
}

async function getActresses(id: number[]): Promise<(Actress | null)[]> {
  try {
    const promises = id.map(getActress);
    return await Promise.all(promises);
  } catch (error) {
    if (error instanceof Error) {
      console.log("Errore durante il recupero delle attrici:", error.message);
    } else {
      console.log("Errore sconosciuto:", error);
    }
    return [];
  }
}
