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
            this.belongsTo(models.Content, {
                foreignKey: 'content_id',
                targetKey: 'content_id'
            })
        }
    }

    return Album;
}
