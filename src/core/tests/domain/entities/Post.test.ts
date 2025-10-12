import { Post } from "../../../domain/entities/Post"
import { GeoCoordinates } from "../../../domain/value-objects/GeoCoordinates"

describe('Post', () => {
    it('should create a valid Post', () => {
        const geolocation = GeoCoordinates.create(40.7128, -74.0060)

        const post = Post.create(
            '123',
            'Primeiro post',
            'user_1',
            'Pedro',
            42,
            'https://img.com/photo.jpg',
            '2025-09-30T10:00:00Z',
            geolocation
        )

        expect(post.id).toBe('123')
        expect(post.title).toBe('Primeiro post')
        expect(post.userId).toBe('user_1')
        expect(post.userName).toBe('Pedro')
        expect(post.partiu).toBe(42)
        expect(post.imgUrl).toBe('https://img.com/photo.jpg')
        expect(post.datetime).toBe('2025-09-30T10:00:00Z')
        expect(post.geolocation).toEqual(geolocation)
    })
})