require('shelljs/global');
var fs = require('fs');
var path = require('path');
var ora = require('ora');

var CONFIG = {
    watch_folder: path.join(__dirname, 'src/mustache')
};

var spinner = ora('Watch for ' + CONFIG.watch_folder + '...');
spinner.start();

//compile
function compileFile(filePath){
    const fileName = filePath.substring(filePath.lastIndexOf(path.sep)+1,filePath.length);
    const fileName_no_ext = fileName.split('.')[0];
    console.log('Compile file --> ' + fileName);

    //删除文件
    var delFile = path.join(__dirname + path.sep + 'views ' + path.sep + fileName_no_ext + '.html');
    rm('-rf',delFile);
    var shell = 'mustache src' + path.sep + 'data' + path.sep + fileName_no_ext+'.json src'+ path.sep + 'mustache' + path.sep +fileName_no_ext+'.html > views'+ path.sep + fileName_no_ext + '.html';
    console.log("执行shell: " + shell);
    exec(shell);
}

//读取指定目录文件
function readFile(filePath) {
    if(!filePath)return false;
    fs.readdir(filePath,(err,files)=>{
        var f_path,stat;
        if(typeof files != 'undefined'){
            files.map((val) => {
                f_path = filePath + path.sep + val;
                stat = fs.statSync(f_path);
                if(stat.isFile()){
                    compileFile(f_path);
                }else{
                    readFile(f_path);
                }
            });
        }
    });
}


fs.watch(CONFIG.watch_folder, {encoding: 'utf8', recursive: true}, function (event, filename) {
    var filePath = 'src'+path.sep+'mustache'+path.sep+filename;
    console.log('File: '+filePath+' ---> '+event);
    compileFile(filePath);
});

function init() {
    readFile(CONFIG.watch_folder);
}
init();