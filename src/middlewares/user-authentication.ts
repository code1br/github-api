import { Request, Response, NextFunction } from 'express'
import { verify } from "jsonwebtoken";
import { UserModel } from '../model/user-model'

let CURRENT_USER: UserModel = {
	login: '',
	PAT: ''
}

async function Authenticate(req: Request, res: Response, next: NextFunction) {
	const headerAuth = req.headers.authorization;
	const token = headerAuth && headerAuth.split(" ")[1];

	if(!token){
		return res.status(401).json({
			message: "Access denied"
		});
	}

	try{
		const jwt_secret = process.env.JWT_SECRET || ''
		verify(token, jwt_secret);
		next();
	}catch(error){
		return res.status(500).json({
			message: "Insert a valid token!"
		});
	}

}

export { Authenticate }
export { CURRENT_USER }