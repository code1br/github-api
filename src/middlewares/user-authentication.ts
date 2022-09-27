import { Request, Response, NextFunction } from 'express'
import { Buffer } from 'buffer'
import { githubApi } from '../config/github-api'
import { UserModel } from '../model/user-model'

let CURRENT_USER: UserModel = {
	username: '',
	PAT: ''
}

async function Authenticate(req: Request, res: Response, next: NextFunction){
	const headerAuth = req.headers.authorization

	if(headerAuth){
		const auth = Buffer.from(headerAuth.split(' ')[1], 'base64').toString()

		const username = auth.split(':')[0]
		const token = auth.split(':')[1]

		try{
			await githubApi.get('/user', {
				auth:{
					username: username,
					password: token	
				}
			})

			CURRENT_USER.username = username
			CURRENT_USER.PAT = token

			return next()
		}catch(err){
			res.status(401).send(`Error while authenticating: ${err}`)
		}

	}else{
		res.status(401).send(`Basic auth required`)
	}

}

export { Authenticate }
export { CURRENT_USER }