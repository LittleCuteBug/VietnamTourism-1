const fs = require("fs");

const readImageFromURL = async (imageURL) => {
    try {
        if(!imageURL) return null;
        const imageData = await fs.promises.readFile(imageURL,'base64');
        if (imageURL.endsWith('png')) {
            return 'data:image/png;base64,' + imageData
        }
        if (imageURL.endsWith('jpg')) {
            return 'data:image/jpeg;base64,' + imageData;
        }
    } catch (error) {
        return '';
    }
}
module.exports = readImageFromURL;
