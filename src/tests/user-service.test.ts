import { GitHubApi } from "../apis/github-api"
import { UserModel } from "../model/user-model"
import { UserService } from "../service/user-service"

const followUserSpy = jest.fn()
const unfollowUserSpy = jest.fn()
const listRepositoriesSpy = jest.fn()

const api: GitHubApi = {
	followUser: followUserSpy,
	unfollowUser: unfollowUserSpy,
	listRepositories: listRepositoriesSpy
}

const service = new UserService(api)

describe('Follow a user', () => {
	it('should be able to follow a user', () => {
		const currentUser: UserModel = {
			username: "AAAAAAAA",
			PAT: "aaaaaaaaaaa"
		}

		const usernameToFollow: string = "BBBBBBB"

		expect(service.followUser(currentUser,usernameToFollow)).resolves.not.toThrow()

		expect(followUserSpy).toHaveBeenCalledWith(currentUser, usernameToFollow)
	})

	it('should not be able to follow a user with currentUser that contains empty username', () => {
		const currentUser: UserModel = {
			username: "",
			PAT: "aaaaaaaaaaa"
		}

		const usernameToFollow: string = "BBBBBBB"

		expect(service.followUser(currentUser,usernameToFollow)).rejects.toThrow()

		expect(followUserSpy).not.toHaveBeenCalled()
	})

	it('should not be able to follow a user with currentUser with empty PAT', () => {
		const currentUser: UserModel = {
			username: "AAAAAAAA",
			PAT: ""
		}

		const usernameToFollow: string = "BBBBBBB"

		expect(service.followUser(currentUser,usernameToFollow)).rejects.toThrow()

		expect(followUserSpy).not.toHaveBeenCalled()
	})

	it('should not be able to follow a user with empty username to follow', () => {
		const currentUser: UserModel = {
			username: "AAAAAAAA",
			PAT: "aaaaaaaaaaa"
		}

		const usernameToFollow: string = ""

		expect(service.followUser(currentUser,usernameToFollow)).rejects.toThrow()

		expect(followUserSpy).not.toHaveBeenCalled()
	})
})

describe('Unfollow a user', () => {
	it('should be able to unfollow a user', () => {
		const currentUser: UserModel = {
			username: "AAAAAAAA",
			PAT: "aaaaaaaaaaa"
		}

		const usernameToUnfollow: string = "BBBBBBB"

		expect(service.unfollowUser(currentUser,usernameToUnfollow)).resolves.not.toThrow()

		expect(unfollowUserSpy).toHaveBeenCalledWith(currentUser, usernameToUnfollow)
	})

	it('should not be able to unfollow a user with currentUser that contains empty username', () => {
		const currentUser: UserModel = {
			username: "",
			PAT: "aaaaaaaaaaa"
		}

		const usernameToUnfollow: string = "BBBBBBB"

		expect(service.unfollowUser(currentUser,usernameToUnfollow)).rejects.toThrow()

		expect(followUserSpy).not.toHaveBeenCalled()
	})

	it('should not be able to unfollow a user with currentUser with empty PAT', () => {
		const currentUser: UserModel = {
			username: "AAAAAAAA",
			PAT: ""
		}

		const usernameToUnfollow: string = "BBBBBBB"

		expect(service.unfollowUser(currentUser,usernameToUnfollow)).rejects.toThrow()

		expect(followUserSpy).not.toHaveBeenCalled()
	})
	
	it('should not be able to unfollow a user with empty username to follow', () => {
		const currentUser: UserModel = {
			username: "AAAAAAAA",
			PAT: "aaaaaaaaaaa"
		}

		const usernameToUnfollow: string = ""

		expect(service.unfollowUser(currentUser,usernameToUnfollow)).rejects.toThrow()

		expect(followUserSpy).not.toHaveBeenCalled()
	})
})

describe('List repositories', () => {
	it('should be able to list repositories', () => {
		const currentUser: UserModel = {
			username: "AAAAAAAA",
			PAT: "aaaaaaaaaaa"
		}

		expect(service.listRepositories(currentUser)).resolves.not.toThrow()

		expect(listRepositoriesSpy).toHaveBeenCalledWith(currentUser)
	})

	it('should not be able to list repositories with currentUser that contains empty username', () => {
		const currentUser: UserModel = {
			username: "",
			PAT: "aaaaaaaaaaa"
		}

		expect(service.listRepositories(currentUser)).rejects.toThrow()

		expect(listRepositoriesSpy).not.toHaveBeenCalled()
	})

	it('should not be able to list repositories with currentUser that contains empty PAT', () => {
		const currentUser: UserModel = {
			username: "AAAAAAAA",
			PAT: ""
		}

		expect(service.listRepositories(currentUser)).rejects.toThrow()

		expect(listRepositoriesSpy).not.toHaveBeenCalled()
	})
})