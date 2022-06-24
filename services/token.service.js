var jwt = require("jsonwebtoken")

class TokenService {
  static generateTokens(data) {
    console.log("generate token")
    // jwt.sign({
    //   data: 'foobar'
    // }, 'secret', { expiresIn: '1h' });
    const accessToken = jwt.sign(
      { user: data },
      process.env._AUTH_JWT_ACCESS_SECRET,
      {
        expiresIn: "24h",
      }
    )
    console.log(accessToken)
    const refreshToken = jwt.sign(
      { user: data },
      process.env.AUTH_JWT_REFRESH_SECRET,
      {
        expiresIn: "30d",
      }
    )
    return {
      accessToken,
      refreshToken,
    }
  }

  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.AUTH_JWT_ACCESS_SECRET)
    } catch (e) {
      throw new Error(e)
    }
  }

  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.AUTH_JWT_REFRESH_SECRET)
    } catch (e) {
      throw new Error(e)
    }
  }
}

module.exports = TokenService
