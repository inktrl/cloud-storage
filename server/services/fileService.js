const fs = require('fs')
const File = require('../models/File')
const config = require('config')
const ApiError = require('../exceptions/api-error')

class FileService {

    createDir(req, file) {
        const filePath = this.getPath(req, file)
        return new Promise(((resolve, reject) => {
            try {
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath)
                    return resolve({message: 'Папка успішно створена'})
                } else {
                    return reject({message: 'Назва папки повторюється'})
                }
            } catch (e) {
                return reject({message: 'Помилка при створенні нової папки'})
            }
        }))
    }

    deleteFile(req, file) {
        const path = this.getPath(req, file)
        if (file.type === 'dir') {
            fs.rmdirSync(path)
        } else {
            fs.unlinkSync(path)
        }
    }

    getPath(req, file) {
        if(file) {
            return req.filePath + '\\' + file.user + '\\' + file.path
        }
        return req.filePath
    }

}

module.exports = new FileService()