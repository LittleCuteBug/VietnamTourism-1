const fs = require("fs");

const readImageFromURL = async (imageURL) => {
    if(!imageURL) return null;
    const imageData = await fs.promises.readFile(imageURL,'base64');
    if (imageURL.endsWith('png')) {
        return 'data:image/png;base64,' + imageData
    }
    if (imageURL.endsWith('jpg')) {
        return imageData.replace('dataimage\/jpegbase64','data:image\/jpeg;base64,')
    }
}
module.exports = readImageFromURL;
