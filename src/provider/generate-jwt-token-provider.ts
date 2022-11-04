import { sign } from 'jsonwebtoken'

class GenerateJwtTokenProvider {
	execute(username: string) {
		const token = sign({}, process.env.JWT_SECRET || 'default', {
			subject: username,
			expiresIn: '3600s',
		})

		return token
	}
}

export { GenerateJwtTokenProvider }
