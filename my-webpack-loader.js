module.exports = function myWebpackLoader(content) {
    console.log(content);
    return content.replace('console.log(', 'alert(');
};
