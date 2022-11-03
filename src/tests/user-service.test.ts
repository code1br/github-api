import Cryptr from 'cryptr';
import { GitHubApi } from '../apis/github-api';
import { UserService } from '../service/user-service';

const githubApiSpy = {
	checkUserCredentialsSpy: jest.fn(),
	followUserSpy: jest.fn(),
	unfollowUserSpy: jest.fn(),
	listRepositoriesSpy: jest.fn(),
	getRepositoryCommitsSpy: jest.fn(),
	getRepositoryPullsSpy: jest.fn(),
	getUsedLanguagesSpy: jest.fn(),
	getUserSpy: jest.fn()
}
const prismaClientSpy = {
	findFirst: jest.fn(),
	create: jest.fn(),
	update: jest.fn()
}
const generateJwtTokenProviderSpy = jest.fn()
const api: GitHubApi = {
	followUser: githubApiSpy.followUserSpy,
	unfollowUser: githubApiSpy.unfollowUserSpy,
	listRepositories: githubApiSpy.listRepositoriesSpy,
	getRepositoryCommits: githubApiSpy.getRepositoryCommitsSpy,
	getRepositoryPulls: githubApiSpy.getRepositoryPullsSpy,
	getUsedLanguages: githubApiSpy.getUsedLanguagesSpy,
	getUser: githubApiSpy.getUserSpy,
	checkUserCredentials: githubApiSpy.checkUserCredentialsSpy
}
const service = new UserService(api)

jest.mock('../middlewares/user-ensureAuthentication', () => ({
	get CURRENT_USER() {
		return {
			login: 'AAAAAAAA',
			PAT: 'asdasfdgasfdgr435t345t326t5234yg54qg5rg45'
		}
	}
}))
jest.mock("../prisma/client", () => {
	return {
		_esModule: true,
		client: {
			user: {
				findFirst: async () => prismaClientSpy.findFirst(),
				create: async () => prismaClientSpy.create(),
				update: async () => prismaClientSpy.update()
			}
		}
	}
})
jest.mock('../provider/generate-jwt-token-provider', () => {
	return {
		GenerateJwtTokenProvider: jest.fn().mockImplementation(() => {
			return { execute: generateJwtTokenProviderSpy };
		}),
	};
});

describe('Follow a user', () => {
	it('should be able to follow a user', () => {
		const loginToFollow = 'BBBBBBB';

		const apiResponse = {
			'status': 204
		};

		githubApiSpy.followUserSpy.mockResolvedValueOnce(apiResponse)

		expect(service.followUser(loginToFollow)).resolves.not.toThrow();

		expect(githubApiSpy.followUserSpy).toHaveBeenCalledWith(loginToFollow)
	})

	it('should not be able to follow a user with empty login to follow', () => {
		const loginToFollow = '';

		expect(service.followUser(loginToFollow)).rejects.toThrow();

		expect(githubApiSpy.followUserSpy).not.toHaveBeenCalled()
	})

	it('should rejects when api reponse status code is not 204', () => {
		const loginToFollow = 'BBBBBBB';

		const apiResponse = {
			'status': 400
		};

		githubApiSpy.followUserSpy.mockResolvedValueOnce(apiResponse)

		expect(service.followUser(loginToFollow)).rejects.toThrow();

		expect(githubApiSpy.followUserSpy).toHaveBeenCalledWith(loginToFollow)
	})
})

describe('Unfollow a user', () => {
	it('should be able to unfollow a user', () => {
		const loginToUnfollow = 'BBBBBBB';

		const apiResponse = {
			'status': 204
		};

		githubApiSpy.unfollowUserSpy.mockResolvedValueOnce(apiResponse)

		expect(service.unfollowUser(loginToUnfollow)).resolves.not.toThrow();

		expect(githubApiSpy.unfollowUserSpy).toHaveBeenCalledWith(loginToUnfollow)
	})

	it('should not be able to unfollow a user with empty login to follow', () => {
		const loginToUnfollow = '';

		expect(service.unfollowUser(loginToUnfollow)).rejects.toThrow();

		expect(githubApiSpy.followUserSpy).not.toHaveBeenCalled()
	})

	it('should rejects when api reponse status code is not 204', () => {
		const loginToFollow = 'BBBBBBB';

		const apiResponse = {
			'status': 400
		};

		githubApiSpy.unfollowUserSpy.mockResolvedValueOnce(apiResponse)

		expect(service.unfollowUser(loginToFollow)).rejects.toThrow();

		expect(githubApiSpy.unfollowUserSpy).toHaveBeenCalledWith(loginToFollow)
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
		];


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
		];

		githubApiSpy.listRepositoriesSpy.mockResolvedValueOnce(apiResponse)

		const result = await service.listRepositories();

		expect(result).toEqual(expectedResult)
		expect(githubApiSpy.listRepositoriesSpy).toHaveBeenCalled()
		expect(githubApiSpy.listRepositoriesSpy).toHaveBeenCalledTimes(1)
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
		];

		const expectedResult = { stars: 9 };

		githubApiSpy.listRepositoriesSpy.mockResolvedValueOnce(apiResponse)

		const result = await service.getNumberOfStars();

		expect(result).toEqual(expectedResult)
		expect(githubApiSpy.listRepositoriesSpy).toHaveBeenCalled()
		expect(githubApiSpy.listRepositoriesSpy).toHaveBeenCalledTimes(1)

	});
});

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
		];

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
		];
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
		];
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
		];

		const expectedResult = {
			commits_in_current_year: 5,
			total_commits: 13
		};

		githubApiSpy.listRepositoriesSpy.mockResolvedValueOnce(listRepositoriesApiResponse)

		githubApiSpy.getRepositoryCommitsSpy.mockResolvedValueOnce(getRepositoryCommitsApiResponse1)
		githubApiSpy.getRepositoryCommitsSpy.mockResolvedValueOnce(getRepositoryCommitsApiResponse2)
		githubApiSpy.getRepositoryCommitsSpy.mockResolvedValueOnce(getRepositoryCommitsApiResponse3)

		const result = await service.getNumberOfCommits();

		expect(result).toEqual(expectedResult)
		expect(githubApiSpy.listRepositoriesSpy).toHaveBeenCalled()
		expect(githubApiSpy.getRepositoryCommitsSpy).toHaveBeenCalledWith(listRepositoriesApiResponse[0].owner.login, listRepositoriesApiResponse[0].name)
		expect(githubApiSpy.getRepositoryCommitsSpy).toHaveBeenCalledWith(listRepositoriesApiResponse[1].owner.login, listRepositoriesApiResponse[1].name)
		expect(githubApiSpy.getRepositoryCommitsSpy).toHaveBeenCalledWith(listRepositoriesApiResponse[2].owner.login, listRepositoriesApiResponse[2].name)
		expect(githubApiSpy.listRepositoriesSpy).toHaveBeenCalledTimes(1)
		expect(githubApiSpy.getRepositoryCommitsSpy).toHaveBeenCalledTimes(3)

	});
});

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
		];

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
		];
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
		];
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
		];

		const expectedResult = {
			pulls_in_current_year: 6,
			total_pulls: 10
		};

		githubApiSpy.listRepositoriesSpy.mockResolvedValueOnce(listRepositoriesApiResponse)

		githubApiSpy.getRepositoryPullsSpy.mockResolvedValueOnce(getRepositoryPullsApiResponse1)
		githubApiSpy.getRepositoryPullsSpy.mockResolvedValueOnce(getRepositoryPullsApiResponse2)
		githubApiSpy.getRepositoryPullsSpy.mockResolvedValueOnce(getRepositoryPullsApiResponse3)

		const result = await service.getNumberOfPulls();

		expect(result).toEqual(expectedResult)
		expect(githubApiSpy.listRepositoriesSpy).toHaveBeenCalled()
		expect(githubApiSpy.getRepositoryPullsSpy).toHaveBeenCalledWith(listRepositoriesApiResponse[0].owner.login, listRepositoriesApiResponse[0].name)
		expect(githubApiSpy.getRepositoryPullsSpy).toHaveBeenCalledWith(listRepositoriesApiResponse[1].owner.login, listRepositoriesApiResponse[1].name)
		expect(githubApiSpy.getRepositoryPullsSpy).toHaveBeenCalledWith(listRepositoriesApiResponse[2].owner.login, listRepositoriesApiResponse[2].name)
		expect(githubApiSpy.listRepositoriesSpy).toHaveBeenCalledTimes(1)
		expect(githubApiSpy.getRepositoryPullsSpy).toHaveBeenCalledTimes(3)

	});
});

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
		];

		const UsedLanguagesApiResponse1 = {
			data: {
				'Java': 6854656,
				'Python': 22326
			},
			status: 200
		};

		const UsedLanguagesApiResponse2 = {
			data: {
				'Ruby': 635,
				'Typescript': 5641654
			},
			status: 200
		};

		const UsedLanguagesApiResponse3 = {
			data: {
				'Java': 3526156,
				'Python': 6584135,
				'Typescript': 8896544
			},
			status: 200
		};

		const expectedResult = {
			'Java': 32.93,
			'Python': 20.96,
			'Typescript': 46.11,
			'Ruby': 0.0
		};

		githubApiSpy.listRepositoriesSpy.mockResolvedValueOnce(listRepositoriesApiResponse)

		githubApiSpy.getUsedLanguagesSpy.mockResolvedValueOnce(UsedLanguagesApiResponse1)
		githubApiSpy.getUsedLanguagesSpy.mockResolvedValueOnce(UsedLanguagesApiResponse2)
		githubApiSpy.getUsedLanguagesSpy.mockResolvedValueOnce(UsedLanguagesApiResponse3)

		const result = await service.getUsedLanguages();

		expect(result).toEqual(expectedResult)
		expect(githubApiSpy.listRepositoriesSpy).toHaveBeenCalled()
		expect(githubApiSpy.getUsedLanguagesSpy).toHaveBeenCalledWith(listRepositoriesApiResponse[0].owner.login, listRepositoriesApiResponse[0].name)
		expect(githubApiSpy.getUsedLanguagesSpy).toHaveBeenCalledWith(listRepositoriesApiResponse[1].owner.login, listRepositoriesApiResponse[1].name)
		expect(githubApiSpy.getUsedLanguagesSpy).toHaveBeenCalledWith(listRepositoriesApiResponse[2].owner.login, listRepositoriesApiResponse[2].name)
		expect(githubApiSpy.listRepositoriesSpy).toHaveBeenCalledTimes(1)
		expect(githubApiSpy.getUsedLanguagesSpy).toHaveBeenCalledTimes(3)

	});
});

describe('Get a user', () => {
	it('should be able to get a user', () => {
		const usernameToGet = 'BBBBBBB';

		const apiResponse = {
			'status': 200
		};

		githubApiSpy.getUserSpy.mockResolvedValueOnce(apiResponse)

		expect(service.getUser(usernameToGet)).resolves.not.toThrow();

		expect(githubApiSpy.getUserSpy).toHaveBeenCalledWith(usernameToGet)
	})

	it('should not be able to get a user with empty login to get', () => {
		const usernameToGet = '';

		expect(service.getUser(usernameToGet)).rejects.toThrow();

		expect(githubApiSpy.getUserSpy).not.toHaveBeenCalled()
	})

	it('should rejects when api reponse status code is not 200', () => {
		const usernameToGet = 'BBBBBBB';

		const apiResponse = {
			'status': 400
		};

		githubApiSpy.getUserSpy.mockResolvedValueOnce(apiResponse)

		expect(service.getUser(usernameToGet)).rejects.toThrow();

		expect(githubApiSpy.getUserSpy).toHaveBeenCalledWith(usernameToGet)
	})
})

describe('Authenticate user', () => {
	it('should be able to authenticate user that already exists on database', async () => {
		const username = 'krakrakra'
		const pat = 'ghp_86f4ad856f6d85f4d4fds56fasdf'
		const cryptr = new Cryptr(process.env.CRYPTR_SECRET || 'default')
		
		const encryptedPat = cryptr.encrypt(pat)

		githubApiSpy.checkUserCredentialsSpy.mockResolvedValueOnce({
			data: {
				login: 'krakrakra'
			}
		})

		prismaClientSpy.findFirst.mockResolvedValueOnce({
			username: 'krakrakra',
			pat: encryptedPat,
			token: ''
		})

		generateJwtTokenProviderSpy.mockReturnValueOnce('123456789')

		await expect(service.authenticateUser(username, pat)).resolves.not.toThrow()
		expect(prismaClientSpy.findFirst).toHaveBeenCalledTimes(1)
		expect(api.checkUserCredentials).toHaveBeenCalledWith(username, pat)
		expect(prismaClientSpy.update).toHaveBeenCalledTimes(1)
		expect(generateJwtTokenProviderSpy).toHaveBeenCalledTimes(1)
	})
	it('should be able to authenticate user that does not exist on database', async () => {
		const username = 'krakrakra'
		const pat = 'ghp_86f4ad856f6d85f4d4fds56fasdf'

		githubApiSpy.checkUserCredentialsSpy.mockResolvedValueOnce({
			data: {
				login: 'krakrakra'
			}
		})

		prismaClientSpy.findFirst.mockResolvedValueOnce(null)

		generateJwtTokenProviderSpy.mockReturnValueOnce('123456789')

		await expect(service.authenticateUser(username, pat)).resolves.not.toThrow()
		expect(prismaClientSpy.findFirst).toHaveBeenCalledTimes(1)
		expect(api.checkUserCredentials).toHaveBeenCalledWith(username, pat)
		expect(prismaClientSpy.create).toHaveBeenCalledTimes(1)
		expect(generateJwtTokenProviderSpy).toHaveBeenCalledTimes(1)
	})
	it('should be able to authenticate user that has a different pat on database', async () => {
		const username = 'krakrakra'
		const pat = 'ghp_86f4ad856f6d85f4d4fds56fasdf'

		const cryptr = new Cryptr(process.env.CRYPTR_SECRET || 'default')
		
		const encryptedPat = cryptr.encrypt('ghp_86f4ad856f6d85f4d4fds5612345')

		githubApiSpy.checkUserCredentialsSpy.mockResolvedValueOnce({
			data: {
				login: 'krakrakra'
			}
		})

		prismaClientSpy.findFirst.mockResolvedValueOnce({
			username: 'krakrakra',
			pat: encryptedPat,
			token: ''
		})

		generateJwtTokenProviderSpy.mockReturnValueOnce('123456789')

		await expect(service.authenticateUser(username, pat)).resolves.not.toThrow()
		expect(prismaClientSpy.findFirst).toHaveBeenCalledTimes(1)
		expect(api.checkUserCredentials).toHaveBeenCalledWith(username, pat)
		expect(prismaClientSpy.update).toHaveBeenCalledTimes(2)
		expect(generateJwtTokenProviderSpy).toHaveBeenCalledTimes(1)
	})
	it('should not be able to authenticate user with unmatched username', async () => {
		const username = 'krakrakra'
		const pat = 'ghp_86f4ad856f6d85f4d4fds56fasdf'

		githubApiSpy.checkUserCredentialsSpy.mockResolvedValueOnce({
			data: {
				login: 'brobro'
			}
		})

		prismaClientSpy.findFirst.mockResolvedValueOnce(null)

		generateJwtTokenProviderSpy.mockReturnValueOnce('123456789')

		await expect(service.authenticateUser(username, pat)).rejects.toThrow()
		expect(api.checkUserCredentials).toHaveBeenCalledWith(username, pat)
		expect(prismaClientSpy.findFirst).not.toHaveBeenCalled()
		expect(prismaClientSpy.create).not.toHaveBeenCalled()
		expect(prismaClientSpy.update).not.toHaveBeenCalled()
		expect(generateJwtTokenProviderSpy).not.toHaveBeenCalled()
	})
	it('should not be able to authenticate user with empty username', async () => {
		const username = ''
		const pat = 'ghp_86f4ad856f6d85f4d4fds56fasdf'

		await expect(service.authenticateUser(username, pat)).rejects.toThrow()
		expect(prismaClientSpy.findFirst).not.toHaveBeenCalled()
		expect(api.checkUserCredentials).not.toHaveBeenCalled()
		expect(prismaClientSpy.create).not.toHaveBeenCalled()
		expect(prismaClientSpy.update).not.toHaveBeenCalled()
		expect(generateJwtTokenProviderSpy).not.toHaveBeenCalled()
	})
	it('should not be able to authenticate user with empty pat', async () => {
		const username = 'krakrakra'
		const pat = ''

		await expect(service.authenticateUser(username, pat)).rejects.toThrow()
		expect(prismaClientSpy.findFirst).not.toHaveBeenCalled()
		expect(api.checkUserCredentials).not.toHaveBeenCalled()
		expect(prismaClientSpy.create).not.toHaveBeenCalled()
		expect(prismaClientSpy.update).not.toHaveBeenCalled()
		expect(generateJwtTokenProviderSpy).not.toHaveBeenCalled()
	})
	it('should not be able to authenticate user with pat that does not begin with ghp_', async () => {
		const username = 'krakrakra'
		const pat = '86f4ad856f6d85f4d4fds56fasdf'

		await expect(service.authenticateUser(username, pat)).rejects.toThrow()
		expect(prismaClientSpy.findFirst).not.toHaveBeenCalled()
		expect(api.checkUserCredentials).not.toHaveBeenCalled()
		expect(prismaClientSpy.create).not.toHaveBeenCalled()
		expect(prismaClientSpy.update).not.toHaveBeenCalled()
		expect(generateJwtTokenProviderSpy).not.toHaveBeenCalled()
	})
})