import { Post } from "../core/domain/entities/Post";
import { GeoCoordinates } from "../core/domain/value-objects/GeoCoordinates";

export const posts: Post[] = [
    Post.create(
        '1',
        'Bar do Agustinho',
        '1',
        'Agustinho',
        'https://randomuser.me/api/portraits/men/1.jpg',
        'agustinho',
        8,
        'https://i.imgur.com/0y0y0y0.jpg',
        '2025-09-13T21:00:00Z',
        GeoCoordinates.create(-23.5505, -46.6333)
    ),
    Post.create(
        '2',
        'Churrascaria do Zé',
        '2',
        'Zé',
        'https://randomuser.me/api/portraits/men/2.jpg',
        'ze_churras',
        5,
        'https://i.imgur.com/1y1y1y1.jpg',
        '2025-09-14T19:30:00Z',
        GeoCoordinates.create(-23.5505, -46.6333)
    ),
    Post.create(
        '3',
        'Pizzaria Bella',
        '3',
        'Bella',
        'https://randomuser.me/api/portraits/women/3.jpg',
        'bella_pizza',
        10,
        'https://i.imgur.com/2y2y2y2.jpg',
        '2025-09-15T20:00:00Z',
        GeoCoordinates.create(-23.5505, -46.6333)
    ),
    Post.create(
        '4',
        'Café Central',
        '4',
        'Central',
        'https://randomuser.me/api/portraits/women/4.jpg',
        'cafe_central',
        7,
        'https://i.imgur.com/3y3y3y3.jpg',
        '2025-09-16T18:00:00Z',
        GeoCoordinates.create(-23.5505, -46.6333)
    ),
    Post.create(
        '5',
        'Restaurante Saboroso',
        '5',
        'Saboroso',
        'https://randomuser.me/api/portraits/men/5.jpg',
        'saboroso',
        12,
        'https://i.imgur.com/4y4y4y4.jpg',
        '2025-09-17T21:30:00Z',
        GeoCoordinates.create(-23.5505, -46.6333)
    ),
]