import { AxiosResponse } from 'axios';
import { GithubCommitModel, GithubSearchCommitsModel } from '../model/commit-model';
import { GithubPullModel } from '../model/pull-model';
import { GithubRepositoryModel } from '../model/repository-model';
import { GithubUserModel, UserSearchModel } from '../model/user-model';

export interface GitHubApi {
	checkUserCredentials: (username: string, pat: string) => Promise<AxiosResponse<GithubUserModel, unknown>>
	followUser: (userToFollow: string) => Promise<AxiosResponse<unknown, unknown>>
	unfollowUser: (userToFollow: string) => Promise<AxiosResponse<unknown, unknown>>
	listRepositories: () => Promise<GithubRepositoryModel[]>
	getRepositoryCommits: (owner: string, repositoryName: string) => Promise<GithubCommitModel[]>
	getRepositoryPulls: (owner: string, repositoryName: string) => Promise<GithubPullModel[]>
	getUsedLanguages: (owner: string, repositoryName: string) => Promise<AxiosResponse<unknown, unknown>>
	getUser: (username: string) => Promise<AxiosResponse<GithubUserModel, unknown>>
	searchUsers: (params: string, pages: number) => Promise<UserSearchModel[]>
	getNumberOfCommitsSinceBegining: (username: string) => Promise<AxiosResponse<GithubSearchCommitsModel, unknown>>
	getNumberOfCommitsSinceDate: (username: string, startDate: string) => Promise<AxiosResponse<GithubSearchCommitsModel, unknown>>
}