import { GitHubApi } from "../apis/github-api"
import { UserModel } from "../model/user-model"
import { UserService } from "../service/user-service"

const followUserSpy = jest.fn()
const unfollowUserSpy = jest.fn()
const listRepositoriesSpy = jest.fn()
const getRepositoryCommitsSpy = jest.fn()
const getRepositoryPullsSpy = jest.fn()
const getUsedLanguagesSpy = jest.fn()

const api: GitHubApi = {
	followUser: followUserSpy,
	unfollowUser: unfollowUserSpy,
	listRepositories: listRepositoriesSpy,
	getRepositoryCommits: getRepositoryCommitsSpy, 
	getRepositoryPulls: getRepositoryPullsSpy, 
	getUsedLanguages: getUsedLanguagesSpy
}

const service = new UserService(api)

describe('Follow a user', () => {
	it('should be able to follow a user', () => {
		const currentUser: UserModel = {
			login: "AAAAAAAA",
			PAT: "aaaaaaaaaaa"
		}

		const loginToFollow: string = "BBBBBBB"

		const apiResponse = {
			"status": 204
		}

		followUserSpy.mockResolvedValueOnce(apiResponse)

		expect(service.followUser(currentUser,loginToFollow)).resolves.not.toThrow()

		expect(followUserSpy).toHaveBeenCalledWith(currentUser, loginToFollow)
	})

	it('should not be able to follow a user with currentUser that contains empty login', () => {
		const currentUser: UserModel = {
			login: "",
			PAT: "aaaaaaaaaaa"
		}

		const loginToFollow: string = "BBBBBBB"

		expect(service.followUser(currentUser,loginToFollow)).rejects.toThrow()

		expect(followUserSpy).not.toHaveBeenCalled()
	})

	it('should not be able to follow a user with currentUser with empty PAT', () => {
		const currentUser: UserModel = {
			login: "AAAAAAAA",
			PAT: ""
		}

		const loginToFollow: string = "BBBBBBB"

		expect(service.followUser(currentUser,loginToFollow)).rejects.toThrow()

		expect(followUserSpy).not.toHaveBeenCalled()
	})

	it('should not be able to follow a user with empty login to follow', () => {
		const currentUser: UserModel = {
			login: "AAAAAAAA",
			PAT: "aaaaaaaaaaa"
		}

		const loginToFollow: string = ""

		expect(service.followUser(currentUser,loginToFollow)).rejects.toThrow()

		expect(followUserSpy).not.toHaveBeenCalled()
	})

	it('should rejects when api reponse status code is not 204', () => {
		const currentUser: UserModel = {
			login: "AAAAAAAA",
			PAT: "aaaaaaaaaaa"
		}

		const loginToFollow: string = "BBBBBBB"

		const apiResponse = {
			"status": 400
		}

		followUserSpy.mockResolvedValueOnce(apiResponse)

		expect(service.followUser(currentUser,loginToFollow)).rejects.toThrow()

		expect(followUserSpy).toHaveBeenCalledWith(currentUser, loginToFollow)
	})
})

describe('Unfollow a user', () => {
	it('should be able to unfollow a user', () => {
		const currentUser: UserModel = {
			login: "AAAAAAAA",
			PAT: "aaaaaaaaaaa"
		}

		const loginToUnfollow: string = "BBBBBBB"

		const apiResponse = {
			"status": 204
		}

		unfollowUserSpy.mockResolvedValueOnce(apiResponse)

		expect(service.unfollowUser(currentUser,loginToUnfollow)).resolves.not.toThrow()

		expect(unfollowUserSpy).toHaveBeenCalledWith(currentUser, loginToUnfollow)
	})

	it('should not be able to unfollow a user with currentUser that contains empty login', () => {
		const currentUser: UserModel = {
			login: "",
			PAT: "aaaaaaaaaaa"
		}

		const loginToUnfollow: string = "BBBBBBB"

		expect(service.unfollowUser(currentUser,loginToUnfollow)).rejects.toThrow()

		expect(followUserSpy).not.toHaveBeenCalled()
	})

	it('should not be able to unfollow a user with currentUser with empty PAT', () => {
		const currentUser: UserModel = {
			login: "AAAAAAAA",
			PAT: ""
		}

		const loginToUnfollow: string = "BBBBBBB"

		expect(service.unfollowUser(currentUser,loginToUnfollow)).rejects.toThrow()

		expect(followUserSpy).not.toHaveBeenCalled()
	})
	
	it('should not be able to unfollow a user with empty login to follow', () => {
		const currentUser: UserModel = {
			login: "AAAAAAAA",
			PAT: "aaaaaaaaaaa"
		}

		const loginToUnfollow: string = ""

		expect(service.unfollowUser(currentUser,loginToUnfollow)).rejects.toThrow()

		expect(followUserSpy).not.toHaveBeenCalled()
	})

	it('should rejects when api reponse status code is not 204', () => {
		const currentUser: UserModel = {
			login: "AAAAAAAA",
			PAT: "aaaaaaaaaaa"
		}

		const loginToFollow: string = "BBBBBBB"

		const apiResponse = {
			"status": 400
		}

		unfollowUserSpy.mockResolvedValueOnce(apiResponse)

		expect(service.unfollowUser(currentUser,loginToFollow)).rejects.toThrow()

		expect(unfollowUserSpy).toHaveBeenCalledWith(currentUser, loginToFollow)
	})
})

describe('List repositories', () => {
	it('should be able to list repositories', async () => {
		const currentUser: UserModel = {
			login: "AAAAAAAA",
			PAT: "aaaaaaaaaaa"
		}

		const expectedResult = [
			{
				name: 'repo1',
				owner: 'AAAAAAAA',
				private: false
			},{
				name: 'repo2',
				owner: 'AAAAAAAA',
				private: false
			},{
				name: 'repo3',
				owner: 'BBBBBBB',
				private: true
			}
		]


		const apiResponse = [
			{
				name: 'repo1',
				owner: {login: 'AAAAAAAA'},
				private: false
			},{
				name: 'repo2',
				owner: {login: 'AAAAAAAA'},
				private: false
			},{
				name: 'repo3',
				owner: {login: 'BBBBBBB'},
				private: true
			}
		]

		listRepositoriesSpy.mockResolvedValueOnce(apiResponse)

		const result = await service.listRepositories(currentUser)
		
		expect(result).toEqual(expectedResult)
		expect(listRepositoriesSpy).toHaveBeenCalledWith(currentUser)
		expect(listRepositoriesSpy).toHaveBeenCalledTimes(1)
	})

	it('should not be able to list repositories with currentUser that contains empty login', () => {
		const currentUser: UserModel = {
			login: "",
			PAT: "aaaaaaaaaaa"
		}

		expect(service.listRepositories(currentUser)).rejects.toThrow()

		expect(listRepositoriesSpy).not.toHaveBeenCalled()
	})

	it('should not be able to list repositories with currentUser that contains empty PAT', () => {
		const currentUser: UserModel = {
			login: "AAAAAAAA",
			PAT: ""
		}

		expect(service.listRepositories(currentUser)).rejects.toThrow()

		expect(listRepositoriesSpy).not.toHaveBeenCalled()
	})
})

describe('Get Stars', () => {
	it('should be able to get the number of starts in all repositories', async () => {
		const currentUser: UserModel = {
			login: "AAAAAAAA",
			PAT: "aaaaaaaaaaa"
		}

		const apiResponse = [
			{
				name: 'repo1',
				owner: {login: 'AAAAAAAA'},
				private: false,
				stargazers_count: 2
			},{
				name: 'repo2',
				owner: {login: 'AAAAAAAA'},
				private: false,
				stargazers_count: 3
			},{
				name: 'repo3',
				owner: {login: 'BBBBBBB'},
				private: true,
				stargazers_count: 4
			}
		]

		const expectedResult = {stars: 9}

		listRepositoriesSpy.mockResolvedValueOnce(apiResponse)

		const result = await service.getNumberOfStars(currentUser)
		
		expect(result).toEqual(expectedResult)
		expect(listRepositoriesSpy).toHaveBeenCalledWith(currentUser)
		expect(listRepositoriesSpy).toHaveBeenCalledTimes(1)

	})
	it('should not be able to get the number of starts in all repositories with currentUser that contains empty login', () => {
		const currentUser: UserModel = {
			login: "",
			PAT: "aaaaaaaaaaa"
		}

		expect(service.getNumberOfStars(currentUser)).rejects.toThrow()

		expect(listRepositoriesSpy).not.toHaveBeenCalled()
	})
	it('should not be able to get the number of starts in all repositories with currentUser that contains empty PAT', () => {
		const currentUser: UserModel = {
			login: "AAAAAAAA",
			PAT: ""
		}

		expect(service.getNumberOfStars(currentUser)).rejects.toThrow()

		expect(listRepositoriesSpy).not.toHaveBeenCalled()
	})
})

describe('Get Commits', () => {
	it('should be able to get the user number of commits in all repositories', async () => {
		const currentUser: UserModel = {
			login: "AAAAAAAA",
			PAT: "aaaaaaaaaaa"
		}

		const listRepositoriesApiResponse = [
			{
				name: 'repo1',
				owner: {login: 'AAAAAAAA'},
				private: false
			},{
				name: 'repo2',
				owner: {login: 'AAAAAAAA'},
				private: false
			},{
				name: 'repo3',
				owner: {login: 'BBBBBBB'},
				private: true
			}
		]

		const getRepositoryCommitsApiResponse1 = [
			{
				commit:{
					committer:{
						date: '2022-05-22T18:45:42Z'
					}
				},
				author:{
					login: 'AAAAAAAA'
				}
			},{
				commit:{
					committer:{
						date: '2022-05-22T18:45:42Z'
					}
				},
				author:{
					login: 'AAAAAAAA'
				}
			},{
				commit:{
					committer:{
						date: '2022-05-22T18:45:42Z'
					}
				},
				author:{
					login: 'AAAAAAAA'
				}
			},{
				commit:{
					committer:{
						date: '2021-05-22T18:45:42Z'
					}
				},
				author:{
					login: 'AAAAAAAA'
				}
			},{
				commit:{
					committer:{
						date: '2021-05-22T18:45:42Z'
					}
				},
				author:{
					login: 'AAAAAAAA'
				}
			},{
				commit:{
					committer:{
						date: '2022-05-22T18:45:42Z'
					}
				},
				author:{
					login: 'BBB'
				}
			},{
				commit:{
					committer:{
						date: '2022-05-22T18:45:42Z'
					}
				},
				author:{
					login: 'BB'
				}
			},{
				commit:{
					committer:{
						date: '2022-05-22T18:45:42Z'
					}
				},
				author:{
					login: 'BB'
				}
			},{
				commit:{
					committer:{
						date: '2022-05-22T18:45:42Z'
					}
				},
				author:{
					login: 'BB'
				}
			},{
				commit:{
					committer:{
						date: '2021-05-22T18:45:42Z'
					}
				},
				author:{
					login: 'BB'
				}
			},{
				commit:{
					committer:{
						date: '2021-05-22T18:45:42Z'
					}
				},
				author:{
					login: 'BB'
				}
			}
		]
		const getRepositoryCommitsApiResponse2 = [
			{
				commit:{
					committer:{
						date: '2022-05-22T18:45:42Z'
					}
				},
				author:{
					login: 'AAAAAAAA'
				}
			},{
				commit:{
					committer:{
						date: '2022-05-22T18:45:42Z'
					}
				},
				author:{
					login: 'AAAAAAAA'
				}
			},{
				commit:{
					committer:{
						date: '2021-05-22T18:45:42Z'
					}
				},
				author:{
					login: 'AAAAAAAA'
				}
			},{
				commit:{
					committer:{
						date: '2021-05-22T18:45:42Z'
					}
				},
				author:{
					login: 'AAAAAAAA'
				}
			},{
				commit:{
					committer:{
						date: '2022-05-22T18:45:42Z'
					}
				},
				author:{
					login: 'BBB'
				}
			}
		]
		const getRepositoryCommitsApiResponse3 = [
			{
				commit:{
					committer:{
						date: '2021-05-22T18:45:42Z'
					}
				},
				author:{
					login: 'AAAAAAAA'
				}
			},{
				commit:{
					committer:{
						date: '2021-05-22T18:45:42Z'
					}
				},
				author:{
					login: 'AAAAAAAA'
				}
			},{
				commit:{
					committer:{
						date: '2021-05-22T18:45:42Z'
					}
				},
				author:{
					login: 'AAAAAAAA'
				}
			},{
				commit:{
					committer:{
						date: '2021-05-22T18:45:42Z'
					}
				},
				author:{
					login: 'AAAAAAAA'
				}
			},{
				commit:{
					committer:{
						date: '2022-05-22T18:45:42Z'
					}
				},
				author:{
					login: 'BBB'
				}
			}
		]

		const expectedResult = {
			commits_in_current_year: 5,
			total_commits: 13
		}
		
		listRepositoriesSpy.mockResolvedValueOnce(listRepositoriesApiResponse)

		getRepositoryCommitsSpy.mockResolvedValueOnce(getRepositoryCommitsApiResponse1)
		getRepositoryCommitsSpy.mockResolvedValueOnce(getRepositoryCommitsApiResponse2)
		getRepositoryCommitsSpy.mockResolvedValueOnce(getRepositoryCommitsApiResponse3)

		const result = await service.getNumberOfCommits(currentUser)

		expect(result).toEqual(expectedResult)
		expect(listRepositoriesSpy).toHaveBeenCalledWith(currentUser)
		expect(getRepositoryCommitsSpy).toHaveBeenCalledWith(currentUser, listRepositoriesApiResponse[0].owner.login, listRepositoriesApiResponse[0].name)
		expect(getRepositoryCommitsSpy).toHaveBeenCalledWith(currentUser, listRepositoriesApiResponse[1].owner.login, listRepositoriesApiResponse[1].name)
		expect(getRepositoryCommitsSpy).toHaveBeenCalledWith(currentUser, listRepositoriesApiResponse[2].owner.login, listRepositoriesApiResponse[2].name)
		expect(listRepositoriesSpy).toHaveBeenCalledTimes(1)
		expect(getRepositoryCommitsSpy).toHaveBeenCalledTimes(3)

	})

	it('should not be able to get the user number of commits in all repositories with currentUser that contains empty login', () => {
		const currentUser: UserModel = {
			login: "",
			PAT: "aaaaaaaaaaa"
		}

		expect(service.getNumberOfCommits(currentUser)).rejects.toThrow()

		expect(listRepositoriesSpy).not.toHaveBeenCalled()
		expect(getRepositoryCommitsSpy).not.toHaveBeenCalled()
	})

	it('should not be able to get the user number of commits in all repositories with currentUser that contains empty PAT', () => {
		const currentUser: UserModel = {
			login: "AAAAAAAA",
			PAT: ""
		}

		expect(service.getNumberOfCommits(currentUser)).rejects.toThrow()

		expect(listRepositoriesSpy).not.toHaveBeenCalled()
		expect(getRepositoryCommitsSpy).not.toHaveBeenCalled()
	})
})

describe('Get Pulls', () => {
	it('should be able to get the user number of pulls in all repositories', async () => {
		const currentUser: UserModel = {
			login: "AAAAAAAA",
			PAT: "aaaaaaaaaaa"
		}

		const listRepositoriesApiResponse = [
			{
				name: 'repo1',
				owner: {login: 'AAAAAAAA'},
				private: false
			},{
				name: 'repo2',
				owner: {login: 'AAAAAAAA'},
				private: false
			},{
				name: 'repo3',
				owner: {login: 'BBBBBBB'},
				private: true
			}
		]

		const getRepositoryPullsApiResponse1 = [
			{
				user:{
					login: 'AAAAAAAA'
				},
				created_at: '2022-05-22T18:45:42Z',
			},{
				user:{
					login: 'AAAAAAAA'
				},
				created_at: '2022-05-22T18:45:42Z',
			},{
				user:{
					login: 'AAAAAAAA'
				},
				created_at: '2022-05-22T18:45:42Z',
			},{
				user:{
					login: 'AAAAAAAA'
				},
				created_at: '2022-05-22T18:45:42Z',
			},{
				user:{
					login: 'AAAAAAAA'
				},
				created_at: '2021-05-22T18:45:42Z',
			},{
				user:{
					login: 'AAAAAAAA'
				},
				created_at: '2021-05-22T18:45:42Z',
			},{
				user:{
					login: 'AAAAAAAA'
				},
				created_at: '2021-05-22T18:45:42Z',
			},{
				user:{
					login: 'B'
				},
				created_at: '2022-05-22T18:45:42Z',
			},{
				user:{
					login: 'B'
				},
				created_at: '2022-05-22T18:45:42Z',
			},{
				user:{
					login: 'B'
				},
				created_at: '2022-05-22T18:45:42Z',
			},{
				user:{
					login: 'B'
				},
				created_at: '2021-05-22T18:45:42Z',
			},{
				user:{
					login: 'B'
				},
				created_at: '2021-05-22T18:45:42Z',
			},{
				user:{
					login: 'B'
				},
				created_at: '2021-05-22T18:45:42Z',
			}
		]
		const getRepositoryPullsApiResponse2 = [
			{
				user:{
					login: 'AAAAAAAA'
				},
				created_at: '2022-05-22T18:45:42Z',
			},{
				user:{
					login: 'AAAAAAAA'
				},
				created_at: '2022-05-22T18:45:42Z',
			},{
				user:{
					login: 'AAAAAAAA'
				},
				created_at: '2021-05-22T18:45:42Z',
			},{
				user:{
					login: 'B'
				},
				created_at: '2022-05-22T18:45:42Z',
			},{
				user:{
					login: 'B'
				},
				created_at: '2022-05-22T18:45:42Z',
			},{
				user:{
					login: 'B'
				},
				created_at: '2022-05-22T18:45:42Z',
			},{
				user:{
					login: 'B'
				},
				created_at: '2021-05-22T18:45:42Z',
			},{
				user:{
					login: 'B'
				},
				created_at: '2021-05-22T18:45:42Z',
			},{
				user:{
					login: 'B'
				},
				created_at: '2021-05-22T18:45:42Z',
			}
		]
		const getRepositoryPullsApiResponse3 = [
			{
				user:{
					login: 'B'
				},
				created_at: '2022-05-22T18:45:42Z',
			},{
				user:{
					login: 'B'
				},
				created_at: '2022-05-22T18:45:42Z',
			},{
				user:{
					login: 'B'
				},
				created_at: '2022-05-22T18:45:42Z',
			},{
				user:{
					login: 'B'
				},
				created_at: '2021-05-22T18:45:42Z',
			},{
				user:{
					login: 'B'
				},
				created_at: '2021-05-22T18:45:42Z',
			},{
				user:{
					login: 'B'
				},
				created_at: '2021-05-22T18:45:42Z',
			}
		]
		
		const expectedResult = {
			pulls_in_current_year: 6,
			total_pulls: 10
		}
		
		listRepositoriesSpy.mockResolvedValueOnce(listRepositoriesApiResponse)

		getRepositoryPullsSpy.mockResolvedValueOnce(getRepositoryPullsApiResponse1)
		getRepositoryPullsSpy.mockResolvedValueOnce(getRepositoryPullsApiResponse2)
		getRepositoryPullsSpy.mockResolvedValueOnce(getRepositoryPullsApiResponse3)

		const result = await service.getNumberOfPulls(currentUser)

		expect(result).toEqual(expectedResult)
		expect(listRepositoriesSpy).toHaveBeenCalledWith(currentUser)
		expect(getRepositoryPullsSpy).toHaveBeenCalledWith(currentUser, listRepositoriesApiResponse[0].owner.login, listRepositoriesApiResponse[0].name)
		expect(getRepositoryPullsSpy).toHaveBeenCalledWith(currentUser, listRepositoriesApiResponse[1].owner.login, listRepositoriesApiResponse[1].name)
		expect(getRepositoryPullsSpy).toHaveBeenCalledWith(currentUser, listRepositoriesApiResponse[2].owner.login, listRepositoriesApiResponse[2].name)
		expect(listRepositoriesSpy).toHaveBeenCalledTimes(1)
		expect(getRepositoryPullsSpy).toHaveBeenCalledTimes(3)

	})

	it('should not be able to get the user number of pulls in all repositories with currentUser that contains empty login', () => {
		const currentUser: UserModel = {
			login: "",
			PAT: "aaaaaaaaaaa"
		}

		expect(service.getNumberOfPulls(currentUser)).rejects.toThrow()

		expect(listRepositoriesSpy).not.toHaveBeenCalled()
		expect(getRepositoryPullsSpy).not.toHaveBeenCalled()
	})

	it('should not be able to get the user number of pulls in all repositories with currentUser that contains empty PAT', () => {
		const currentUser: UserModel = {
			login: "AAAAAAAA",
			PAT: ""
		}

		expect(service.getNumberOfPulls(currentUser)).rejects.toThrow()

		expect(listRepositoriesSpy).not.toHaveBeenCalled()
		expect(getRepositoryPullsSpy).not.toHaveBeenCalled()
	})
})

describe('Get Used Languages', () => {
	it('should be able to get used languages', async () => {
		const currentUser: UserModel = {
			login: "AAAAAAAA",
			PAT: "aaaaaaaaaaa"
		}

		const listRepositoriesApiResponse = [
			{
				name: 'repo1',
				owner: {login: 'AAAAAAAA'},
				private: false
			},{
				name: 'repo2',
				owner: {login: 'AAAAAAAA'},
				private: false
			},{
				name: 'repo3',
				owner: {login: 'BBBBBBB'},
				private: true
			}
		]

		const UsedLanguagesApiResponse1 = {
			data:{
				"Java": 6854656,
				"Python": 22326
			},
			status: 200
		}

		const UsedLanguagesApiResponse2 = {
			data:{
				"Ruby": 635,
				"Typescript": 5641654
			},
			status: 200
		}

		const UsedLanguagesApiResponse3 = {
			data:{
				"Java": 3526156,
				"Python": 6584135,
				"Typescript": 8896544
			},
			status: 200
		}

		const expectedResult = {
			"Java": 32.93,
			"Python": 20.96,
			"Typescript": 46.11,
			"Ruby": 0.0
		}

		listRepositoriesSpy.mockResolvedValueOnce(listRepositoriesApiResponse)

		getUsedLanguagesSpy.mockResolvedValueOnce(UsedLanguagesApiResponse1)
		getUsedLanguagesSpy.mockResolvedValueOnce(UsedLanguagesApiResponse2)
		getUsedLanguagesSpy.mockResolvedValueOnce(UsedLanguagesApiResponse3)

		const result = await service.getUsedLanguages(currentUser)

		expect(result).toEqual(expectedResult)
		expect(listRepositoriesSpy).toHaveBeenCalledWith(currentUser)
		expect(getUsedLanguagesSpy).toHaveBeenCalledWith(currentUser, listRepositoriesApiResponse[0].owner.login, listRepositoriesApiResponse[0].name)
		expect(getUsedLanguagesSpy).toHaveBeenCalledWith(currentUser, listRepositoriesApiResponse[1].owner.login, listRepositoriesApiResponse[1].name)
		expect(getUsedLanguagesSpy).toHaveBeenCalledWith(currentUser, listRepositoriesApiResponse[2].owner.login, listRepositoriesApiResponse[2].name)
		expect(listRepositoriesSpy).toHaveBeenCalledTimes(1)
		expect(getUsedLanguagesSpy).toHaveBeenCalledTimes(3)

	})

	it('should not be able to get used languages with currentUser that contains empty login', () => {
		const currentUser: UserModel = {
			login: "",
			PAT: "aaaaaaaaaaa"
		}

		expect(service.getUsedLanguages(currentUser)).rejects.toThrow()

		expect(listRepositoriesSpy).not.toHaveBeenCalled()
	})

	it('should not be able to get used languages with currentUser that contains empty PAT', () => {
		const currentUser: UserModel = {
			login: "AAAAAAAA",
			PAT: ""
		}

		expect(service.getUsedLanguages(currentUser)).rejects.toThrow()

		expect(listRepositoriesSpy).not.toHaveBeenCalled()
	})
})