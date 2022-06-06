import { Model, DataTypes } from 'sequelize';
import { ContentModel, UserModel } from '.';
import { sequelize } from './sequelize';

export default class CommentModel extends Model {

}

CommentModel.init({
    comment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    comment_uuid: {
        type: DataTypes.UUID,
        allowNull: true
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    parent_comment_id: {
        type: DataTypes.INTEGER,
    },
    author_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    text: {
        type: DataTypes.TEXT,
    },
    like_num: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize,
    modelName: 'comment',
    tableName: 'tb_comment',
    timestamps: true,
    paranoid: true,
    underscored: true
});


// CommentModel.belongsTo(ContentModel, {
//     foreignKey: 'parent_id',
//     targetKey: 'content_id'
// });

// CommentModel.belongsTo(UserModel, {
//     foreignKey: 'author_id',
//     targetKey: 'user_id'
// });

// CommentModel.hasMany(CommentModel, {
//     as: 'children',
//     foreignKey: 'parent_comment_id',
//     sourceKey: 'comment_id'
// });

// CommentModel.belongsToMany(UserModel, {
//     as: 'likeUsers',
//     through: 'commentLike',
//     foreignKey: 'comment_id',
//     otherKey: 'user_id'
// });
