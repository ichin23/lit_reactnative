import { User } from "../../../domain/entities/User"
import { Email } from "../../../domain/value-objects/Email"
import { Name } from "../../../domain/value-objects/Name"
import { Password } from "../../../domain/value-objects/Password"
import { Username } from "../../../domain/value-objects/Username"


describe('User', () => {
    it('should create a valid User', () => {
        const user = User.create(
            '1',
            Name.create('John Doe'),
            Username.create('johndoe'),
            Email.create('john.doe@example.com'),
            Password.create('password123')
        )

        expect(user.id).toBe('1')
        expect(user.name.value).toBe('John Doe')
        expect(user.username.value).toBe('johndoe')
        expect(user.email.value).toBe('john.doe@example.com')
        expect(user.password.value).toBe('password123')
    })
})