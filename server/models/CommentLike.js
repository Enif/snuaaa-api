import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {

    class CommentLike extends Model {

        static init() {
            super.init({
                comment_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                user_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                }
            }, {
                    sequelize,
                    modelName: 'commentLike',
                    tableName: 'tb_comment_like',
                    timestamps: false,
                    underscored: true
                }
            );
        }

        // static associate(models) {
        //     this.belongsTo(models.Content, {
        //         foreignKey: 'parent_id',
        //         targetKey: 'content_id'
        //     })

        //     this.belongsTo(models.User, {
        //         foreignKey: 'author_id',
        //         targetKey: 'user_id'
        //     })
        // }
    }

    return CommentLike;
}
