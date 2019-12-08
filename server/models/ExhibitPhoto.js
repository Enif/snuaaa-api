import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {

    class ExhibitPhoto extends Model {

        static init() {
            super.init({
                content_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                exhibition_id: {
                    type: DataTypes.INTEGER,
                },
                order: {
                    type: DataTypes.INTEGER,
                },
                photographer_id: {
                    type: DataTypes.INTEGER,
                },
                photographer_alt: {
                    type: DataTypes.STRING(32),
                },
                file_path: {
                    type: DataTypes.STRING(256),
                },
                thumbnail_path: {
                    type: DataTypes.STRING(256),
                },
                location: {
                    type: DataTypes.STRING(64),
                },
                camera: {
                    type: DataTypes.STRING(64),
                },
                lens: {
                    type: DataTypes.STRING(64),
                },
                exposure_time: {
                    type: DataTypes.STRING(32),
                },
                focal_length: {
                    type: DataTypes.STRING(32),
                },
                f_stop: {
                    type: DataTypes.STRING(8),
                },
                iso: {
                    type: DataTypes.STRING(8),
                },
                date: {
                    type: DataTypes.DATE
                }
            }, {
                    sequelize,
                    modelName: 'exhibitPhoto',
                    tableName: 'tb_exhibit_photo',
                    timestamps: false,
                    underscored: true
                }
            );
        }

        static associate(models) {
            // this.belongsTo(models.Content, {
            //     foreignKey: 'content_id',
            //     targetKey: 'content_id'
            // })
            
            this.belongsTo(models.Content, {
                as: 'exhibitionContent',
                foreignKey: 'exhibition_id',
                targetKey: 'content_id'
            })

            this.belongsTo(models.User, {
                as: 'photographer',
                foreignKey: 'photographer_id',
                targetKey: 'user_id'
            })
        }
    }

    return ExhibitPhoto;
}
