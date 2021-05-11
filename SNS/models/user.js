const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model { //공식문서를 따르는 형식
    static init(sequelize) {
        return super.init({
            email: { //시퀄라이즈는 id 생략한다.
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true, //빈 값이 있어도 unique하게 구분된다.
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100), //해시화하면 길어지기 때문에 100글자로 지정해놓은거
                allowNull: true, //sns 로그인하는 경우에는 비밀번호가 없을 수 있다.
            },
            provider: {
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: 'local', //local을 통해 로그인한거 / kakao, facebook 등등 가능
            },
            snsId: { //카카오, 네이버 등등으로 로그인하면 snsId라는걸 주는데 그걸 저장하고 있어야만 나중에
                //로그인할 때 id처럼 활용할 수 있다.
                type: Sequelize.STRING(30),
                allowNull: true,
            },
        }, {//기타 옵션들
            sequelize, //데이터베이스 커넥션
            timestamps: true, //true - createdAt, updatedAt이 자동으로 기록된다.
            underscored: false, //이 옵션이 true이면 column이름을 camalCase가 아닌 underscore방식으로 사용
            modelName: 'User',
            tableName: 'users',
            paranoid: true, //paranoid - deletedAt이 자동으로 기록된다.
            charset: 'utf8', //한국어 설정
            collate: 'utf8_general_ci',// 한국어 설정
        });
    }

    static associate(db) {
        db.User.hasMany(db.Post); // User:Post = 1:N
        db.User.belongsToMany(db.User, { //사용자 테이블 간의 관계를 표현한거임.
            foreignKey: 'followingId',
            //foreignKey를 안넣어주면 userId와 userId가 돼서 헷갈리게 된다. 구분 짓기 위해 foreignKey 넣어준거.
            as: 'Followers',//as에는 foreignKey와 반대되는 것을 넣어줘야됨. -> 그래야 나중에 followers들을 가져올 때 followingId를 보고 가져올 수 있다.
            through: 'Follow', //Follow라는 중간 테이블을 만들어줌.
        });
        db.User.belongsToMany(db.User, {
            foreignKey: 'followerId',
            as: 'Followings', // 시퀄라이즈는 as 이름을 바탕으로 자동으로 addFollower, getFollwers, addFollowing, getFollowings 메서드를 생성
            through: 'Follow',
        });
    }
};