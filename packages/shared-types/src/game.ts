export interface Game {
    backgroundImage: string;
    genres: string[];
    id: string;
    name: string;
    platforms: string[];
    rating: number;
    screenshots: string[];
    tags: string[];
}

export interface GameProduct {
    id: string;
    title: string;
    price: number;
    originalPrice: number;
    discount: number;
    image: string;
    coverImage: string;
    category: string;
    platform: 'Steam' | 'Ubisoft' | 'Origin' | 'Battle.net' | 'Rockstar';
    description: string;
    releaseDate: string;
    developer: string;
    publisher: string;
}
