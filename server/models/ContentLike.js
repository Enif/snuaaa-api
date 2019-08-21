import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {

    class ContentLike extends Model {

        static init() {
            super.init({
                content_id: {
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
                    modelName: 'contentLike',
                    tableName: 'tb_content_like',
                    timestamps: false,
                    underscored: true
                }
            );
        }
    }

    return ContentLike;
}
