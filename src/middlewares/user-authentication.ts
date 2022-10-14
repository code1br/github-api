import Cryptr from 'cryptr';
import { Request, Response, NextFunction } from 'express'
import { verify } from "jsonwebtoken";
import { UserModel } from '../model/user-model'
import { client } from '../prisma/client';

let CURRENT_USER: UserModel = {
	login: '',
	PAT: ''
}

async function Authenticate(req: Request, res: Response, next: NextFunction) {
	const headerAuth = req.headers.authorization;
	const token = headerAuth && headerAuth.split(" ")[1]

	if(!token){
		return res.status(401).json({
			message: "Access denied"
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

		const cryptr = new Cryptr(process.env.CRYPTR_SECRET || '')

		const decryptedPat = cryptr.decrypt(user?.password || '')

		CURRENT_USER.login = user?.username || ''
		CURRENT_USER.PAT = decryptedPat || ''

		next()
	}catch(error){
		return res.status(500).json({
			message: "Insert a valid token!"
		})
	}

}

export { Authenticate }
export { CURRENT_USER }