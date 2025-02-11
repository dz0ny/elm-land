
const { Files } = require("../files")
const { Utils, Terminal } = require("./_utils")

let printHelpInfo = () => {
  return {
    message: [
      '',
      Utils.intro.success(`detected the ${Terminal.green('help')} command`),
      `    Elm Land comes with a built-in development server powered`,
      `    by ${Terminal.cyan('Vite 3.0')}. ⚡️`,
      '',
      `    By design, the dev server doesn't have many configuration `,
      `    options, but you can provide the ${Terminal.pink('HOST')} or ${Terminal.pink('PORT')} environment`,
      `    variables for more advanced use cases.`,
      '',
    ].join('\n'),
    files: [],
    effects: []
  }
}

let run = async () => {

  let rawTextConfig = undefined
  try {
    rawTextConfig = await Files.readFromUserFolder('elm-land.json')
  } catch (_) {
    return Promise.reject(Utils.notInElmLandProject)
  }

  let config = {}
  try {
    config = JSON.parse(rawTextConfig)
  } catch (err) {
    // TODO: Warn user about invalid config JSON
  }

  let port = process.env.PORT || (config?.app?.server?.port || 1234)
  let host = process.env.HOST || (config?.app?.server?.host || '0.0.0.0')
  let proxy = config?.app?.server?.proxy || {}
  let formattedHost = host === '0.0.0.0' ? 'localhost' : host

  return {
    message: ({ port }) => [
      '',
      Utils.intro.success(`is ready at http://${formattedHost}:${port}`)
    ].join('\n'),
    files: [],
    effects: [
      { kind: 'generateHtml', config },
      { kind: 'runServer', options: { host, port, proxy } }
    ]
  }
}

module.exports = {
  Server: {
    run, printHelpInfo
  }
}