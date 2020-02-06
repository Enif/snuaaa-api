import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {

    class Exhibition extends Model {

        static init() {
            super.init({
                content_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                exhibition_no: {
                    type: DataTypes.INTEGER
                },
                slogan: {
                    type: DataTypes.STRING(64),
                },
                date_start: {
                    type: DataTypes.DATE
                },
                date_end: {
                    type: DataTypes.DATE
                },
                place: {
                    type: DataTypes.STRING(64),
                },
                poster_path: {
                    type: DataTypes.STRING(256)
                },
                poster_thumbnail_path: {
                    type: DataTypes.STRING(256)
                },
            }, {
                    sequelize,
                    modelName: 'exhibition',
                    tableName: 'tb_exhibition',
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

    return Exhibition;
}
