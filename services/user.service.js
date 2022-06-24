const UserModel = require("./../models/user.model")
const UserDto = require("./../dtos/user")
const bcrypt = require("bcrypt")
const tokenService = require("./token.service")

class UserService {
  async login(username, password) {
    const user = await UserModel.findOne({ email: username })
    if (!user) {
      throw new Error("User doesnt exist")
      // throw new ApiError.BadRequest('Not found')
    }
    const isPassEqual = await bcrypt.compare(password, user.password)
    if (!isPassEqual) {
      throw new Error("Password is not correct")
      // throw ApiError.BadRequest((' неверный пароль '))
    }
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens(userDto)

    return {
      ...tokens,
      user: userDto,
    }
  }

  async registration(email, password) {
    const candidate = await UserModel.findOne({ email })

    if (candidate) {
      throw new Error("User already exists")
      // throw ApiError.BadRequest(`пользователь с адресом ${email} уже существует`)
    }
    const hashPassword = await bcrypt.hash(password, 3)
    const user = await UserModel.create({ email, password: hashPassword })
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    return {
      ...tokens,
      user: userDto,
    }
  }
}

module.exports = new UserService()
