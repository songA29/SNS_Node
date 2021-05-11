const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      content: {
        type: Sequelize.STRING(140),
        allowNull: false,
      },
      img: { //단 한개의 이미지만 올릴 수 있음.
        type: Sequelize.STRING(200),
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Post',
      tableName: 'posts',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Post.belongsTo(db.User); //Post:User = N:1
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); //Post:Hashtag = N:M, //foreignKey 안넣어주면 기본적으로 postId랑 hashtagId가 된다. through- 중간 테이블
  }
};
