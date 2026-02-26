export interface Game {
    id: string;
    name: string;
    description: string;
    backgroundImage: string;
    coverImage: string;
    initialPrice: number;
    total: number;
    releaseDate: string;
    developer: string;
    editor: string;
    rating: number | null;
    platforms: string[];
    genres: string[];
    tags: string[];
    screenshots: string[];
}

export interface GameFiltersValue {
    genres: string[];
    platforms: string[];
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
