import 'dotenv/config'

const server_host = process.env.SERVER_HOST || 'localhost'
const server_port = parseInt(process.env.SERVER_PORT || '6060')

export default {
	"openapi": "3.0.0",
	"info": {
		"title": "Github data manipulation API",
		"description": "This API manipulates the some endpoints of Github restfull API",
		"contact":{
			"name": "Eliezer Marques Mafra",
			"email": "eliezermmafra@live.com"
		},
		"version": "1.0.0"
	},
	"servers": [
		{
			"url": `http://${server_host}:${server_port}`,
			"description": "Test API"
		}
	],
	"paths": {
		"/users/following/{username}":{
			"put": {
				"summary": "Follow the username given in the param",
				"description": "This route/method follow the username given in the param",
				"security": [{ "basicAuth": [] }],
				"tags": ["Following"],
				"parameters": [
					{
						"in": "path",
						"name": "username",
						"description": "username to follow",
						"required": true
					}
				],
				"responses": {
					"204": {
						"description": "No Content: Request was sent to Github API"
					},
					"400": {
						"description": "Bad Request: It was not possible to follow the given user"
					}
				}
			},
			"delete": {
				"summary": "Unfollow the username given in the param",
				"description": "This route/method unfollow the username given in the param",
				"security": [{ "basicAuth": [] }],
				"tags": ["Following"],
				"parameters": [
					{
						"in": "path",
						"name": "username",
						"description": "username to unfollow",
						"required": true
					}
				],
				"responses": {
					"204": {
						"description": "No Content: Request was sent to Github API"
					},
					"400": {
						"description": "Bad Request: It was not possible to unfollow the given user"
					}
				}
			}
		}
	},
	"components": {
		"securitySchemes": {
			"basicAuth": { "type": "http", "scheme": "basic" }
		  }
	}
}