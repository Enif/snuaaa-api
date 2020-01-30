import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {

    class Album extends Model {

        static init() {
            super.init({
                content_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                is_private: {
                    type: DataTypes.BOOLEAN
                },
                tn_photo_id: {
                    type: DataTypes.INTEGER
                }
            }, {
                    sequelize,
                    modelName: 'album',
                    tableName: 'tb_album',
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
                as: 'thumbnail',
                targetKey: 'content_id',
                foreignKey: 'tn_photo_id'
            })
        }
    }

    return Album;
}
