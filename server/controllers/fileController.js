const fileService = require('../services/fileService')
const config = require('config')
const fs = require('fs')
const File = require('../models/File')
const User = require('../models/User')
const Uuid = require('uuid')
const shortid = require('shortid')
const UserDto = require('../dtos/user-dto')

class FileController {

    async createDir(req, res) {
        try {
            const {name, type, parent} = req.body
            const file = new File({name, type, parent, user: req.user.id })
            const parentFile = await File.findOne({_id: parent})
            if(!parentFile) {
                file.path = name
                await fileService.createDir(req, file)
            } else {
                file.path = `${parentFile.path}\\${file.name}`
                await fileService.createDir(req, file)
                parentFile.childs.push(file._id)
                await parentFile.save()
            }
            file.code = Uuid.v4()
            await file.save()
            return res.json(file)
        } catch (e) {
            console.log(e.message)
            return res.status(400).json(e)
        }
    }

    async getFiles(req, res) {
        try {
            const {sort} = req.query
            let files
            const user = await User.findOne({user: req.user.id})
            switch (sort) {
                case 'name':
                    files = await File.find({user: req.user.id, parent: req.query.parent}).sort({name:1})
                    break
                case '-name':
                    files = await File.find({user: req.user.id, parent: req.query.parent}).sort({name:-1})
                    break
                case 'size':
                    files = await File.find({user: req.user.id, parent: req.query.parent}).sort({size:1})
                    break
                case '-size':
                    files = await File.find({user: req.user.id, parent: req.query.parent}).sort({size:-1})
                    break
                case 'date':
                    files = await File.find({user: req.user.id, parent: req.query.parent}).sort({date:1})
                    break
                case '-date':
                    files = await File.find({user: req.user.id, parent: req.query.parent}).sort({date:-1})
                    break
                default:
                    files = await File.find({user: req.user.id, parent: req.query.parent})
                    break;
            }
            var fsize = 0
            if(files.type !== 'dir') {
                files.map((file) => fsize += file.size)
            }
            user.usedSpace = fsize
            await user.save()

            return res.json(files)
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "Не вдається отримати файли"})
        }
    }

    async uploadFile(req, res) {
        try {
            const file = req.files.file

            const parent = await File.findOne({user: req.user.id, _id: req.body.parent})
            const user = await User.findOne({_id: req.user.id})

            if (user.usedSpace + file.size > user.diskSpace) {
                return res.status(400).json({message: 'Немає місця на диску'})
            }
            user.usedSpace = user.usedSpace + file.size

            let path;
            if (parent) {
                path = `${req.filePath}\\${user._id}\\${parent.path}\\${file.name}`
            } else {
                path = `${req.filePath}\\${user._id}\\${file.name}`
            }

            if (fs.existsSync(path)) {
                return res.status(400).json({message: 'Файл уже існує'})
            }
            file.mv(path)

            const type = file.name.split('.').pop()
            let filePath = file.name
            if (parent) {
                filePath = parent.path + "\\" + file.name
            }

            const baseUrl = process.env.API_URL
            const shortUrl = shortid.generate() 
            const genUrl =  baseUrl + '/' + shortUrl

            const dbFile = new File({
                name: file.name,
                type,
                urlLink: genUrl,
                code: shortUrl,
                size: file.size,
                path: filePath,
                parent: parent ? parent._id : null,
                user: user._id
            });

            await dbFile.save()
            await user.save()
            res.json(dbFile)

            
            if(parent) {
                const parentFile = await File.findOne({_id: req.body.parent})
                const allFiles = await File.find({parent: parentFile})
                parentFile.size = 0
                allFiles.map((f) => {
                    if(parentFile !== null) {
                        parentFile.size = parentFile.size + f.size
                    }
                })
                await parentFile.save()
            }


        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "Помилка завантаження"})
        }
    }

    async downloadFile(req, res) {
        try {
            const file = await File.findOne({_id: req.query.id})
            // console.log(req.user)
            // const fileAccess = await File.findOne({_id: req.query.id, user: req.user.id})
            // if(file.accessLink) {
                const path = fileService.getPath(req, file)
                if (fs.existsSync(path)) {
                    file.downloads++
                    await file.save()
                    return res.download(path, file.name)
                }
            // }
            return res.status(400).json({message: "Помилка завантаження"})
        } catch (e) {
            res.status(500).json({message: "Помилка завантаження"})
        }
    }

    async deleteFile(req, res) {
        try {
            let delID
            const file = await File.findOne({_id: req.query.id, user: req.user.id})

            if (!file) {
                return res.status(400).json({message: 'Файл не знайдено'})
            }
            delID = file
            fileService.deleteFile(req, file)
            await file.remove()

        
            if((file.type !== 'dir') && file.parent) {
                const parentFile = await File.findOne({_id: delID.parent})
                const allFiles = await File.find({parent: parentFile})
                parentFile.size = 0
                allFiles.map((f) => {
                    if(parentFile !== null) {
                        parentFile.size = parentFile.size + f.size
                    }
                })
                await parentFile.save()
            }
    

            return res.json({message: 'Файл видалено'})
        } catch (e) {
            console.log(e.code)
            return res.status(400).json({message: 'Папка не порожня'})
        }
    }

    async searchFile(req, res) {
        try {
            const searchName = req.query.search
            let files = await File.find({user: req.user.id})
            files = files.filter(file => file.name.includes(searchName))
            return res.json(files)
        } catch (e) {
            console.log(e)
            return res.status(400).json({message: 'Помилка пошуку'})
        }
    }

    async uploadAvatar(req, res) {
        try {
            const file = req.files.file
            const user = await User.findById(req.user.id)
            let path = fileService.getPath(req)
            let index = path.lastIndexOf("\\")
            path = path.substring(0, index)
            if(user.avatar) {
                fs.unlinkSync(path + "\\" + "static" + "\\" + user.avatar)
            }
            const avatarName = Uuid.v4() + '.jpg'
            file.mv(path + "\\" + "static" + "\\" + avatarName)
            user.avatar = avatarName
            await user.save()
            const userDto = new UserDto(user)
            return res.json(userDto)
        } catch (e) {
            console.log(e)
        }
    }

    async deleteAvatar(req, res) {
        try {
            const user = await User.findById(req.user.id)
            let path = fileService.getPath(req)
            let index = path.lastIndexOf("\\")
            path = path.substring(0, index)
            fs.unlinkSync(path + "\\" + "static" + "\\" + user.avatar)
            user.avatar = null
            await user.save()
            const userDto = new UserDto(user)
            return res.json(userDto)
        } catch (e) {}
    }



    async getCode(req, res) {
        try {
            const link = await File.findOne({code: req.params.code})
            res.json(link)
        } catch (e) {
            next(e)
        }
    }

    async changeAccessLink(req, res) {
        try {
            const link = await File.findById(req.params.id)
            link.accessLink = !link.accessLink
            await link.save()
            res.json(link.accessLink)
        } catch (e) {
            next(e)
        }
    }

    async changeAccessLoginLink(req, res) {
        try {
            const link = await File.findById(req.params.id)
            link.accessLoginLink = !link.accessLoginLink
            await link.save()
            res.json(link.accessLoginLink)
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new FileController()