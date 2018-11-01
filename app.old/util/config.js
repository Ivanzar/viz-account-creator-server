var resourcesPath = __dirname + '/../../resources/';

if (process.env.NODE_ENV === 'dev')
{
    resourcesPath += 'dev/';
}

function getResourcesPath(path)
{
    return resourcesPath + path;
}

module.exports = {
    getResourcesPath: getResourcesPath
};