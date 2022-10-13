import { sign } from 'jsonwebtoken';

class GenerateTokenProvider {
  async execute(username: string) {
    const token = sign({}, process.env.JWT_SECRET || '', {
      subject: username,
      expiresIn: '1200s',
    })

    return token
  }
}

export { GenerateTokenProvider };
