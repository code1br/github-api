import Cryptr from 'cryptr';
import { Request, Response, NextFunction } from 'express'
import { verify } from "jsonwebtoken";
import { UserModel } from '../model/user-model'
import { client } from '../prisma/client';

let CURRENT_USER: UserModel = {
	login: '',
	PAT: ''
}

async function ensureAuthentication(req: Request, res: Response, next: NextFunction) {
	const headerAuth = req.headers.authorization;
	const token = headerAuth && headerAuth.split(" ")[1]

	if(!token){
		return res.status(401).json({
			message: "Token is missing"
		});
	}

	try{
		const jwt_secret = process.env.JWT_SECRET || ''
		verify(token, jwt_secret)

		const user = await client.user.findFirst({
            where: {
				token
			}
		})

		const cryptr = new Cryptr(process.env.CRYPTR_SECRET || 'default')

		const decryptedPat = cryptr.decrypt(user?.pat || '')

		CURRENT_USER.login = user?.username || ''
		CURRENT_USER.PAT = decryptedPat || ''

		next()
	}catch(error){
		return res.status(401).json({
			message: "Insert a valid token!"
		})
	}

}

async function clearCurrentUser() {
	CURRENT_USER.login = ''
	CURRENT_USER.PAT = ''
}

export { ensureAuthentication, clearCurrentUser }
export { CURRENT_USER }