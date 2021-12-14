const { v4: uuidv4 } = require('uuid');

const getImageData = (imageStr) => {
    if(!imageStr)
        return {imgBase64Data:null,url:null}

    if(imageStr.includes('data:image\/png')) {
        const imgBase64Data = imageStr.replace(/^data:image\/png;base64,/, "")
        const url = 'images\/' + uuidv4() + '.png'
        return {imgBase64Data, url}
    }
    if(imageStr.includes('data:image\/jpeg')) {
        const imgBase64Data = imageStr.replace(/^data:image\/jpeg;base64,/, "")
        const url = 'images\/' +uuidv4() + '.jpg'
        return {imgBase64Data, url}
    }
}

module.exports = getImageData;