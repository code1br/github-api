export interface UserModel {
	login: string,
	PAT: string
}

export interface GithubUserModel {
	login: string,
	id: number,
	node_id: string,
	avatar_url: string,
	gravatar_id: string,
	url: string,
	html_url: string,
	followers_url: string,
	following_url: string,
	gists_url: string,
	starred_url: string,
	subscriptions_url: string,
	organizations_url: string,
	repos_url: string,
	events_url: string,
	received_events_url: string,
	type: string,
	site_admin: boolean,
	name: string,
	company: string,
	blog: string,
	location: string,
	email: string,
	hireable: boolean,
	bio: string,
	twitter_username: string,
	public_repos: number,
	public_gists: number,
	followers: number,
	following: number,
	created_at: string,
	updated_at: string,
}

export interface GithubSearchUserModel {
	login: string,
	id: number,
	node_id: string,
	avatar_url: string,
	gravatar_id: string,
	url: string,
	html_url: string,
	followers_url: string,
	following_url: string,
	gists_url: string,
	starred_url: string,
	subscriptions_url: string,
	organizations_url: string,
	repos_url: string,
	events_url: string,
	received_events_url: string,
	type: string,
	site_admin: boolean,
	score: number,
	commits?:{
		commits_in_current_year: number,
		total_commits: number
	}
}

export interface UserSearchModel {
	login: string,
	email?: string,
	commits:{
		total_commits_since_date: number
	}
}