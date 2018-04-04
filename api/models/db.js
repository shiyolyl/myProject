'use strict';
const MongoClient = require('mongodb').MongoClient;

const config=require('../config.js');

const url = `mongodb://${config.host}:${config.port}/${config.database}`;
// const url='mongodb://'+config.host+':'+config.port+'/'+config.database;
// console.log(url);

// const cName = 'users';//要操作的数据库的users集合
// let dbs = {}; //将函数都封装挂载到对象db上，并将对象导出

let Db=function(cName){
  this.cName=cName;
}

/**
 * 封装自己的增加
 * @param  {[type]}   arr      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Db.prototype.insert = function(arr, callback) {
    MongoClient.connect(url, (err, db)=> {
        if (err) throw err;

        //通过db对象获取集合对象
        let userColllection = db.collection(this.cName);//获取cName数据库的集合
        //使用集合对象增删改查
        userColllection.insertMany(arr, function(err, result) {
            callback(err, result);
            db.close();
        });
    });
}
// //测试插入数据
// db.insert([{ name: 'a' }, { name: 'b' }], function(err, result) {
//     if (err) console.log('出异常了');
//     console.log(result.insertedCount);
// });


/**
 * //删除
 * @param  {[type]}   obj      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Db.prototype.remove = function(obj, callback) {
    MongoClient.connect(url, (err, db)=> {
        if (err) throw err;

        //通过db对象获取集合对象
        let userColllection = db.collection(this.cName);

        //使用集合对象增删改查
        userColllection.deleteMany(obj, function(err, result) {
            callback(err, result);
            db.close();
        });
    });
}
//测试删除数据
// db.remove({ $or: [{ name: 'a' }, { name: 'b' }] }, function(err, result) {
//     if (err) console.log('删除数据出异常了');
//     console.log(result.deletedCount);
// });


/**
 * //更新数据（改）
 * @param  {[type]}   filter   [description]
 * @param  {[type]}   obj      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Db.prototype.update = function(filter, obj, callback) { //filter:匹配更新的 obj:更新成...
    MongoClient.connect(url, (err, db)=> {
        if (err) throw err;

        //通过db对象获取集合对象
        let userColllection = db.collection(this.cName);

        //使用集合对象增删改查
        userColllection.updateMany(filter, { $set: obj }, function(err, result) {
            callback(err, result);
            db.close();
        });
    });
}
//测试更新数据
// db.update({ name: /小/ }, { test: 'ok' }, function(err, result) {
//     if (err) return console.log('更新失败');
//     console.log(result.modifiedCount);
// });


/**
 * //查询数据
 * @param  {[type]}   filter   [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Db.prototype.find = function(filter, callback) {
    MongoClient.connect(url, (err, db)=>{
       if(err) throw err;
        let userColllection = db.collection(this.cName);

        //使用集合对象增删改查
        userColllection.find(filter).toArray(function(err, docs) {
            callback(err, docs);
            db.close();
        });
    });
}

//测试查询数据
// db.find({ name: /小/ }, function(err, users) {
//     if (err) console.log('查询用户失败');
//     console.log(users);
// })


module.exports = Db; //最后将此对象导出
