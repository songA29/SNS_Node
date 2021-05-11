const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
//config에 config.js의 development 객체를 담아두는거임 -> 개발 단계에서는 env가 development니까 아래 config.database 같은거에 development의 속성을 사용하기 위해서인듯
const User = require('./user');
const Post = require('./post');
const Hashtag = require('./hashtag');

const db = {};

//mysql에 연결하기 위해 config 값들 넣어준거, 마지막 config는 형식?인듯
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Hashtag = Hashtag;

User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);

User.associate(db);
Post.associate(db);
Hashtag.associate(db);


module.exports = db;
