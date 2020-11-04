module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'board',
      externals: {
        react: 'React'
      }
    }
  }
}
