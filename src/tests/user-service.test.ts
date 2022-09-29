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

		const apiResponse = {
			"status": 204
		}

		followUserSpy.mockResolvedValueOnce(apiResponse)

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

	it('should rejects when api reponse status code is not 204', () => {
		const currentUser: UserModel = {
			username: "AAAAAAAA",
			PAT: "aaaaaaaaaaa"
		}

		const usernameToFollow: string = "BBBBBBB"

		const apiResponse = {
			"status": 400
		}

		followUserSpy.mockResolvedValueOnce(apiResponse)

		expect(service.followUser(currentUser,usernameToFollow)).rejects.toThrow()

		expect(followUserSpy).toHaveBeenCalledWith(currentUser, usernameToFollow)
	})
})

describe('Unfollow a user', () => {
	it('should be able to unfollow a user', () => {
		const currentUser: UserModel = {
			username: "AAAAAAAA",
			PAT: "aaaaaaaaaaa"
		}

		const usernameToUnfollow: string = "BBBBBBB"

		const apiResponse = {
			"status": 204
		}

		unfollowUserSpy.mockResolvedValueOnce(apiResponse)

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

	it('should rejects when api reponse status code is not 204', () => {
		const currentUser: UserModel = {
			username: "AAAAAAAA",
			PAT: "aaaaaaaaaaa"
		}

		const usernameToFollow: string = "BBBBBBB"

		const apiResponse = {
			"status": 400
		}

		unfollowUserSpy.mockResolvedValueOnce(apiResponse)

		expect(service.unfollowUser(currentUser,usernameToFollow)).rejects.toThrow()

		expect(unfollowUserSpy).toHaveBeenCalledWith(currentUser, usernameToFollow)
	})
})

describe('List repositories', () => {
	afterEach(jest.clearAllMocks)

	it('should be able to list repositories', async () => {
		const currentUser: UserModel = {
			username: "AAAAAAAA",
			PAT: "aaaaaaaaaaa"
		}

		const expectedResult = [
			{
				name: 'repo1',
				private: false
			},{
				name: 'repo2',
				private: false
			},{
				name: 'repo3',
				private: true
			}
		]

		const apiResponse = {
			"status": 200,
			"data": expectedResult
		}

		listRepositoriesSpy.mockResolvedValueOnce(apiResponse)

		const result = await service.listRepositories(currentUser)
		
		expect(result).toEqual(expectedResult)
		expect(listRepositoriesSpy).toHaveBeenCalledWith(currentUser)
		expect(listRepositoriesSpy).toHaveBeenCalledTimes(1)
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

	it('should not be able to list repositories when status code is not 200', async () => {
		const currentUser: UserModel = {
			username: "AAAAAAAA",
			PAT: "aaaaaaaaaaa"
		}

		const apiResponse = {
			"status": 400
		}

		listRepositoriesSpy.mockResolvedValueOnce(apiResponse)

		expect(service.listRepositories(currentUser)).rejects.toThrow()
		expect(listRepositoriesSpy).toHaveBeenCalledWith(currentUser)
		expect(listRepositoriesSpy).toHaveBeenCalledTimes(1)
	})
})