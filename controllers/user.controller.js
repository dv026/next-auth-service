const TokenService = require("../services/token.service")
const userService = require("../services/user.service")
const errorHandler = require("../utils/error-handler")

class UserController {
  async login(req, res, next) {
    console.log("login")
    try {
      const { username, password } = req.body
      const userData = await userService.login(username, password)
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      res.cookie("accessToken", userData.accessToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: false,
        sameSite: "none",
        secure: true,
      })
      return res.json(userData.user)
    } catch (e) {
      return res.json(e)
    }
  }

  async checkAuth(req, res) {
    try {
      console.log("headers", req.headers)
      console.log("accessToken", req.headers["authentication"].split(" ")[1])
      const accessToken = req.headers["authentication"].split(" ")[1]
      if (accessToken) {
        const data = TokenService.verifyAccessToken(accessToken)
        return res.json(data)
      }
      return req.status(401).end()
    } catch (e) {
      return res.status(401).end()
    }
  }

  async registration(req, res, next) {
    try {
      const { username, password } = req.body
      const userData = await userService.registration(username, password)
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      res.cookie("accessToken", userData.accessToken, {
        httpOnly: false,
        sameSite: "none",
        secure: true,
      })
      return res.json(userData.user)
    } catch (e) {
      errorHandler(res, e)
    }
  }

  async logout(req, res) {
    res.clearCookie("refreshToken")
    return res.status(200).end()
  }

  async refresh(req, res) {
    try {
      console.log("refresh start")
      const refreshToken = req.cookies.refreshToken
      console.log("refresh token", refreshToken)
      if (!refreshToken) throw new Error("refresh token expires")
      const data = TokenService.verifyRefreshToken(refreshToken)

      if (!data) {
        throw new Error("token does not contain inf")
      }
      console.log("refresh token verified")
      const tokens = TokenService.generateTokens(data.user)
      res.cookie("accessToken", tokens.accessToken, {
        httpOnly: false,
        sameSite: "none",
        secure: true,
        maxAge: 30 * 24 * 60,
      })
      // res.headers["access-control?expose-headers"] = "Set-Cookie"
      res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      console.log("before return")
      console.log(data.user)
      return res.json({
        user: data.user,
      })
    } catch (e) {
      return res.status(501).end()
    }
  }
}

module.exports = new UserController()
