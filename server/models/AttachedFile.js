import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {

    class AttachedFile extends Model {

        static init() {
            super.init({
                file_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true
                },
                parent_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                original_name: {
                    type: DataTypes.STRING(256)
                },
                file_path: {
                    type: DataTypes.STRING(256)
                },
                file_type: {
                    type: DataTypes.STRING(16)
                },
                download_count: {
                    type: DataTypes.INTEGER,
                    defaultValue: 0
                }
            }, {
                    sequelize,
                    modelName: 'attachedFile',
                    tableName: 'tb_file',
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
        }
    }

    return AttachedFile;
}
