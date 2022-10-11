import { GitHubApi } from "../apis/github-api"
import { UserService } from "../service/user-service"

const followUserSpy = jest.fn()
const unfollowUserSpy = jest.fn()
const listRepositoriesSpy = jest.fn()
const getRepositoryCommitsSpy = jest.fn()
const getRepositoryPullsSpy = jest.fn()
const getUsedLanguagesSpy = jest.fn()
const searchUserSpy = jest.fn()

const api: GitHubApi = {
	followUser: followUserSpy,
	unfollowUser: unfollowUserSpy,
	listRepositories: listRepositoriesSpy,
	getRepositoryCommits: getRepositoryCommitsSpy,
	getRepositoryPulls: getRepositoryPullsSpy,
	getUsedLanguages: getUsedLanguagesSpy,
	searchUser: searchUserSpy
}

const service = new UserService(api)

jest.mock('../middlewares/user-authentication', () => ({
	get CURRENT_USER() {
		return {
			login: 'AAAAAAAA',
			PAT: 'asdasfdgasfdgr435t345t326t5234yg54qg5rg45'
		}
	}
}));

describe('Follow a user', () => {
	it('should be able to follow a user', () => {
		const loginToFollow: string = "BBBBBBB"

		const apiResponse = {
			"status": 204
		}

		followUserSpy.mockResolvedValueOnce(apiResponse)

		expect(service.followUser(loginToFollow)).resolves.not.toThrow()

		expect(followUserSpy).toHaveBeenCalledWith(loginToFollow)
	})

	it('should not be able to follow a user with empty login to follow', () => {
		const loginToFollow: string = ""

		expect(service.followUser(loginToFollow)).rejects.toThrow()

		expect(followUserSpy).not.toHaveBeenCalled()
	})

	it('should rejects when api reponse status code is not 204', () => {
		const loginToFollow: string = "BBBBBBB"

		const apiResponse = {
			"status": 400
		}

		followUserSpy.mockResolvedValueOnce(apiResponse)

		expect(service.followUser(loginToFollow)).rejects.toThrow()

		expect(followUserSpy).toHaveBeenCalledWith(loginToFollow)
	})
})

describe('Unfollow a user', () => {
	it('should be able to unfollow a user', () => {
		const loginToUnfollow: string = "BBBBBBB"

		const apiResponse = {
			"status": 204
		}

		unfollowUserSpy.mockResolvedValueOnce(apiResponse)

		expect(service.unfollowUser(loginToUnfollow)).resolves.not.toThrow()

		expect(unfollowUserSpy).toHaveBeenCalledWith(loginToUnfollow)
	})

	it('should not be able to unfollow a user with empty login to follow', () => {
		const loginToUnfollow: string = ""

		expect(service.unfollowUser(loginToUnfollow)).rejects.toThrow()

		expect(followUserSpy).not.toHaveBeenCalled()
	})

	it('should rejects when api reponse status code is not 204', () => {
		const loginToFollow: string = "BBBBBBB"

		const apiResponse = {
			"status": 400
		}

		unfollowUserSpy.mockResolvedValueOnce(apiResponse)

		expect(service.unfollowUser(loginToFollow)).rejects.toThrow()

		expect(unfollowUserSpy).toHaveBeenCalledWith(loginToFollow)
	})
})

describe('List repositories', () => {
	it('should be able to list repositories', async () => {
		const expectedResult = [
			{
				name: 'repo1',
				owner: 'AAAAAAAA',
				private: false
			}, {
				name: 'repo2',
				owner: 'AAAAAAAA',
				private: false
			}, {
				name: 'repo3',
				owner: 'BBBBBBB',
				private: true
			}
		]


		const apiResponse = [
			{
				name: 'repo1',
				owner: { login: 'AAAAAAAA' },
				private: false
			}, {
				name: 'repo2',
				owner: { login: 'AAAAAAAA' },
				private: false
			}, {
				name: 'repo3',
				owner: { login: 'BBBBBBB' },
				private: true
			}
		]

		listRepositoriesSpy.mockResolvedValueOnce(apiResponse)

		const result = await service.listRepositories()

		expect(result).toEqual(expectedResult)
		expect(listRepositoriesSpy).toHaveBeenCalled()
		expect(listRepositoriesSpy).toHaveBeenCalledTimes(1)
	})
})

describe('Get Stars', () => {
	it('should be able to get the number of starts in all repositories', async () => {
		const apiResponse = [
			{
				name: 'repo1',
				owner: { login: 'AAAAAAAA' },
				private: false,
				stargazers_count: 2
			}, {
				name: 'repo2',
				owner: { login: 'AAAAAAAA' },
				private: false,
				stargazers_count: 3
			}, {
				name: 'repo3',
				owner: { login: 'BBBBBBB' },
				private: true,
				stargazers_count: 4
			}
		]

		const expectedResult = { stars: 9 }

		listRepositoriesSpy.mockResolvedValueOnce(apiResponse)

		const result = await service.getNumberOfStars()

		expect(result).toEqual(expectedResult)
		expect(listRepositoriesSpy).toHaveBeenCalled()
		expect(listRepositoriesSpy).toHaveBeenCalledTimes(1)

	})
})

describe('Get Commits', () => {
	it('should be able to get the user number of commits in all repositories', async () => {
		const listRepositoriesApiResponse = [
			{
				name: 'repo1',
				owner: { login: 'AAAAAAAA' },
				private: false
			}, {
				name: 'repo2',
				owner: { login: 'AAAAAAAA' },
				private: false
			}, {
				name: 'repo3',
				owner: { login: 'BBBBBBB' },
				private: true
			}
		]

		const getRepositoryCommitsApiResponse1 = [
			{
				commit: {
					committer: {
						date: '2022-05-22T18:45:42Z'
					}
				},
				author: {
					login: 'AAAAAAAA'
				}
			}, {
				commit: {
					committer: {
						date: '2022-05-22T18:45:42Z'
					}
				},
				author: {
					login: 'AAAAAAAA'
				}
			}, {
				commit: {
					committer: {
						date: '2022-05-22T18:45:42Z'
					}
				},
				author: {
					login: 'AAAAAAAA'
				}
			}, {
				commit: {
					committer: {
						date: '2021-05-22T18:45:42Z'
					}
				},
				author: {
					login: 'AAAAAAAA'
				}
			}, {
				commit: {
					committer: {
						date: '2021-05-22T18:45:42Z'
					}
				},
				author: {
					login: 'AAAAAAAA'
				}
			}, {
				commit: {
					committer: {
						date: '2022-05-22T18:45:42Z'
					}
				},
				author: {
					login: 'BBB'
				}
			}, {
				commit: {
					committer: {
						date: '2022-05-22T18:45:42Z'
					}
				},
				author: {
					login: 'BB'
				}
			}, {
				commit: {
					committer: {
						date: '2022-05-22T18:45:42Z'
					}
				},
				author: {
					login: 'BB'
				}
			}, {
				commit: {
					committer: {
						date: '2022-05-22T18:45:42Z'
					}
				},
				author: {
					login: 'BB'
				}
			}, {
				commit: {
					committer: {
						date: '2021-05-22T18:45:42Z'
					}
				},
				author: {
					login: 'BB'
				}
			}, {
				commit: {
					committer: {
						date: '2021-05-22T18:45:42Z'
					}
				},
				author: {
					login: 'BB'
				}
			}
		]
		const getRepositoryCommitsApiResponse2 = [
			{
				commit: {
					committer: {
						date: '2022-05-22T18:45:42Z'
					}
				},
				author: {
					login: 'AAAAAAAA'
				}
			}, {
				commit: {
					committer: {
						date: '2022-05-22T18:45:42Z'
					}
				},
				author: {
					login: 'AAAAAAAA'
				}
			}, {
				commit: {
					committer: {
						date: '2021-05-22T18:45:42Z'
					}
				},
				author: {
					login: 'AAAAAAAA'
				}
			}, {
				commit: {
					committer: {
						date: '2021-05-22T18:45:42Z'
					}
				},
				author: {
					login: 'AAAAAAAA'
				}
			}, {
				commit: {
					committer: {
						date: '2022-05-22T18:45:42Z'
					}
				},
				author: {
					login: 'BBB'
				}
			}
		]
		const getRepositoryCommitsApiResponse3 = [
			{
				commit: {
					committer: {
						date: '2021-05-22T18:45:42Z'
					}
				},
				author: {
					login: 'AAAAAAAA'
				}
			}, {
				commit: {
					committer: {
						date: '2021-05-22T18:45:42Z'
					}
				},
				author: {
					login: 'AAAAAAAA'
				}
			}, {
				commit: {
					committer: {
						date: '2021-05-22T18:45:42Z'
					}
				},
				author: {
					login: 'AAAAAAAA'
				}
			}, {
				commit: {
					committer: {
						date: '2021-05-22T18:45:42Z'
					}
				},
				author: {
					login: 'AAAAAAAA'
				}
			}, {
				commit: {
					committer: {
						date: '2022-05-22T18:45:42Z'
					}
				},
				author: {
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

		const result = await service.getNumberOfCommits()

		expect(result).toEqual(expectedResult)
		expect(listRepositoriesSpy).toHaveBeenCalled()
		expect(getRepositoryCommitsSpy).toHaveBeenCalledWith(listRepositoriesApiResponse[0].owner.login, listRepositoriesApiResponse[0].name)
		expect(getRepositoryCommitsSpy).toHaveBeenCalledWith(listRepositoriesApiResponse[1].owner.login, listRepositoriesApiResponse[1].name)
		expect(getRepositoryCommitsSpy).toHaveBeenCalledWith(listRepositoriesApiResponse[2].owner.login, listRepositoriesApiResponse[2].name)
		expect(listRepositoriesSpy).toHaveBeenCalledTimes(1)
		expect(getRepositoryCommitsSpy).toHaveBeenCalledTimes(3)

	})
})

describe('Get Pulls', () => {
	it('should be able to get the user number of pulls in all repositories', async () => {
		const listRepositoriesApiResponse = [
			{
				name: 'repo1',
				owner: { login: 'AAAAAAAA' },
				private: false
			}, {
				name: 'repo2',
				owner: { login: 'AAAAAAAA' },
				private: false
			}, {
				name: 'repo3',
				owner: { login: 'BBBBBBB' },
				private: true
			}
		]

		const getRepositoryPullsApiResponse1 = [
			{
				user: {
					login: 'AAAAAAAA'
				},
				created_at: '2022-05-22T18:45:42Z',
			}, {
				user: {
					login: 'AAAAAAAA'
				},
				created_at: '2022-05-22T18:45:42Z',
			}, {
				user: {
					login: 'AAAAAAAA'
				},
				created_at: '2022-05-22T18:45:42Z',
			}, {
				user: {
					login: 'AAAAAAAA'
				},
				created_at: '2022-05-22T18:45:42Z',
			}, {
				user: {
					login: 'AAAAAAAA'
				},
				created_at: '2021-05-22T18:45:42Z',
			}, {
				user: {
					login: 'AAAAAAAA'
				},
				created_at: '2021-05-22T18:45:42Z',
			}, {
				user: {
					login: 'AAAAAAAA'
				},
				created_at: '2021-05-22T18:45:42Z',
			}, {
				user: {
					login: 'B'
				},
				created_at: '2022-05-22T18:45:42Z',
			}, {
				user: {
					login: 'B'
				},
				created_at: '2022-05-22T18:45:42Z',
			}, {
				user: {
					login: 'B'
				},
				created_at: '2022-05-22T18:45:42Z',
			}, {
				user: {
					login: 'B'
				},
				created_at: '2021-05-22T18:45:42Z',
			}, {
				user: {
					login: 'B'
				},
				created_at: '2021-05-22T18:45:42Z',
			}, {
				user: {
					login: 'B'
				},
				created_at: '2021-05-22T18:45:42Z',
			}
		]
		const getRepositoryPullsApiResponse2 = [
			{
				user: {
					login: 'AAAAAAAA'
				},
				created_at: '2022-05-22T18:45:42Z',
			}, {
				user: {
					login: 'AAAAAAAA'
				},
				created_at: '2022-05-22T18:45:42Z',
			}, {
				user: {
					login: 'AAAAAAAA'
				},
				created_at: '2021-05-22T18:45:42Z',
			}, {
				user: {
					login: 'B'
				},
				created_at: '2022-05-22T18:45:42Z',
			}, {
				user: {
					login: 'B'
				},
				created_at: '2022-05-22T18:45:42Z',
			}, {
				user: {
					login: 'B'
				},
				created_at: '2022-05-22T18:45:42Z',
			}, {
				user: {
					login: 'B'
				},
				created_at: '2021-05-22T18:45:42Z',
			}, {
				user: {
					login: 'B'
				},
				created_at: '2021-05-22T18:45:42Z',
			}, {
				user: {
					login: 'B'
				},
				created_at: '2021-05-22T18:45:42Z',
			}
		]
		const getRepositoryPullsApiResponse3 = [
			{
				user: {
					login: 'B'
				},
				created_at: '2022-05-22T18:45:42Z',
			}, {
				user: {
					login: 'B'
				},
				created_at: '2022-05-22T18:45:42Z',
			}, {
				user: {
					login: 'B'
				},
				created_at: '2022-05-22T18:45:42Z',
			}, {
				user: {
					login: 'B'
				},
				created_at: '2021-05-22T18:45:42Z',
			}, {
				user: {
					login: 'B'
				},
				created_at: '2021-05-22T18:45:42Z',
			}, {
				user: {
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

		const result = await service.getNumberOfPulls()

		expect(result).toEqual(expectedResult)
		expect(listRepositoriesSpy).toHaveBeenCalled()
		expect(getRepositoryPullsSpy).toHaveBeenCalledWith(listRepositoriesApiResponse[0].owner.login, listRepositoriesApiResponse[0].name)
		expect(getRepositoryPullsSpy).toHaveBeenCalledWith(listRepositoriesApiResponse[1].owner.login, listRepositoriesApiResponse[1].name)
		expect(getRepositoryPullsSpy).toHaveBeenCalledWith(listRepositoriesApiResponse[2].owner.login, listRepositoriesApiResponse[2].name)
		expect(listRepositoriesSpy).toHaveBeenCalledTimes(1)
		expect(getRepositoryPullsSpy).toHaveBeenCalledTimes(3)

	})
})

describe('Get Used Languages', () => {
	it('should be able to get used languages', async () => {
		const listRepositoriesApiResponse = [
			{
				name: 'repo1',
				owner: { login: 'AAAAAAAA' },
				private: false
			}, {
				name: 'repo2',
				owner: { login: 'AAAAAAAA' },
				private: false
			}, {
				name: 'repo3',
				owner: { login: 'BBBBBBB' },
				private: true
			}
		]

		const UsedLanguagesApiResponse1 = {
			data: {
				"Java": 6854656,
				"Python": 22326
			},
			status: 200
		}

		const UsedLanguagesApiResponse2 = {
			data: {
				"Ruby": 635,
				"Typescript": 5641654
			},
			status: 200
		}

		const UsedLanguagesApiResponse3 = {
			data: {
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

		const result = await service.getUsedLanguages()

		expect(result).toEqual(expectedResult)
		expect(listRepositoriesSpy).toHaveBeenCalled()
		expect(getUsedLanguagesSpy).toHaveBeenCalledWith(listRepositoriesApiResponse[0].owner.login, listRepositoriesApiResponse[0].name)
		expect(getUsedLanguagesSpy).toHaveBeenCalledWith(listRepositoriesApiResponse[1].owner.login, listRepositoriesApiResponse[1].name)
		expect(getUsedLanguagesSpy).toHaveBeenCalledWith(listRepositoriesApiResponse[2].owner.login, listRepositoriesApiResponse[2].name)
		expect(listRepositoriesSpy).toHaveBeenCalledTimes(1)
		expect(getUsedLanguagesSpy).toHaveBeenCalledTimes(3)

	})
})

describe('Get a user', () => {
	it('should be able to get a user', () => {
		const usernameToGet: string = "BBBBBBB"

		const apiResponse = {
			"status": 200
		}

		searchUserSpy.mockResolvedValueOnce(apiResponse)

		expect(service.searchUser(usernameToGet)).resolves.not.toThrow()

		expect(searchUserSpy).toHaveBeenCalledWith(usernameToGet)
	})

	it('should not be able to get a user with empty login to get', () => {
		const usernameToGet: string = ""

		expect(service.searchUser(usernameToGet)).rejects.toThrow()

		expect(searchUserSpy).not.toHaveBeenCalled()
	})

	it('should rejects when api reponse status code is not 200', () => {
		const usernameToGet: string = "BBBBBBB"

		const apiResponse = {
			"status": 400
		}

		searchUserSpy.mockResolvedValueOnce(apiResponse)

		expect(service.searchUser(usernameToGet)).rejects.toThrow()

		expect(searchUserSpy).toHaveBeenCalledWith(usernameToGet)
	})
})