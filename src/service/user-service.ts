import { GitHubApi } from '../apis/github-api';
import { CURRENT_USER } from '../middlewares/user-authentication';
import { GithubCommitModel } from '../model/commit-model';
import { GithubPullModel } from '../model/pull-model';
import { GithubRepositoryModel, RepositoryModel } from '../model/repository-model';
import { UserModel } from '../model/user-model';

export class UserService {
	constructor(
		private GitHubApi: GitHubApi
	) { }

	async followUser(userToFollow: string) {
		if (!userToFollow) {
			throw new Error('UserToFollow was not provided');
		}

		const result = await this.GitHubApi.followUser(userToFollow);

		if (result.status != 204) {
			throw new Error(`Response status different from expected ${result.status}`);
		}
	}

	async unfollowUser(userToUnfollow: string) {
		if (!userToUnfollow) {
			throw new Error('Username was not provided');
		}

		const result = await this.GitHubApi.unfollowUser(userToUnfollow);


		if (result.status != 204) {
			throw new Error(`Response status different from expected ${result.status}`);
		}
	}

	async listRepositories() {
		const repositories: RepositoryModel[] = [];

		const githubRepositories: GithubRepositoryModel[] = await this.GitHubApi.listRepositories();

		for (const repository of githubRepositories) {
			repositories.push({
				name: repository.name,
				owner: repository.owner.login,
				private: repository.private
			});
		}

		return repositories;

	}

	async getNumberOfStars() {
		const githubRepositories: GithubRepositoryModel[] = await this.GitHubApi.listRepositories();

		let numberOfStars = 0;

		for (const repository of githubRepositories) {
			numberOfStars += repository.stargazers_count;
		}

		return { stars: numberOfStars };
	}

	async getNumberOfCommits() {
		const repositoriesToSearch: RepositoryModel[] = await this.listRepositories();

		let totalCommits = 0;
		let totalCommitsInCurrentYear = 0;

		const currentYear = new Date().getFullYear();

		for (const repository of repositoriesToSearch) {
			const commits: GithubCommitModel[] = await this.GitHubApi.getRepositoryCommits(repository.owner, repository.name);

			for (const commit of commits) {
				if (commit.author) {
					if (commit.author.login == CURRENT_USER.login) {
						totalCommits++;

						if (new Date(commit.commit.committer.date).getFullYear() == currentYear) {
							totalCommitsInCurrentYear++;
						}
					}
				}
			}

		}

		return {
			commits_in_current_year: totalCommitsInCurrentYear,
			total_commits: totalCommits
		};

	}

	async getNumberOfPulls() {
		const repositoriesToSearch: RepositoryModel[] = await this.listRepositories();

		let totalPulls = 0;
		let totalPullsInCurrentYear = 0;

		const currentYear = new Date().getFullYear();

		for (const repository of repositoriesToSearch) {
			const pulls: GithubPullModel[] = await this.GitHubApi.getRepositoryPulls(repository.owner, repository.name);

			for (const pull of pulls) {
				if (pull.user.login == CURRENT_USER.login) {
					totalPulls++;

					if (new Date(pull.created_at).getFullYear() == currentYear) {
						totalPullsInCurrentYear++;
					}
				}

			}
		}

		return {
			pulls_in_current_year: totalPullsInCurrentYear,
			total_pulls: totalPulls
		};

	}

	async getUsedLanguages() {
		type LanguageType = { [key: string]: number }

		const repositoriesToSearch: RepositoryModel[] = await this.listRepositories();

		const languagesBytesSize: LanguageType = {};

		const languagesPercentageUsage: LanguageType = {};

		let totalBytes = 0;

		for (const repository of repositoriesToSearch) {
			const result = await this.GitHubApi.getUsedLanguages(repository.owner, repository.name);
			const usedLanguages = result.data as LanguageType;

			if (result.status == 200) {
				Object.entries(usedLanguages).forEach(([key, value]) => {
					const newValue = languagesBytesSize[key] ? (languagesBytesSize[key] + value) : value;

					Object.assign(languagesBytesSize, { [key]: newValue });
				});
			}
		}

		Object.entries(languagesBytesSize).forEach(([key, value]) => {
			totalBytes += value;
		});

		Object.entries(languagesBytesSize).forEach(([key, value]) => {
			Object.assign(languagesPercentageUsage, { [key]: parseFloat((value * 100 / totalBytes).toFixed(2)) });
		});

		return languagesPercentageUsage;

	}

	async searchUser(username: string) {
		if (!username) {
			throw new Error('UserToSearch was not provided');
		}

		const result = await this.GitHubApi.searchUser(username);

		if (result.status != 200) {
			throw new Error(`Response status different from expected ${result.status}`);
		} else {
			return result.data;
		}
	}
}