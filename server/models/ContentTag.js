import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {

    class ContentTag extends Model {

        static init() {
            super.init({
                content_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                tag_id: {
                    type: DataTypes.STRING(16),
                    allowNull: false,
                    primaryKey: true,
                }
            }, {
                    sequelize,
                    modelName: 'contentTag',
                    tableName: 'tb_content_tag',
                    timestamps: false,
                    underscored: true
                }
            );
        }
    }

    return ContentTag;
}
