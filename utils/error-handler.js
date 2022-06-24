module.exports = (res, error) => {
  res.status(error.status ?? 500).json({ message: error.message ?? error })
}
