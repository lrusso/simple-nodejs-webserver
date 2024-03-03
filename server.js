const http = require("http")
const fs = require("fs")

const ROOT_FOLDER = "/public"
const ERROR_FILE_NOT_FOUND = "File not found"

const args = process.argv?.slice(2)
const serverPort = args.length > 0 ? args[0] : 8080

const handleRequest = (req, res) => {
  const baseURL =
    (req.protocol ? req.protocol : "http") + "://" + req.headers.host + "/"
  const reqUrl = new URL(req.url, baseURL)

  // CHECKING IF THE REQUEST IS ASKING FOR A RANGE
  let dataRange = null
  if (req.headers.range) {
    try {
      dataRange = req.headers.range.match(/[0-9].*-.*[0-9]/g)[0].split("-")
      dataRange[0] = parseInt(dataRange[0])
      dataRange[1] = parseInt(dataRange[1]) + 1
    } catch (err) {
      //
    }
  }

  let fileName = reqUrl.pathname

  // IF THERE IS NO FILENAME IN THE URL, USING THE DEFAULT FILENAME
  fileName = fileName === "/" ? ROOT_FOLDER + "/index.html" : ROOT_FOLDER + fileName

  // IF PATH/INDEX.HTML EXISTS, REDIRECTING TO IT
  if (fs.existsSync(__dirname + fileName + "/index.html")) {
    const redirectedURL =
      fileName.substring(ROOT_FOLDER.length, fileName.length) + "/index.html"

    res.writeHead(302, {
      Location: redirectedURL,
    })
    res.end()
    return
  }

  const fileExtension = fileName.split(".").pop().toLowerCase()
  const filePath = __dirname + decodeURIComponent(fileName)

  const getMimeType = () => {
    switch (fileExtension) {
      case "html":
        return "text/html"

      case "htm":
        return "text/html"

      case "css":
        return "text/css"

      case "csv":
        return "text/csv"

      case "pdf":
        return "application/pdf"

      case "js":
        return "text/javascript"

      case "json":
        return "application/json"

      case "txt":
        return "text/plain"

      case "md":
        return "text/markdown"

      case "zip":
        return "application/zip"

      case "7z":
        return "application/x-7z-compressed"

      case "rar":
        return "application/x-rar-compressed"

      case "gz":
        return "application/gzip"

      case "epub":
        return "application/epub+zip"

      case "rtf":
        return "application/rtf"

      case "doc":
        return "application/msword"

      case "docx":
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

      case "xls":
        return "application/vnd.ms-excel"

      case "xlsx":
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

      case "ppt":
        return "application/vnd.ms-powerpoint"

      case "pptx":
        return "application/vnd.openxmlformats-officedocument.presentationml.presentation"

      case "mp3":
        return "audio/mpeg"

      case "aac":
        return "audio/aac"

      case "flac":
        return "audio/x-flac"

      case "wav":
        return "audio/wav"

      case "ogg":
        return "audio/ogg"

      case "mp4":
        return "video/mp4"

      case "avi":
        return "video/x-msvideo"

      case "3gp":
        return "video/3gpp"

      case "mkv":
        return "video/x-matroska"

      case "mpg":
        return "video/mpeg"

      case "mpeg":
        return "video/mpeg"

      case "ico":
        return "image/vnd.microsoft.icon"

      case "png":
        return "image/png"

      case "jpg":
        return "image/jpeg"

      case "jpeg":
        return "image/jpeg"

      case "gif":
        return "image/gif"

      case "bmp":
        return "image/bmp"

      case "svg":
        return "image/svg+xml"

      default:
        return "application/octet-stream"
    }
  }

  try {
    const fileSize = fs.statSync(filePath).size
    const readStream = fs.createReadStream(
      filePath,
      dataRange ? { start: dataRange[0], end: dataRange[1] } : undefined
    )

    res.writeHead(200, {
      "Content-Length": dataRange ? dataRange[1] - dataRange[0] : fileSize,
      "Content-Type": getMimeType(),
    })

    readStream.on("data", (chunk) => {
      res.write(chunk)
    })

    readStream.on("end", () => {
      res.end()
    })

    readStream.on("error", () => {
      res.end()
    })
  } catch (err) {
    res.writeHead(404, {
      "Content-Length": ERROR_FILE_NOT_FOUND.length,
      "Content-Type": "text/plain",
    })
    res.write(ERROR_FILE_NOT_FOUND)
    res.end()
  }
}

http.createServer(handleRequest).listen(serverPort)
