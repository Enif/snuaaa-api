import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {

    class Comment extends Model {

        static init() {
            super.init({
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
                }
            );
        }

        static associate(models) {
            this.belongsTo(models.Content, {
                foreignKey: 'parent_id',
                targetKey: 'content_id'
            })

            this.belongsTo(models.User, {
                foreignKey: 'author_id',
                targetKey: 'user_id'
            })

            this.hasMany(models.Comment, {
                as: 'children',
                foreignKey: 'parent_comment_id',
                sourceKey: 'comment_id'
            })

            this.belongsToMany(models.User, {
                as: 'likeUsers',
                through: 'commentLike',
                foreignKey: 'comment_id',
                otherKey: 'user_id'
            })
        }
    }

    return Comment;
}
