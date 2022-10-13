import { Request, Response, NextFunction } from 'express'
import { Buffer } from 'buffer'
import { githubApi } from '../config/github-api-config'
import { UserModel } from '../model/user-model'

let CURRENT_USER: UserModel = {
	login: '',
	PAT: ''
}

async function Authenticate(req: Request, res: Response, next: NextFunction) {
	const headerAuth = req.headers.["authorization"];
	const token = headerAuth && headerAuth.split(" ")[1];

	if(!token){
		return res.status(401).json({
			message: "Access denied"
		});
	}

	try{
		const jwt_secret = process.env.JWT_SECRET;
		jwt.verify(token, jwt_secret);
		next();
	}catch(error){
		return res.status(500).json({
			message: "Insert a valid token!"
		});
	}


// 	if (headerAuth) {
// 		const auth = Buffer.from(headerAuth.split(' ')[1], 'base64').toString()

// 		const login = auth.split(':')[0]
// 		const token = auth.split(':')[1]

// 		try {
// 			const result = await githubApi.get('/user', {
// 				auth: {
// 					username: login,
// 					password: token
// 				}
// 			})

// 			CURRENT_USER.login = login
// 			CURRENT_USER.PAT = token

// 			return next()
// 		} catch (err) {
// 			res.status(401).send(`Error while authenticating: ${err}`)
// 		}

// 	} else {
// 		res.status(401).send(`Basic auth required`)
// 	}

// }

export { Authenticate }
export { CURRENT_USER }