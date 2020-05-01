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
    }

    return CommentLike;
}
