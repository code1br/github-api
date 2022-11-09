import 'dotenv/config';

const server_host = process.env.SERVER_HOST || 'localhost';

export default {
	'openapi': '3.0.0',
	'info': {
		'title': 'Github data manipulation API',
		'description': 'This API manipulates the some endpoints of Github restfull API, remember to authenticate yourself with your username and PAT from Github.com',
		'contact': {
			'name': 'Eliezer Marques Mafra',
			'email': 'eliezermmafra@live.com'
		},
		'version': '1.0.0'
	},
	'servers': [
		{
			'url': `${server_host}`,
			'description': 'Test API'
		}
	],
	'paths': {
		'/user/login': {
			'post': {
				'summary': 'Authenticate and get JWT token',
				'description': 'This route/method authenticates and gets the JWT token',
				'tags': ['Login'],
				'requestBody': {
					'content': {
						'application/json': {
							'schema': {
								'$ref': '#/components/schemas/Login'
							},
							'examples': {
								'Model': {
									'value': {
										'username': '<USERNAME HERE>',
										'pat': '<PAT HERE>'
									}
								}
							}
						}
					}
				},
				'responses': {
					'200': {
						'description': 'OK: Repositories returned successfully',
						'content': {
							'application/json': {
								'schema': {
									'type': 'object',
									'$ref': '#/components/schemas/Login'
								}
							}
						}
					},
					'400': {
						'description': 'Bad Request: It was not possible to follow the given user'
					},
					'401': {
						'description': 'Unauthorized: Error on authentication'
					}
				}
			}
		},
		'/users/following/{username}': {
			'put': {
				'summary': 'Follow the username given in the param',
				'description': 'This route/method follow the username given in the param',
				'security': [{ 'bearerAuth': [] }],
				'tags': ['Following'],
				'parameters': [
					{
						'in': 'path',
						'name': 'username',
						'description': 'username to follow',
						'required': true
					}
				],
				'responses': {
					'204': {
						'description': 'No Content: Request was sent to Github API'
					},
					'400': {
						'description': 'Bad Request: It was not possible to follow the given user'
					},
					'401': {
						'description': 'Unauthorized: Error on authentication'
					}
				}
			},
			'delete': {
				'summary': 'Unfollow the username given in the param',
				'description': 'This route/method unfollow the username given in the param',
				'security': [{ 'bearerAuth': [] }],
				'tags': ['Following'],
				'parameters': [
					{
						'in': 'path',
						'name': 'username',
						'description': 'username to unfollow',
						'required': true
					}
				],
				'responses': {
					'204': {
						'description': 'No Content: Request was sent to Github API'
					},
					'400': {
						'description': 'Bad Request: It was not possible to unfollow the given user'
					},
					'401': {
						'description': 'Unauthorized: Error on authentication'
					}
				}
			},
			'get': {
				'summary': 'Get the username given in the param',
				'description': 'This route/method get the username given in the param',
				'security': [{ 'bearerAuth': [] }],
				'tags': ['Following'],
				'parameters': [
					{
						'in': 'path',
						'name': 'username',
						'description': 'username to get',
						'required': true
					}
				],
				'responses': {
					'200': {
						'description': 'No Content: Request was sent to Github API',
						'content': {
							'application/json': {
								'schema': {
									'type': 'object',
									'$ref': '#/components/schemas/User'
								}
							}
						}
					},
					'400': {
						'description': 'Bad Request: It was not possible to unfollow the given user'
					},
					'401': {
						'description': 'Unauthorized: Error on authentication'
					}
				}
			}
		},
		'/user/repositories': {
			'get': {
				'summary': 'Get the authenticated user\'s repositories',
				'description': 'This route/method gets the authenticated user\'s private and public repositories',
				'security': [{ 'bearerAuth': [] }],
				'tags': ['Stats'],
				'responses': {
					'200': {
						'description': 'OK: Repositories returned successfully',
						'content': {
							'application/json': {
								'schema': {
									'type': 'object',
									'$ref': '#/components/schemas/Repository'
								}
							}
						}
					},
					'400': {
						'description': 'Bad Request: It was not possible to follow the given user'
					},
					'401': {
						'description': 'Unauthorized: Error on authentication'
					}
				}
			}
		},
		'/user/stars': {
			'get': {
				'summary': 'Get the authenticated user\'s repositories stars',
				'description': 'This route/method gets the authenticated user\'s repositories stars',
				'security': [{ 'bearerAuth': [] }],
				'tags': ['Stats'],
				'responses': {
					'200': {
						'description': 'OK: Stars sum returned successfully',
						'content': {
							'application/json': {
								'schema': {
									'type': 'object',
									'$ref': '#/components/schemas/Stars'
								}
							}
						}
					},
					'400': {
						'description': 'Bad Request: It was not possible to get the number of stars'
					},
					'401': {
						'description': 'Unauthorized: Error on authentication'
					}
				}
			}
		},
		'/user/commits': {
			'get': {
				'summary': 'Get the authenticated user\'s summed commits',
				'description': 'This route/method gets the authenticated user\'s summed commits in public and private repositories',
				'security': [{ 'bearerAuth': [] }],
				'tags': ['Stats'],
				'responses': {
					'200': {
						'description': 'OK: Commits sum returned successfully',
						'content': {
							'application/json': {
								'schema': {
									'type': 'object',
									'$ref': '#/components/schemas/Commits'
								}
							}
						}
					},
					'400': {
						'description': 'Bad Request: It was not possible to get the number of commits'
					},
					'401': {
						'description': 'Unauthorized: Error on authentication'
					}
				}
			}
		},
		'/user/pulls': {
			'get': {
				'summary': 'Get the authenticated user\'s summed pulls',
				'description': 'This route/method gets the authenticated user\'s summed pulls in public and private repositories',
				'security': [{ 'bearerAuth': [] }],
				'tags': ['Stats'],
				'responses': {
					'200': {
						'description': 'OK: Pulls sum returned successfully',
						'content': {
							'application/json': {
								'schema': {
									'type': 'object',
									'$ref': '#/components/schemas/Pulls'
								}
							}
						}
					},
					'400': {
						'description': 'Bad Request: It was not possible to get the number of pulls'
					},
					'401': {
						'description': 'Unauthorized: Error on authentication'
					}
				}
			},
		},
		'/user/languages': {
			'get': {
				'summary': 'Get the authenticated user\'s used languages',
				'description': 'This route/method gets the authenticated user\'s used languages in public and private repositories',
				'security': [{ 'bearerAuth': [] }],
				'tags': ['Stats'],
				'responses': {
					'200': {
						'description': 'OK: Used languages returned successfully',
						'content': {
							'application/json': {
								'schema': {
									'type': 'object',
									'$ref': '#/components/schemas/Languages'
								},
								'examples': {
									'Response example': {
										'value': {
											'languageName1': 50,
											'languageName2': 20,
											'languageName3': 10,
											'languageName4': 20
										}
									}
								}
							}
						}
					},
					'400': {
						'description': 'Bad Request: It was not possible to get the used languages'
					},
					'401': {
						'description': 'Unauthorized: Error on authentication'
					}
				}
			}

		},
	},
	'components': {
		'schemas': {
			'Repository': {
				'type': 'array',
				'items': {
					'type': 'object',
					'properties': {
						'name': { 'type': 'string' },
						'owner': { 'type': 'string' },
						'private': { 'type': 'boolean' }
					}
				}
			},
			'Stars': {
				'type': 'object',
				'properties': {
					'stars': { 'type': 'number' }

				}
			},
			'User': {
				'type': 'object',
				'properties': {
					'login': { 'type': 'string' },
					'id': { 'type': 'number' },
					'node_id': { 'type': 'string' },
					'avatar_url': { 'type': 'string' },
					'gravatar_id': { 'type': 'string' },
					'url': { 'type': 'string' },
					'html_url': { 'type': 'string' },
					'followers_url': { 'type': 'string' },
					'following_url': { 'type': 'string' },
					'gists_url': { 'type': 'string' },
					'starred_url': { 'type': 'string' },
					'subscriptions_url': { 'type': 'string' },
					'organizations_url': { 'type': 'string' },
					'repos_url': { 'type': 'string' },
					'events_url': { 'type': 'string' },
					'received_events_url': { 'type': 'string' },
					'type': { 'type': 'string' },
					'site_admin': { 'type': 'boolean' },
					'name': { 'type': 'string' },
					'company': { 'type': 'string' },
					'blog': { 'type': 'string' },
					'location': { 'type': 'string' },
					'email': { 'type': 'string' },
					'hireable': { 'type': 'boolean' },
					'bio': { 'type': 'string' },
					'twitter_username': { 'type': 'string' },
					'public_repos': { 'type': 'number' },
					'public_gists': { 'type': 'number' },
					'followers': { 'type': 'number' },
					'following': { 'type': 'number' },
					'created_at': { 'type': 'string' },
					'updated_at': { 'type': 'string' },
				}
			},
			'Login': {
				'type': 'object',
				'properties': {
					'username': { 'type': 'string' },
					'pat': { 'type': 'string' }
				}
			},
			'Commits': {
				'type': 'object',
				'properties': {
					'commits_in_current_year': { 'type': 'number' },
					'total_commits': { 'type': 'number' }
				}

			},
			'Pulls': {
				'type': 'object',
				'properties': {
					'pulls_in_current_year': { 'type': 'number' },
					'total_pulls': { 'type': 'number' }
				}

			},
			'Languages': {
				'type': 'object',
				'additionalProperties': {
					'type': 'number'
				}

			},
		},
		'securitySchemes': {
			'bearerAuth': { 'type': 'http', 'scheme': 'bearer', 'bearerFormat': 'JWT' }
		}
	}

};