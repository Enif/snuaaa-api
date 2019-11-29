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
                author_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                text: {
                    type: DataTypes.TEXT,
                },
                like_num: {
                    type: DataTypes.INTEGER,
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

            this.belongsToMany(models.User, {
                through: 'commentLike',
                foreignKey: 'comment_id',
                otherKey: 'comment_id'
            })
        }
    }

    return Comment;
}
