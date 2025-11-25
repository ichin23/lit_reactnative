import { GeoCoordinates } from "../value-objects/GeoCoordinates";

export class Post {
    private constructor(
        readonly id: string,
        readonly title: string,
        readonly userId: string,
        readonly userName: string,
        readonly userProfileImgUrl: string | undefined,
        readonly username: string,
        readonly partiu: number,
        readonly imgUrl: string,
        readonly datetime: string,
        readonly geolocation: GeoCoordinates,
        readonly only_friends: boolean = false,
        readonly createdAt: Date = new Date(),
    ) { }

    static create(
        id: string,
        title: string,
        userId: string,
        userName: string,
        userProfileImgUrl: string | undefined,
        username: string,
        partiu: number = 0,
        imgUrl: string,
        datetime: string,
        geolocation: GeoCoordinates,
        only_friends: boolean = false,
        createdAt?: Date | string
    ): Post {
        const createdAtDate = typeof createdAt === 'string' ? new Date(createdAt) : (createdAt || new Date());
        return new Post(id, title, userId, userName, userProfileImgUrl, username, partiu, imgUrl, datetime, geolocation, only_friends, createdAtDate);
    }
}