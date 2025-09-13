export interface IPost{
    id: number;
    datetime: string;
    location: string;
    going: number;
    there: number;
    pic: string;
    username: string;
}

export const posts: IPost[] = [
    { id: 1, datetime: '2025-09-13T21:00:00Z', location: 'Bar do Agustinho', going: 8, there: 17, pic: 'https://i.imgur.com/0y0y0y0.jpg', username: 'Agustinho' },
    { id: 2, datetime: '2025-09-14T19:30:00Z', location: 'Churrascaria do Zé', going: 5, there: 12, pic: 'https://i.imgur.com/1y1y1y1.jpg', username: 'Zé' },
    { id: 3, datetime: '2025-09-15T20:00:00Z', location: 'Pizzaria Bella', going: 10, there: 20, pic: 'https://i.imgur.com/2y2y2y2.jpg', username: 'Bella' },
    { id: 4, datetime: '2025-09-16T18:00:00Z', location: 'Café Central', going: 7, there: 15, pic: 'https://i.imgur.com/3y3y3y3.jpg', username: 'Central' },
    { id: 5, datetime: '2025-09-17T21:30:00Z', location: 'Restaurante Saboroso', going: 12, there: 25, pic: 'https://i.imgur.com/4y4y4y4.jpg', username: 'Saboroso' },
]