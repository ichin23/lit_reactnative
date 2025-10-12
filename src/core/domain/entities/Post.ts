import { GeoCoordinates } from "../value-objects/GeoCoordinates";

export class Post{
    private constructor(
        readonly id: string,
        readonly title: string,
        readonly userId: string,
        readonly userName: string,
        readonly partiu: number,
        readonly imgUrl: string,
        readonly datetime: string,
        readonly geolocation: GeoCoordinates,
        readonly createdAt: Date = new Date(),
    ){}

    static create(
        id: string,
        title: string,
        userId: string,
        userName: string,
        partiu: number=0,
        imgUrl: string,
        datetime: string,
        geolocation: GeoCoordinates
    ): Post{
        return new Post(id, title, userId, userName, partiu, imgUrl, datetime, geolocation);
    }
}