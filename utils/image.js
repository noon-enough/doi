const {IMAGE_CACHE} = require("./config");
const fileSystem = wx.getFileSystemManager()

const getStorageImage = (web_image) => {
    let webImages = wx.getStorageSync(IMAGE_CACHE) || []
    let webImage = webImages.find(y => y.web_path === web_image)
    if (webImage) {
        try {
            fileSystem.accessSync(webImage.local_path)
            return webImage.local_path
        } catch(e) {
            let webImageIdx = webImages.findIndex(y => y.web_path === web_image)
            webImages.splice(webImageIdx, 1)
            wx.setStorageSync(IMAGE_CACHE, webImages)
        }
    } else {
        wx.downloadFile({
            url: web_image,
            success (res) {
                if (res.statusCode === 200) {
                    let filePath = res.tempFilePath
                    let webImageStorage = wx.getStorageSync(IMAGE_CACHE) || []
                    let storage = {
                        web_path: web_image,
                        local_path: filePath,
                        last_time: Date.parse(new Date()),
                    }
                    webImageStorage.push(storage)
                    wx.setStorageSync(IMAGE_CACHE, webImageStorage)
                }
            }
        })
    }
    return web_image
}

module.exports = {
    getStorageImage
}
