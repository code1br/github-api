import Cryptr from 'cryptr';
import { GitHubApi } from '../apis/github-api';
import { CURRENT_USER } from '../middlewares/user-ensureAuthentication';
import { UserService } from '../service/user-service';

const githubApiSpy = {
	checkUserCredentialsSpy: jest.fn(),
	followUserSpy: jest.fn(),
	unfollowUserSpy: jest.fn(),
	listRepositoriesSpy: jest.fn(),
	getRepositoryCommitsSpy: jest.fn(),
	getRepositoryPullsSpy: jest.fn(),
	getUsedLanguagesSpy: jest.fn(),
	getUserSpy: jest.fn(),
	searchUsersSpy: jest.fn(),
	getNumberOfCommitsSinceBeginingSpy: jest.fn(),
	getNumberOfCommitsSinceDateSpy: jest.fn()
};
const prismaClientSpy = {
	findFirst: jest.fn(),
	create: jest.fn(),
	update: jest.fn()
};
const generateJwtTokenProviderSpy = jest.fn();
const api: GitHubApi = {
	followUser: githubApiSpy.followUserSpy,
	unfollowUser: githubApiSpy.unfollowUserSpy,
	listRepositories: githubApiSpy.listRepositoriesSpy,
	getRepositoryCommits: githubApiSpy.getRepositoryCommitsSpy,
	getRepositoryPulls: githubApiSpy.getRepositoryPullsSpy,
	getUsedLanguages: githubApiSpy.getUsedLanguagesSpy,
	getUser: githubApiSpy.getUserSpy,
	checkUserCredentials: githubApiSpy.checkUserCredentialsSpy,
	searchUsers: githubApiSpy.searchUsersSpy,
	getNumberOfCommitsSinceBegining: githubApiSpy.getNumberOfCommitsSinceBeginingSpy,
	getNumberOfCommitsSinceDate: githubApiSpy.getNumberOfCommitsSinceDateSpy
};
const service = new UserService(api);

jest.mock('../middlewares/user-ensureAuthentication', () => ({
	get CURRENT_USER() {
		return {
			login: 'AAAAAAAA',
			PAT: 'asdasfdgasfdgr435t345t326t5234yg54qg5rg45'
		};
	}
}));
jest.mock('../prisma/client', () => {
	return {
		_esModule: true,
		client: {
			user: {
				findFirst: async () => prismaClientSpy.findFirst(),
				create: async () => prismaClientSpy.create(),
				update: async () => prismaClientSpy.update()
			}
		}
	};
});
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

		githubApiSpy.followUserSpy.mockResolvedValueOnce(apiResponse);

		expect(service.followUser(loginToFollow)).resolves.not.toThrow();

		expect(githubApiSpy.followUserSpy).toHaveBeenCalledWith(loginToFollow);
	});

	it('should not be able to follow a user with empty login to follow', () => {
		const loginToFollow = '';

		expect(service.followUser(loginToFollow)).rejects.toThrow();

		expect(githubApiSpy.followUserSpy).not.toHaveBeenCalled();
	});

	it('should rejects when api reponse status code is not 204', () => {
		const loginToFollow = 'BBBBBBB';

		const apiResponse = {
			'status': 400
		};

		githubApiSpy.followUserSpy.mockResolvedValueOnce(apiResponse);

		expect(service.followUser(loginToFollow)).rejects.toThrow();

		expect(githubApiSpy.followUserSpy).toHaveBeenCalledWith(loginToFollow);
	});
});

describe('Unfollow a user', () => {
	it('should be able to unfollow a user', () => {
		const loginToUnfollow = 'BBBBBBB';

		const apiResponse = {
			'status': 204
		};

		githubApiSpy.unfollowUserSpy.mockResolvedValueOnce(apiResponse);

		expect(service.unfollowUser(loginToUnfollow)).resolves.not.toThrow();

		expect(githubApiSpy.unfollowUserSpy).toHaveBeenCalledWith(loginToUnfollow);
	});

	it('should not be able to unfollow a user with empty login to follow', () => {
		const loginToUnfollow = '';

		expect(service.unfollowUser(loginToUnfollow)).rejects.toThrow();

		expect(githubApiSpy.followUserSpy).not.toHaveBeenCalled();
	});

	it('should rejects when api reponse status code is not 204', () => {
		const loginToFollow = 'BBBBBBB';

		const apiResponse = {
			'status': 400
		};

		githubApiSpy.unfollowUserSpy.mockResolvedValueOnce(apiResponse);

		expect(service.unfollowUser(loginToFollow)).rejects.toThrow();

		expect(githubApiSpy.unfollowUserSpy).toHaveBeenCalledWith(loginToFollow);
	});
});

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

		githubApiSpy.listRepositoriesSpy.mockResolvedValueOnce(apiResponse);

		const result = await service.listRepositories();

		expect(result).toEqual(expectedResult);
		expect(githubApiSpy.listRepositoriesSpy).toHaveBeenCalled();
		expect(githubApiSpy.listRepositoriesSpy).toHaveBeenCalledTimes(1);
	});
});

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

		githubApiSpy.listRepositoriesSpy.mockResolvedValueOnce(apiResponse);

		const result = await service.getNumberOfStars();

		expect(result).toEqual(expectedResult);
		expect(githubApiSpy.listRepositoriesSpy).toHaveBeenCalled();
		expect(githubApiSpy.listRepositoriesSpy).toHaveBeenCalledTimes(1);

	});
});

describe('Get Commits', () => {
	it('should be able to get the authenticated user number of commits', async () => {
		const commitsSinceBeginingApiResponse = {
			data: {
				total_count: 708,
				incomplete_results: false,
				items: []
			}
		};
		const commitsSinceDateApiResponse = {
			data: {
				total_count: 300,
				incomplete_results: false,
				items: []
			}
		};

		const expectedResult = {
			commits_in_current_year: 300,
			total_commits: 708
		};

		githubApiSpy.getNumberOfCommitsSinceBeginingSpy.mockResolvedValueOnce(commitsSinceBeginingApiResponse);
		githubApiSpy.getNumberOfCommitsSinceDateSpy.mockResolvedValueOnce(commitsSinceDateApiResponse);

		const result = await service.getNumberOfCommitsForAuthUser();

		expect(result).toEqual(expectedResult);
		expect(githubApiSpy.getNumberOfCommitsSinceBeginingSpy).toHaveBeenCalledWith(CURRENT_USER.login);
		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).toHaveBeenCalledWith(CURRENT_USER.login, `${new Date().getFullYear()}-01-01`);
		expect(githubApiSpy.getNumberOfCommitsSinceBeginingSpy).toHaveBeenCalledTimes(1);
		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).toHaveBeenCalledTimes(1);

	});

	it('should be able to get number of commits of a username', async () => {
		const commitsSinceDateApiResponse = {
			headers: {
				'x-ratelimit-remaining': 5
			},
			data: {
				total_count: 252,
				incomplete_results: false,
				items: []
			}
		};

		const username = 'bro';
		const sinceDate = '2022-04-30';

		const expectedResult = {
			total_commits_since_date: 252
		};

		githubApiSpy.getNumberOfCommitsSinceDateSpy.mockResolvedValueOnce(commitsSinceDateApiResponse);

		const result = await service.getNumberOfCommits(username, sinceDate);

		expect(result).toEqual(expectedResult);
		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).toHaveBeenCalledWith(username, sinceDate);
		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).toHaveBeenCalledTimes(1);
	});

	it('should not be able to get number of commits with empty username', async () => {
		const username = '';
		const sinceDate = '2022-04-30';

		expect(service.getNumberOfCommits(username, sinceDate)).rejects.toThrow();

		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).not.toHaveBeenCalled();
	});

	it('should not be able to get number of commits with invalid sinceDate', async () => {
		const username = 'bro';
		const sinceDate = '2022-04-31';

		expect(service.getNumberOfCommits(username, sinceDate)).rejects.toThrow();

		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).not.toHaveBeenCalled();
	});

	it('should not be able to get number of commits with invalid sinceDate format', async () => {
		const username = 'bro';
		const sinceDate = 'ewqrewrweqew';

		expect(service.getNumberOfCommits(username, sinceDate)).rejects.toThrow();

		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).not.toHaveBeenCalled();
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

		githubApiSpy.listRepositoriesSpy.mockResolvedValueOnce(listRepositoriesApiResponse);

		githubApiSpy.getRepositoryPullsSpy.mockResolvedValueOnce(getRepositoryPullsApiResponse1);
		githubApiSpy.getRepositoryPullsSpy.mockResolvedValueOnce(getRepositoryPullsApiResponse2);
		githubApiSpy.getRepositoryPullsSpy.mockResolvedValueOnce(getRepositoryPullsApiResponse3);

		const result = await service.getNumberOfPulls();

		expect(result).toEqual(expectedResult);
		expect(githubApiSpy.listRepositoriesSpy).toHaveBeenCalled();
		expect(githubApiSpy.getRepositoryPullsSpy).toHaveBeenCalledWith(listRepositoriesApiResponse[0].owner.login, listRepositoriesApiResponse[0].name);
		expect(githubApiSpy.getRepositoryPullsSpy).toHaveBeenCalledWith(listRepositoriesApiResponse[1].owner.login, listRepositoriesApiResponse[1].name);
		expect(githubApiSpy.getRepositoryPullsSpy).toHaveBeenCalledWith(listRepositoriesApiResponse[2].owner.login, listRepositoriesApiResponse[2].name);
		expect(githubApiSpy.listRepositoriesSpy).toHaveBeenCalledTimes(1);
		expect(githubApiSpy.getRepositoryPullsSpy).toHaveBeenCalledTimes(3);

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

		githubApiSpy.listRepositoriesSpy.mockResolvedValueOnce(listRepositoriesApiResponse);

		githubApiSpy.getUsedLanguagesSpy.mockResolvedValueOnce(UsedLanguagesApiResponse1);
		githubApiSpy.getUsedLanguagesSpy.mockResolvedValueOnce(UsedLanguagesApiResponse2);
		githubApiSpy.getUsedLanguagesSpy.mockResolvedValueOnce(UsedLanguagesApiResponse3);

		const result = await service.getUsedLanguages();

		expect(result).toEqual(expectedResult);
		expect(githubApiSpy.listRepositoriesSpy).toHaveBeenCalled();
		expect(githubApiSpy.getUsedLanguagesSpy).toHaveBeenCalledWith(listRepositoriesApiResponse[0].owner.login, listRepositoriesApiResponse[0].name);
		expect(githubApiSpy.getUsedLanguagesSpy).toHaveBeenCalledWith(listRepositoriesApiResponse[1].owner.login, listRepositoriesApiResponse[1].name);
		expect(githubApiSpy.getUsedLanguagesSpy).toHaveBeenCalledWith(listRepositoriesApiResponse[2].owner.login, listRepositoriesApiResponse[2].name);
		expect(githubApiSpy.listRepositoriesSpy).toHaveBeenCalledTimes(1);
		expect(githubApiSpy.getUsedLanguagesSpy).toHaveBeenCalledTimes(3);

	});
});

describe('Get a user', () => {
	it('should be able to get a user', () => {
		const usernameToGet = 'BBBBBBB';

		const apiResponse = {
			'status': 200
		};

		githubApiSpy.getUserSpy.mockResolvedValueOnce(apiResponse);

		expect(service.getUser(usernameToGet)).resolves.not.toThrow();

		expect(githubApiSpy.getUserSpy).toHaveBeenCalledWith(usernameToGet);
	});

	it('should not be able to get a user with empty login to get', () => {
		const usernameToGet = '';

		expect(service.getUser(usernameToGet)).rejects.toThrow();

		expect(githubApiSpy.getUserSpy).not.toHaveBeenCalled();
	});

	it('should rejects when api reponse status code is not 200', () => {
		const usernameToGet = 'BBBBBBB';

		const apiResponse = {
			'status': 400
		};

		githubApiSpy.getUserSpy.mockResolvedValueOnce(apiResponse);

		expect(service.getUser(usernameToGet)).rejects.toThrow();

		expect(githubApiSpy.getUserSpy).toHaveBeenCalledWith(usernameToGet);
	});
});

describe('Authenticate user', () => {
	it('should be able to authenticate user that already exists on database', async () => {
		const username = 'krakrakra';
		const pat = 'ghp_86f4ad856f6d85f4d4fds56fasdf';
		const cryptr = new Cryptr(process.env.CRYPTR_SECRET || 'default');
		
		const encryptedPat = cryptr.encrypt(pat);

		githubApiSpy.checkUserCredentialsSpy.mockResolvedValueOnce({
			data: {
				login: 'krakrakra'
			}
		});

		prismaClientSpy.findFirst.mockResolvedValueOnce({
			username: 'krakrakra',
			pat: encryptedPat,
			token: ''
		});

		generateJwtTokenProviderSpy.mockReturnValueOnce('123456789');

		await expect(service.authenticateUser(username, pat)).resolves.not.toThrow();
		expect(prismaClientSpy.findFirst).toHaveBeenCalledTimes(1);
		expect(api.checkUserCredentials).toHaveBeenCalledWith(username, pat);
		expect(prismaClientSpy.update).toHaveBeenCalledTimes(1);
		expect(generateJwtTokenProviderSpy).toHaveBeenCalledTimes(1);
	});
	it('should be able to authenticate user that does not exist on database', async () => {
		const username = 'krakrakra';
		const pat = 'ghp_86f4ad856f6d85f4d4fds56fasdf';

		githubApiSpy.checkUserCredentialsSpy.mockResolvedValueOnce({
			data: {
				login: 'krakrakra'
			}
		});

		prismaClientSpy.findFirst.mockResolvedValueOnce(null);

		generateJwtTokenProviderSpy.mockReturnValueOnce('123456789');

		await expect(service.authenticateUser(username, pat)).resolves.not.toThrow();
		expect(prismaClientSpy.findFirst).toHaveBeenCalledTimes(1);
		expect(api.checkUserCredentials).toHaveBeenCalledWith(username, pat);
		expect(prismaClientSpy.create).toHaveBeenCalledTimes(1);
		expect(generateJwtTokenProviderSpy).toHaveBeenCalledTimes(1);
	});
	it('should be able to authenticate user that has a different pat on database', async () => {
		const username = 'krakrakra';
		const pat = 'ghp_86f4ad856f6d85f4d4fds56fasdf';

		const cryptr = new Cryptr(process.env.CRYPTR_SECRET || 'default');
		
		const encryptedPat = cryptr.encrypt('ghp_86f4ad856f6d85f4d4fds5612345');

		githubApiSpy.checkUserCredentialsSpy.mockResolvedValueOnce({
			data: {
				login: 'krakrakra'
			}
		});

		prismaClientSpy.findFirst.mockResolvedValueOnce({
			username: 'krakrakra',
			pat: encryptedPat,
			token: ''
		});

		generateJwtTokenProviderSpy.mockReturnValueOnce('123456789');

		await expect(service.authenticateUser(username, pat)).resolves.not.toThrow();
		expect(prismaClientSpy.findFirst).toHaveBeenCalledTimes(1);
		expect(api.checkUserCredentials).toHaveBeenCalledWith(username, pat);
		expect(prismaClientSpy.update).toHaveBeenCalledTimes(2);
		expect(generateJwtTokenProviderSpy).toHaveBeenCalledTimes(1);
	});
	it('should not be able to authenticate user with unmatched username', async () => {
		const username = 'krakrakra';
		const pat = 'ghp_86f4ad856f6d85f4d4fds56fasdf';

		githubApiSpy.checkUserCredentialsSpy.mockResolvedValueOnce({
			data: {
				login: 'brobro'
			}
		});

		prismaClientSpy.findFirst.mockResolvedValueOnce(null);

		generateJwtTokenProviderSpy.mockReturnValueOnce('123456789');

		await expect(service.authenticateUser(username, pat)).rejects.toThrow();
		expect(api.checkUserCredentials).toHaveBeenCalledWith(username, pat);
		expect(prismaClientSpy.findFirst).not.toHaveBeenCalled();
		expect(prismaClientSpy.create).not.toHaveBeenCalled();
		expect(prismaClientSpy.update).not.toHaveBeenCalled();
		expect(generateJwtTokenProviderSpy).not.toHaveBeenCalled();
	});
	it('should not be able to authenticate user with empty username', async () => {
		const username = '';
		const pat = 'ghp_86f4ad856f6d85f4d4fds56fasdf';

		await expect(service.authenticateUser(username, pat)).rejects.toThrow();
		expect(prismaClientSpy.findFirst).not.toHaveBeenCalled();
		expect(api.checkUserCredentials).not.toHaveBeenCalled();
		expect(prismaClientSpy.create).not.toHaveBeenCalled();
		expect(prismaClientSpy.update).not.toHaveBeenCalled();
		expect(generateJwtTokenProviderSpy).not.toHaveBeenCalled();
	});
	it('should not be able to authenticate user with empty pat', async () => {
		const username = 'krakrakra';
		const pat = '';

		await expect(service.authenticateUser(username, pat)).rejects.toThrow();
		expect(prismaClientSpy.findFirst).not.toHaveBeenCalled();
		expect(api.checkUserCredentials).not.toHaveBeenCalled();
		expect(prismaClientSpy.create).not.toHaveBeenCalled();
		expect(prismaClientSpy.update).not.toHaveBeenCalled();
		expect(generateJwtTokenProviderSpy).not.toHaveBeenCalled();
	});
	it('should not be able to authenticate user with pat that does not begin with ghp_', async () => {
		const username = 'krakrakra';
		const pat = '86f4ad856f6d85f4d4fds56fasdf';

		await expect(service.authenticateUser(username, pat)).rejects.toThrow();
		expect(prismaClientSpy.findFirst).not.toHaveBeenCalled();
		expect(api.checkUserCredentials).not.toHaveBeenCalled();
		expect(prismaClientSpy.create).not.toHaveBeenCalled();
		expect(prismaClientSpy.update).not.toHaveBeenCalled();
		expect(generateJwtTokenProviderSpy).not.toHaveBeenCalled();
	});
});

describe('Search users', () => {
	it('should be able to return a list of users sorted by number of commits with all the parameters', async () => {
		const searchUsersApiResponse = [
			{
				login: 'user1'
			},{
				login: 'user2'
			},{
				login: 'user3'
			},{
				login: 'user4'
			},{
				login: 'user5'
			}
		];
	
		const getCommitsApiResponse1 = {
			status: 200,
			headers: {
				'x-ratelimit-remaining': 5
			},
			data: {
				total_count: 23,
				incomplete_results: false,
				items: []
			}
		};
		const getCommitsApiResponse2 = {
			status: 200,
			headers: {
				'x-ratelimit-remaining': 5
			},
			data: {
				total_count: 785,
				incomplete_results: false,
				items: []
			}
		};
		const getCommitsApiResponse3 = {
			status: 200,
			headers: {
				'x-ratelimit-remaining': 5
			},
			data: {
				total_count: 453,
				incomplete_results: false,
				items: []
			}
		};
		const getCommitsApiResponse4 = {
			status: 200,
			headers: {
				'x-ratelimit-remaining': 5
			},
			data: {
				total_count: 230,
				incomplete_results: false,
				items: []
			}
		};
		const getCommitsApiResponse5 = {
			status: 200,
			headers: {
				'x-ratelimit-remaining': 5
			},
			data: {
				total_count: 852,
				incomplete_results: false,
				items: []
			}
		};
	
		const getUserApiResponse1 = {
			status: 200,
			data: {
				login: 'user1',
				id: 111,
				node_id: 'string',
				avatar_url: 'string',
				gravatar_id: 'string',
				url: 'string',
				html_url: 'string',
				followers_url: 'string',
				following_url: 'string',
				gists_url: 'string',
				starred_url: 'string',
				subscriptions_url: 'string',
				organizations_url: 'string',
				repos_url: 'string',
				events_url: 'string',
				received_events_url: 'string',
				type: 'string',
				site_admin: false,
				name: 'string',
				company: 'string',
				blog: 'string',
				location: 'string',
				email: 'user1@example.com',
				hireable: false,
				bio: 'string',
				twitter_username: 'string',
				public_repos: 12,
				public_gists: 12,
				followers: 12,
				following: 12,
				created_at: 'string',
				updated_at: 'string',
			}
		};
		const getUserApiResponse2 = {
			status: 200,
			data: {
				login: 'user2',
				id: 222,
				node_id: 'string',
				avatar_url: 'string',
				gravatar_id: 'string',
				url: 'string',
				html_url: 'string',
				followers_url: 'string',
				following_url: 'string',
				gists_url: 'string',
				starred_url: 'string',
				subscriptions_url: 'string',
				organizations_url: 'string',
				repos_url: 'string',
				events_url: 'string',
				received_events_url: 'string',
				type: 'string',
				site_admin: false,
				name: 'string',
				company: 'string',
				blog: 'string',
				location: 'string',
				email: 'user2@example.com',
				hireable: false,
				bio: 'string',
				twitter_username: 'string',
				public_repos: 12,
				public_gists: 12,
				followers: 12,
				following: 12,
				created_at: 'string',
				updated_at: 'string',
			}
		};
		const getUserApiResponse3 = {
			status: 200,
			data: {
				login: 'user3',
				id: 333,
				node_id: 'string',
				avatar_url: 'string',
				gravatar_id: 'string',
				url: 'string',
				html_url: 'string',
				followers_url: 'string',
				following_url: 'string',
				gists_url: 'string',
				starred_url: 'string',
				subscriptions_url: 'string',
				organizations_url: 'string',
				repos_url: 'string',
				events_url: 'string',
				received_events_url: 'string',
				type: 'string',
				site_admin: false,
				name: 'string',
				company: 'string',
				blog: 'string',
				location: 'string',
				email: 'user3@example.com',
				hireable: false,
				bio: 'string',
				twitter_username: 'string',
				public_repos: 12,
				public_gists: 12,
				followers: 12,
				following: 12,
				created_at: 'string',
				updated_at: 'string',
			}
		};
		const getUserApiResponse4 = {
			status: 200,
			data: {
				login: 'user4',
				id: 444,
				node_id: 'string',
				avatar_url: 'string',
				gravatar_id: 'string',
				url: 'string',
				html_url: 'string',
				followers_url: 'string',
				following_url: 'string',
				gists_url: 'string',
				starred_url: 'string',
				subscriptions_url: 'string',
				organizations_url: 'string',
				repos_url: 'string',
				events_url: 'string',
				received_events_url: 'string',
				type: 'string',
				site_admin: false,
				name: 'string',
				company: 'string',
				blog: 'string',
				location: 'string',
				email: 'user4@example.com',
				hireable: false,
				bio: 'string',
				twitter_username: 'string',
				public_repos: 12,
				public_gists: 12,
				followers: 12,
				following: 12,
				created_at: 'string',
				updated_at: 'string',
			}
		};
		const getUserApiResponse5 = {
			status: 200,
			data: {
				login: 'user5',
				id: 555,
				node_id: 'string',
				avatar_url: 'string',
				gravatar_id: 'string',
				url: 'string',
				html_url: 'string',
				followers_url: 'string',
				following_url: 'string',
				gists_url: 'string',
				starred_url: 'string',
				subscriptions_url: 'string',
				organizations_url: 'string',
				repos_url: 'string',
				events_url: 'string',
				received_events_url: 'string',
				type: 'string',
				site_admin: false,
				name: 'string',
				company: 'string',
				blog: 'string',
				location: 'string',
				email: 'user5@example.com',
				hireable: false,
				bio: 'string',
				twitter_username: 'string',
				public_repos: 12,
				public_gists: 12,
				followers: 12,
				following: 12,
				created_at: 'string',
				updated_at: 'string',
			}
		};
	
		const expectedResult = [
			{
				login: 'user5',
				commits: {
					total_commits_since_date: 852
				},
				email: 'user5@example.com'
			},{
				login: 'user2',
				commits: {
					total_commits_since_date: 785
				},
				email: 'user2@example.com'
			},{
				login: 'user3',
				commits: {
					total_commits_since_date: 453
				},
				email: 'user3@example.com'
			},{
				login: 'user4',
				commits: {
					total_commits_since_date: 230
				},
				email: 'user4@example.com'
			},{
				login: 'user1',
				commits: {
					total_commits_since_date: 23
				},
				email: 'user1@example.com'
			}
		];
	
		githubApiSpy.searchUsersSpy.mockResolvedValueOnce(searchUsersApiResponse);
	
		githubApiSpy.getNumberOfCommitsSinceDateSpy.mockResolvedValueOnce(getCommitsApiResponse1);
		githubApiSpy.getNumberOfCommitsSinceDateSpy.mockResolvedValueOnce(getCommitsApiResponse2);
		githubApiSpy.getNumberOfCommitsSinceDateSpy.mockResolvedValueOnce(getCommitsApiResponse3);
		githubApiSpy.getNumberOfCommitsSinceDateSpy.mockResolvedValueOnce(getCommitsApiResponse4);
		githubApiSpy.getNumberOfCommitsSinceDateSpy.mockResolvedValueOnce(getCommitsApiResponse5);
	
		githubApiSpy.getUserSpy.mockResolvedValueOnce(getUserApiResponse1);
		githubApiSpy.getUserSpy.mockResolvedValueOnce(getUserApiResponse2);
		githubApiSpy.getUserSpy.mockResolvedValueOnce(getUserApiResponse3);
		githubApiSpy.getUserSpy.mockResolvedValueOnce(getUserApiResponse4);
		githubApiSpy.getUserSpy.mockResolvedValueOnce(getUserApiResponse5);

		const language = 'javascript';
		const type = 'users';
		const location = 'Brazil';
		const sort = 'followers';
		const sinceDate = '2022-01-01';
		const pages = 1;

		const result = await service.searchAndSortUsers(language, type, location, sort, sinceDate, pages);

		const queryObj = {
			q: `language:${language} type:${type} location:${location}`,
			sort: sort
		};

		const params = new URLSearchParams(queryObj).toString();

		expect(result).toEqual(expectedResult);

		expect(githubApiSpy.searchUsersSpy).toHaveBeenCalledWith(params, pages);

		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).toHaveBeenNthCalledWith(1, getUserApiResponse1.data.login, sinceDate);
		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).toHaveBeenNthCalledWith(2, getUserApiResponse2.data.login, sinceDate);
		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).toHaveBeenNthCalledWith(3, getUserApiResponse3.data.login, sinceDate);
		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).toHaveBeenNthCalledWith(4, getUserApiResponse4.data.login, sinceDate);
		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).toHaveBeenNthCalledWith(5, getUserApiResponse5.data.login, sinceDate);

		expect(githubApiSpy.getUserSpy).toHaveBeenNthCalledWith(1, getUserApiResponse1.data.login);
		expect(githubApiSpy.getUserSpy).toHaveBeenNthCalledWith(2, getUserApiResponse2.data.login);
		expect(githubApiSpy.getUserSpy).toHaveBeenNthCalledWith(3, getUserApiResponse3.data.login);
		expect(githubApiSpy.getUserSpy).toHaveBeenNthCalledWith(4, getUserApiResponse4.data.login);
		expect(githubApiSpy.getUserSpy).toHaveBeenNthCalledWith(5, getUserApiResponse5.data.login);
		
	});
	
	it('should be able to return a list of users sorted by number of commits with empty/undefined location', async () => {
		const searchUsersApiResponse = [
			{
				login: 'user1'
			},{
				login: 'user2'
			},{
				login: 'user3'
			},{
				login: 'user4'
			},{
				login: 'user5'
			}
		];
	
		const getCommitsApiResponse1 = {
			status: 200,
			headers: {
				'x-ratelimit-remaining': 5
			},
			data: {
				total_count: 23,
				incomplete_results: false,
				items: []
			}
		};
		const getCommitsApiResponse2 = {
			status: 200,
			headers: {
				'x-ratelimit-remaining': 5
			},
			data: {
				total_count: 785,
				incomplete_results: false,
				items: []
			}
		};
		const getCommitsApiResponse3 = {
			status: 200,
			headers: {
				'x-ratelimit-remaining': 5
			},
			data: {
				total_count: 453,
				incomplete_results: false,
				items: []
			}
		};
		const getCommitsApiResponse4 = {
			status: 200,
			headers: {
				'x-ratelimit-remaining': 5
			},
			data: {
				total_count: 230,
				incomplete_results: false,
				items: []
			}
		};
		const getCommitsApiResponse5 = {
			status: 200,
			headers: {
				'x-ratelimit-remaining': 5
			},
			data: {
				total_count: 852,
				incomplete_results: false,
				items: []
			}
		};
	
		const getUserApiResponse1 = {
			status: 200,
			data: {
				login: 'user1',
				id: 111,
				node_id: 'string',
				avatar_url: 'string',
				gravatar_id: 'string',
				url: 'string',
				html_url: 'string',
				followers_url: 'string',
				following_url: 'string',
				gists_url: 'string',
				starred_url: 'string',
				subscriptions_url: 'string',
				organizations_url: 'string',
				repos_url: 'string',
				events_url: 'string',
				received_events_url: 'string',
				type: 'string',
				site_admin: false,
				name: 'string',
				company: 'string',
				blog: 'string',
				location: 'string',
				email: 'user1@example.com',
				hireable: false,
				bio: 'string',
				twitter_username: 'string',
				public_repos: 12,
				public_gists: 12,
				followers: 12,
				following: 12,
				created_at: 'string',
				updated_at: 'string',
			}
		};
		const getUserApiResponse2 = {
			status: 200,
			data: {
				login: 'user2',
				id: 222,
				node_id: 'string',
				avatar_url: 'string',
				gravatar_id: 'string',
				url: 'string',
				html_url: 'string',
				followers_url: 'string',
				following_url: 'string',
				gists_url: 'string',
				starred_url: 'string',
				subscriptions_url: 'string',
				organizations_url: 'string',
				repos_url: 'string',
				events_url: 'string',
				received_events_url: 'string',
				type: 'string',
				site_admin: false,
				name: 'string',
				company: 'string',
				blog: 'string',
				location: 'string',
				email: 'user2@example.com',
				hireable: false,
				bio: 'string',
				twitter_username: 'string',
				public_repos: 12,
				public_gists: 12,
				followers: 12,
				following: 12,
				created_at: 'string',
				updated_at: 'string',
			}
		};
		const getUserApiResponse3 = {
			status: 200,
			data: {
				login: 'user3',
				id: 333,
				node_id: 'string',
				avatar_url: 'string',
				gravatar_id: 'string',
				url: 'string',
				html_url: 'string',
				followers_url: 'string',
				following_url: 'string',
				gists_url: 'string',
				starred_url: 'string',
				subscriptions_url: 'string',
				organizations_url: 'string',
				repos_url: 'string',
				events_url: 'string',
				received_events_url: 'string',
				type: 'string',
				site_admin: false,
				name: 'string',
				company: 'string',
				blog: 'string',
				location: 'string',
				email: 'user3@example.com',
				hireable: false,
				bio: 'string',
				twitter_username: 'string',
				public_repos: 12,
				public_gists: 12,
				followers: 12,
				following: 12,
				created_at: 'string',
				updated_at: 'string',
			}
		};
		const getUserApiResponse4 = {
			status: 200,
			data: {
				login: 'user4',
				id: 444,
				node_id: 'string',
				avatar_url: 'string',
				gravatar_id: 'string',
				url: 'string',
				html_url: 'string',
				followers_url: 'string',
				following_url: 'string',
				gists_url: 'string',
				starred_url: 'string',
				subscriptions_url: 'string',
				organizations_url: 'string',
				repos_url: 'string',
				events_url: 'string',
				received_events_url: 'string',
				type: 'string',
				site_admin: false,
				name: 'string',
				company: 'string',
				blog: 'string',
				location: 'string',
				email: 'user4@example.com',
				hireable: false,
				bio: 'string',
				twitter_username: 'string',
				public_repos: 12,
				public_gists: 12,
				followers: 12,
				following: 12,
				created_at: 'string',
				updated_at: 'string',
			}
		};
		const getUserApiResponse5 = {
			status: 200,
			data: {
				login: 'user5',
				id: 555,
				node_id: 'string',
				avatar_url: 'string',
				gravatar_id: 'string',
				url: 'string',
				html_url: 'string',
				followers_url: 'string',
				following_url: 'string',
				gists_url: 'string',
				starred_url: 'string',
				subscriptions_url: 'string',
				organizations_url: 'string',
				repos_url: 'string',
				events_url: 'string',
				received_events_url: 'string',
				type: 'string',
				site_admin: false,
				name: 'string',
				company: 'string',
				blog: 'string',
				location: 'string',
				email: 'user5@example.com',
				hireable: false,
				bio: 'string',
				twitter_username: 'string',
				public_repos: 12,
				public_gists: 12,
				followers: 12,
				following: 12,
				created_at: 'string',
				updated_at: 'string',
			}
		};
	
		const expectedResult = [
			{
				login: 'user5',
				commits: {
					total_commits_since_date: 852
				},
				email: 'user5@example.com'
			},{
				login: 'user2',
				commits: {
					total_commits_since_date: 785
				},
				email: 'user2@example.com'
			},{
				login: 'user3',
				commits: {
					total_commits_since_date: 453
				},
				email: 'user3@example.com'
			},{
				login: 'user4',
				commits: {
					total_commits_since_date: 230
				},
				email: 'user4@example.com'
			},{
				login: 'user1',
				commits: {
					total_commits_since_date: 23
				},
				email: 'user1@example.com'
			}
		];
	
		githubApiSpy.searchUsersSpy.mockResolvedValueOnce(searchUsersApiResponse);
	
		githubApiSpy.getNumberOfCommitsSinceDateSpy.mockResolvedValueOnce(getCommitsApiResponse1);
		githubApiSpy.getNumberOfCommitsSinceDateSpy.mockResolvedValueOnce(getCommitsApiResponse2);
		githubApiSpy.getNumberOfCommitsSinceDateSpy.mockResolvedValueOnce(getCommitsApiResponse3);
		githubApiSpy.getNumberOfCommitsSinceDateSpy.mockResolvedValueOnce(getCommitsApiResponse4);
		githubApiSpy.getNumberOfCommitsSinceDateSpy.mockResolvedValueOnce(getCommitsApiResponse5);
	
		githubApiSpy.getUserSpy.mockResolvedValueOnce(getUserApiResponse1);
		githubApiSpy.getUserSpy.mockResolvedValueOnce(getUserApiResponse2);
		githubApiSpy.getUserSpy.mockResolvedValueOnce(getUserApiResponse3);
		githubApiSpy.getUserSpy.mockResolvedValueOnce(getUserApiResponse4);
		githubApiSpy.getUserSpy.mockResolvedValueOnce(getUserApiResponse5);

		const language = 'javascript';
		const type = 'users';
		const sort = 'followers';
		const sinceDate = '2022-01-01';
		const pages = 1;

		const result = await service.searchAndSortUsers(language, type, undefined, sort, sinceDate, pages);

		const queryObj= {
			q: `language:${language} type:${type}`,
			sort: ''
		};

		if(sort){
			queryObj.sort = sort;
		}

		const params = new URLSearchParams(queryObj).toString();

		expect(result).toEqual(expectedResult);

		expect(githubApiSpy.searchUsersSpy).toHaveBeenCalledWith(params, pages);

		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).toHaveBeenNthCalledWith(1, getUserApiResponse1.data.login, sinceDate);
		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).toHaveBeenNthCalledWith(2, getUserApiResponse2.data.login, sinceDate);
		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).toHaveBeenNthCalledWith(3, getUserApiResponse3.data.login, sinceDate);
		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).toHaveBeenNthCalledWith(4, getUserApiResponse4.data.login, sinceDate);
		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).toHaveBeenNthCalledWith(5, getUserApiResponse5.data.login, sinceDate);

		expect(githubApiSpy.getUserSpy).toHaveBeenNthCalledWith(1, getUserApiResponse1.data.login);
		expect(githubApiSpy.getUserSpy).toHaveBeenNthCalledWith(2, getUserApiResponse2.data.login);
		expect(githubApiSpy.getUserSpy).toHaveBeenNthCalledWith(3, getUserApiResponse3.data.login);
		expect(githubApiSpy.getUserSpy).toHaveBeenNthCalledWith(4, getUserApiResponse4.data.login);
		expect(githubApiSpy.getUserSpy).toHaveBeenNthCalledWith(5, getUserApiResponse5.data.login);
		
	});

	it('should be able to return a list of users sorted by number of commits with empty/undefined sort', async () => {
		const searchUsersApiResponse = [
			{
				login: 'user1'
			},{
				login: 'user2'
			},{
				login: 'user3'
			},{
				login: 'user4'
			},{
				login: 'user5'
			}
		];
	
		const getCommitsApiResponse1 = {
			status: 200,
			headers: {
				'x-ratelimit-remaining': 5
			},
			data: {
				total_count: 23,
				incomplete_results: false,
				items: []
			}
		};
		const getCommitsApiResponse2 = {
			status: 200,
			headers: {
				'x-ratelimit-remaining': 5
			},
			data: {
				total_count: 785,
				incomplete_results: false,
				items: []
			}
		};
		const getCommitsApiResponse3 = {
			status: 200,
			headers: {
				'x-ratelimit-remaining': 5
			},
			data: {
				total_count: 453,
				incomplete_results: false,
				items: []
			}
		};
		const getCommitsApiResponse4 = {
			status: 200,
			headers: {
				'x-ratelimit-remaining': 5
			},
			data: {
				total_count: 230,
				incomplete_results: false,
				items: []
			}
		};
		const getCommitsApiResponse5 = {
			status: 200,
			headers: {
				'x-ratelimit-remaining': 5
			},
			data: {
				total_count: 852,
				incomplete_results: false,
				items: []
			}
		};
	
		const getUserApiResponse1 = {
			status: 200,
			data: {
				login: 'user1',
				id: 111,
				node_id: 'string',
				avatar_url: 'string',
				gravatar_id: 'string',
				url: 'string',
				html_url: 'string',
				followers_url: 'string',
				following_url: 'string',
				gists_url: 'string',
				starred_url: 'string',
				subscriptions_url: 'string',
				organizations_url: 'string',
				repos_url: 'string',
				events_url: 'string',
				received_events_url: 'string',
				type: 'string',
				site_admin: false,
				name: 'string',
				company: 'string',
				blog: 'string',
				location: 'string',
				email: 'user1@example.com',
				hireable: false,
				bio: 'string',
				twitter_username: 'string',
				public_repos: 12,
				public_gists: 12,
				followers: 12,
				following: 12,
				created_at: 'string',
				updated_at: 'string',
			}
		};
		const getUserApiResponse2 = {
			status: 200,
			data: {
				login: 'user2',
				id: 222,
				node_id: 'string',
				avatar_url: 'string',
				gravatar_id: 'string',
				url: 'string',
				html_url: 'string',
				followers_url: 'string',
				following_url: 'string',
				gists_url: 'string',
				starred_url: 'string',
				subscriptions_url: 'string',
				organizations_url: 'string',
				repos_url: 'string',
				events_url: 'string',
				received_events_url: 'string',
				type: 'string',
				site_admin: false,
				name: 'string',
				company: 'string',
				blog: 'string',
				location: 'string',
				email: 'user2@example.com',
				hireable: false,
				bio: 'string',
				twitter_username: 'string',
				public_repos: 12,
				public_gists: 12,
				followers: 12,
				following: 12,
				created_at: 'string',
				updated_at: 'string',
			}
		};
		const getUserApiResponse3 = {
			status: 200,
			data: {
				login: 'user3',
				id: 333,
				node_id: 'string',
				avatar_url: 'string',
				gravatar_id: 'string',
				url: 'string',
				html_url: 'string',
				followers_url: 'string',
				following_url: 'string',
				gists_url: 'string',
				starred_url: 'string',
				subscriptions_url: 'string',
				organizations_url: 'string',
				repos_url: 'string',
				events_url: 'string',
				received_events_url: 'string',
				type: 'string',
				site_admin: false,
				name: 'string',
				company: 'string',
				blog: 'string',
				location: 'string',
				email: 'user3@example.com',
				hireable: false,
				bio: 'string',
				twitter_username: 'string',
				public_repos: 12,
				public_gists: 12,
				followers: 12,
				following: 12,
				created_at: 'string',
				updated_at: 'string',
			}
		};
		const getUserApiResponse4 = {
			status: 200,
			data: {
				login: 'user4',
				id: 444,
				node_id: 'string',
				avatar_url: 'string',
				gravatar_id: 'string',
				url: 'string',
				html_url: 'string',
				followers_url: 'string',
				following_url: 'string',
				gists_url: 'string',
				starred_url: 'string',
				subscriptions_url: 'string',
				organizations_url: 'string',
				repos_url: 'string',
				events_url: 'string',
				received_events_url: 'string',
				type: 'string',
				site_admin: false,
				name: 'string',
				company: 'string',
				blog: 'string',
				location: 'string',
				email: 'user4@example.com',
				hireable: false,
				bio: 'string',
				twitter_username: 'string',
				public_repos: 12,
				public_gists: 12,
				followers: 12,
				following: 12,
				created_at: 'string',
				updated_at: 'string',
			}
		};
		const getUserApiResponse5 = {
			status: 200,
			data: {
				login: 'user5',
				id: 555,
				node_id: 'string',
				avatar_url: 'string',
				gravatar_id: 'string',
				url: 'string',
				html_url: 'string',
				followers_url: 'string',
				following_url: 'string',
				gists_url: 'string',
				starred_url: 'string',
				subscriptions_url: 'string',
				organizations_url: 'string',
				repos_url: 'string',
				events_url: 'string',
				received_events_url: 'string',
				type: 'string',
				site_admin: false,
				name: 'string',
				company: 'string',
				blog: 'string',
				location: 'string',
				email: 'user5@example.com',
				hireable: false,
				bio: 'string',
				twitter_username: 'string',
				public_repos: 12,
				public_gists: 12,
				followers: 12,
				following: 12,
				created_at: 'string',
				updated_at: 'string',
			}
		};
	
		const expectedResult = [
			{
				login: 'user5',
				commits: {
					total_commits_since_date: 852
				},
				email: 'user5@example.com'
			},{
				login: 'user2',
				commits: {
					total_commits_since_date: 785
				},
				email: 'user2@example.com'
			},{
				login: 'user3',
				commits: {
					total_commits_since_date: 453
				},
				email: 'user3@example.com'
			},{
				login: 'user4',
				commits: {
					total_commits_since_date: 230
				},
				email: 'user4@example.com'
			},{
				login: 'user1',
				commits: {
					total_commits_since_date: 23
				},
				email: 'user1@example.com'
			}
		];
	
		githubApiSpy.searchUsersSpy.mockResolvedValueOnce(searchUsersApiResponse);
	
		githubApiSpy.getNumberOfCommitsSinceDateSpy.mockResolvedValueOnce(getCommitsApiResponse1);
		githubApiSpy.getNumberOfCommitsSinceDateSpy.mockResolvedValueOnce(getCommitsApiResponse2);
		githubApiSpy.getNumberOfCommitsSinceDateSpy.mockResolvedValueOnce(getCommitsApiResponse3);
		githubApiSpy.getNumberOfCommitsSinceDateSpy.mockResolvedValueOnce(getCommitsApiResponse4);
		githubApiSpy.getNumberOfCommitsSinceDateSpy.mockResolvedValueOnce(getCommitsApiResponse5);
	
		githubApiSpy.getUserSpy.mockResolvedValueOnce(getUserApiResponse1);
		githubApiSpy.getUserSpy.mockResolvedValueOnce(getUserApiResponse2);
		githubApiSpy.getUserSpy.mockResolvedValueOnce(getUserApiResponse3);
		githubApiSpy.getUserSpy.mockResolvedValueOnce(getUserApiResponse4);
		githubApiSpy.getUserSpy.mockResolvedValueOnce(getUserApiResponse5);

		const language = 'javascript';
		const type = 'users';
		const location = 'Brazil';
		const sinceDate = '2022-01-01';
		const pages = 1;

		const result = await service.searchAndSortUsers(language, type, location, undefined, sinceDate, pages);

		const queryObj= {
			q: `language:${language} type:${type}`,
			sort: ''
		};

		if(location){
			queryObj.q += ` location:${location}`;
		}

		const params = new URLSearchParams(queryObj).toString();

		expect(result).toEqual(expectedResult);

		expect(githubApiSpy.searchUsersSpy).toHaveBeenCalledWith(params, pages);

		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).toHaveBeenNthCalledWith(1, getUserApiResponse1.data.login, sinceDate);
		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).toHaveBeenNthCalledWith(2, getUserApiResponse2.data.login, sinceDate);
		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).toHaveBeenNthCalledWith(3, getUserApiResponse3.data.login, sinceDate);
		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).toHaveBeenNthCalledWith(4, getUserApiResponse4.data.login, sinceDate);
		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).toHaveBeenNthCalledWith(5, getUserApiResponse5.data.login, sinceDate);

		expect(githubApiSpy.getUserSpy).toHaveBeenNthCalledWith(1, getUserApiResponse1.data.login);
		expect(githubApiSpy.getUserSpy).toHaveBeenNthCalledWith(2, getUserApiResponse2.data.login);
		expect(githubApiSpy.getUserSpy).toHaveBeenNthCalledWith(3, getUserApiResponse3.data.login);
		expect(githubApiSpy.getUserSpy).toHaveBeenNthCalledWith(4, getUserApiResponse4.data.login);
		expect(githubApiSpy.getUserSpy).toHaveBeenNthCalledWith(5, getUserApiResponse5.data.login);
		
	});

	it('should be able to return a list of users sorted by number of commits with empty/undefined sinceDate', async () => {
		const searchUsersApiResponse = [
			{
				login: 'user1'
			},{
				login: 'user2'
			},{
				login: 'user3'
			},{
				login: 'user4'
			},{
				login: 'user5'
			}
		];
	
		const getCommitsApiResponse1 = {
			status: 200,
			headers: {
				'x-ratelimit-remaining': 5
			},
			data: {
				total_count: 23,
				incomplete_results: false,
				items: []
			}
		};
		const getCommitsApiResponse2 = {
			status: 200,
			headers: {
				'x-ratelimit-remaining': 5
			},
			data: {
				total_count: 785,
				incomplete_results: false,
				items: []
			}
		};
		const getCommitsApiResponse3 = {
			status: 200,
			headers: {
				'x-ratelimit-remaining': 5
			},
			data: {
				total_count: 453,
				incomplete_results: false,
				items: []
			}
		};
		const getCommitsApiResponse4 = {
			status: 200,
			headers: {
				'x-ratelimit-remaining': 5
			},
			data: {
				total_count: 230,
				incomplete_results: false,
				items: []
			}
		};
		const getCommitsApiResponse5 = {
			status: 200,
			headers: {
				'x-ratelimit-remaining': 5
			},
			data: {
				total_count: 852,
				incomplete_results: false,
				items: []
			}
		};
	
		const getUserApiResponse1 = {
			status: 200,
			data: {
				login: 'user1',
				id: 111,
				node_id: 'string',
				avatar_url: 'string',
				gravatar_id: 'string',
				url: 'string',
				html_url: 'string',
				followers_url: 'string',
				following_url: 'string',
				gists_url: 'string',
				starred_url: 'string',
				subscriptions_url: 'string',
				organizations_url: 'string',
				repos_url: 'string',
				events_url: 'string',
				received_events_url: 'string',
				type: 'string',
				site_admin: false,
				name: 'string',
				company: 'string',
				blog: 'string',
				location: 'string',
				email: 'user1@example.com',
				hireable: false,
				bio: 'string',
				twitter_username: 'string',
				public_repos: 12,
				public_gists: 12,
				followers: 12,
				following: 12,
				created_at: 'string',
				updated_at: 'string',
			}
		};
		const getUserApiResponse2 = {
			status: 200,
			data: {
				login: 'user2',
				id: 222,
				node_id: 'string',
				avatar_url: 'string',
				gravatar_id: 'string',
				url: 'string',
				html_url: 'string',
				followers_url: 'string',
				following_url: 'string',
				gists_url: 'string',
				starred_url: 'string',
				subscriptions_url: 'string',
				organizations_url: 'string',
				repos_url: 'string',
				events_url: 'string',
				received_events_url: 'string',
				type: 'string',
				site_admin: false,
				name: 'string',
				company: 'string',
				blog: 'string',
				location: 'string',
				email: 'user2@example.com',
				hireable: false,
				bio: 'string',
				twitter_username: 'string',
				public_repos: 12,
				public_gists: 12,
				followers: 12,
				following: 12,
				created_at: 'string',
				updated_at: 'string',
			}
		};
		const getUserApiResponse3 = {
			status: 200,
			data: {
				login: 'user3',
				id: 333,
				node_id: 'string',
				avatar_url: 'string',
				gravatar_id: 'string',
				url: 'string',
				html_url: 'string',
				followers_url: 'string',
				following_url: 'string',
				gists_url: 'string',
				starred_url: 'string',
				subscriptions_url: 'string',
				organizations_url: 'string',
				repos_url: 'string',
				events_url: 'string',
				received_events_url: 'string',
				type: 'string',
				site_admin: false,
				name: 'string',
				company: 'string',
				blog: 'string',
				location: 'string',
				email: 'user3@example.com',
				hireable: false,
				bio: 'string',
				twitter_username: 'string',
				public_repos: 12,
				public_gists: 12,
				followers: 12,
				following: 12,
				created_at: 'string',
				updated_at: 'string',
			}
		};
		const getUserApiResponse4 = {
			status: 200,
			data: {
				login: 'user4',
				id: 444,
				node_id: 'string',
				avatar_url: 'string',
				gravatar_id: 'string',
				url: 'string',
				html_url: 'string',
				followers_url: 'string',
				following_url: 'string',
				gists_url: 'string',
				starred_url: 'string',
				subscriptions_url: 'string',
				organizations_url: 'string',
				repos_url: 'string',
				events_url: 'string',
				received_events_url: 'string',
				type: 'string',
				site_admin: false,
				name: 'string',
				company: 'string',
				blog: 'string',
				location: 'string',
				email: 'user4@example.com',
				hireable: false,
				bio: 'string',
				twitter_username: 'string',
				public_repos: 12,
				public_gists: 12,
				followers: 12,
				following: 12,
				created_at: 'string',
				updated_at: 'string',
			}
		};
		const getUserApiResponse5 = {
			status: 200,
			data: {
				login: 'user5',
				id: 555,
				node_id: 'string',
				avatar_url: 'string',
				gravatar_id: 'string',
				url: 'string',
				html_url: 'string',
				followers_url: 'string',
				following_url: 'string',
				gists_url: 'string',
				starred_url: 'string',
				subscriptions_url: 'string',
				organizations_url: 'string',
				repos_url: 'string',
				events_url: 'string',
				received_events_url: 'string',
				type: 'string',
				site_admin: false,
				name: 'string',
				company: 'string',
				blog: 'string',
				location: 'string',
				email: 'user5@example.com',
				hireable: false,
				bio: 'string',
				twitter_username: 'string',
				public_repos: 12,
				public_gists: 12,
				followers: 12,
				following: 12,
				created_at: 'string',
				updated_at: 'string',
			}
		};
	
		const expectedResult = [
			{
				login: 'user5',
				commits: {
					total_commits_since_date: 852
				},
				email: 'user5@example.com'
			},{
				login: 'user2',
				commits: {
					total_commits_since_date: 785
				},
				email: 'user2@example.com'
			},{
				login: 'user3',
				commits: {
					total_commits_since_date: 453
				},
				email: 'user3@example.com'
			},{
				login: 'user4',
				commits: {
					total_commits_since_date: 230
				},
				email: 'user4@example.com'
			},{
				login: 'user1',
				commits: {
					total_commits_since_date: 23
				},
				email: 'user1@example.com'
			}
		];
	
		githubApiSpy.searchUsersSpy.mockResolvedValueOnce(searchUsersApiResponse);
	
		githubApiSpy.getNumberOfCommitsSinceDateSpy.mockResolvedValueOnce(getCommitsApiResponse1);
		githubApiSpy.getNumberOfCommitsSinceDateSpy.mockResolvedValueOnce(getCommitsApiResponse2);
		githubApiSpy.getNumberOfCommitsSinceDateSpy.mockResolvedValueOnce(getCommitsApiResponse3);
		githubApiSpy.getNumberOfCommitsSinceDateSpy.mockResolvedValueOnce(getCommitsApiResponse4);
		githubApiSpy.getNumberOfCommitsSinceDateSpy.mockResolvedValueOnce(getCommitsApiResponse5);
	
		githubApiSpy.getUserSpy.mockResolvedValueOnce(getUserApiResponse1);
		githubApiSpy.getUserSpy.mockResolvedValueOnce(getUserApiResponse2);
		githubApiSpy.getUserSpy.mockResolvedValueOnce(getUserApiResponse3);
		githubApiSpy.getUserSpy.mockResolvedValueOnce(getUserApiResponse4);
		githubApiSpy.getUserSpy.mockResolvedValueOnce(getUserApiResponse5);

		const language = 'javascript';
		const type = 'users';
		const location = 'Brazil';
		const sort = 'followers';
		const pages = 1;

		const result = await service.searchAndSortUsers(language, type, location, sort, undefined, pages);

		const queryObj= {
			q: `language:${language} type:${type}`,
			sort: ''
		};

		if(location){
			queryObj.q += ` location:${location}`;
		}

		if(sort){
			queryObj.sort = sort;
		}

		const params = new URLSearchParams(queryObj).toString();

		expect(result).toEqual(expectedResult);

		expect(githubApiSpy.searchUsersSpy).toHaveBeenCalledWith(params, pages);

		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).toHaveBeenNthCalledWith(1, getUserApiResponse1.data.login, `${new Date().getFullYear()}-01-01`);
		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).toHaveBeenNthCalledWith(2, getUserApiResponse2.data.login, `${new Date().getFullYear()}-01-01`);
		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).toHaveBeenNthCalledWith(3, getUserApiResponse3.data.login, `${new Date().getFullYear()}-01-01`);
		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).toHaveBeenNthCalledWith(4, getUserApiResponse4.data.login, `${new Date().getFullYear()}-01-01`);
		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).toHaveBeenNthCalledWith(5, getUserApiResponse5.data.login, `${new Date().getFullYear()}-01-01`);

		expect(githubApiSpy.getUserSpy).toHaveBeenNthCalledWith(1, getUserApiResponse1.data.login);
		expect(githubApiSpy.getUserSpy).toHaveBeenNthCalledWith(2, getUserApiResponse2.data.login);
		expect(githubApiSpy.getUserSpy).toHaveBeenNthCalledWith(3, getUserApiResponse3.data.login);
		expect(githubApiSpy.getUserSpy).toHaveBeenNthCalledWith(4, getUserApiResponse4.data.login);
		expect(githubApiSpy.getUserSpy).toHaveBeenNthCalledWith(5, getUserApiResponse5.data.login);
		
	});

	it('should not be able to return a list of users sorted by number of commits with empty/undefined language', async () => {
		const type = 'users';
		const location = 'Brazil';
		const sort = 'followers';
		const sinceDate = '2022-01-01';
		const pages = 1;

		expect(service.searchAndSortUsers(undefined, type, location, sort, sinceDate, pages)).rejects.toThrow();

		expect(githubApiSpy.searchUsersSpy).not.toHaveBeenCalled();
		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).not.toHaveBeenCalled();

		expect(githubApiSpy.getUserSpy).not.toHaveBeenCalled();
		
	});

	it('should not be able to return a list of users sorted by number of commits with empty/undefined type', async () => {
		const language = 'javascript';
		const location = 'Brazil';
		const sort = 'followers';
		const sinceDate = '2022-01-01';
		const pages = 1;

		expect(service.searchAndSortUsers(language, undefined, location, sort, sinceDate, pages)).rejects.toThrow();

		expect(githubApiSpy.searchUsersSpy).not.toHaveBeenCalled();
		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).not.toHaveBeenCalled();

		expect(githubApiSpy.getUserSpy).not.toHaveBeenCalled();
		
	});

	it('should not be able to return a list of users sorted by number of commits with empty/undefined pages', async () => {
		const language = 'javascript';
		const type = 'users';
		const location = 'Brazil';
		const sort = 'followers';
		const sinceDate = '2022-01-01';

		expect(service.searchAndSortUsers(language, type, location, sort, sinceDate, undefined)).rejects.toThrow();

		expect(githubApiSpy.searchUsersSpy).not.toHaveBeenCalled();
		expect(githubApiSpy.getNumberOfCommitsSinceDateSpy).not.toHaveBeenCalled();

		expect(githubApiSpy.getUserSpy).not.toHaveBeenCalled();
		
	});
});