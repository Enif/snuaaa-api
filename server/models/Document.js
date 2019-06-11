import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {

    class Document extends Model {

        static init() {
            super.init({
                content_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                generation: {
                    type: DataTypes.INTEGER,
                },
                file_path: {
                    type: DataTypes.ARRAY(DataTypes.STRING(256)),
                },
            }, {
                    sequelize,
                    modelName: 'document',
                    tableName: 'tb_document',
                    timestamps: false,
                    underscored: true
                }
            );
        }

        static associate(models) {
            this.belongsTo(models.Content, {
                foreignKey: 'content_id',
                targetKey: 'content_id'
            })
        }
    }

    return Document;
}
