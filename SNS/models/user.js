module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define("Users", {
        email: {
            type: DataTypes.STRING(100),
            validate: {
                isEmail: true,
            },
            allowNull: true,
            unique: true,
            comment: "이메일",
        },
        nick: {
            type: DataTypes.STRING(15),
            allowNull: false,
            comment: "닉네임",
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: "비밀번호",
        },
        provider: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'local',
            comment: "로컬, sns 로그인",
        },
        snsId: {
            type: DataTypes.STRING(30),
            allowNull: true,
            comment: "snsId",
        },
    }, {
        sequelize,
        charset: "utf8", // 한국어 설정
        collate: "utf8_general_ci", // 한국어 설정
        tableName: "Users", // 테이블 이름
        modelName: "User",
        underscored: false, //이 옵션이 true이면 column이름을 camalCase가 아닌 underscore방식으로 사용
        timestamps: true, // createAt & updateAt 활성화
        paranoid: true, // timestamps가 활성화 되어야 사용 가능 > deleteAt 옵션 on
    });

    User.associate = models => {
        /**
         * Users안에 있는 "id값"을 "user_id라는 컬럼 이름"으로 UserInfo모델에 새로운 컬럼으로 추가한다. 1:1 일때
         */
        // Users.hasOne(models.UserInfo, {foreignKey: "user_id", sourceKey: 'id'});
    };

    return User;
};