import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {

    class Category extends Model {

        static init() {
            super.init({
                category_id: {
                    type: DataTypes.STRING(16),
                    allowNull: false,
                    primaryKey: true
                },
                board_id: {
                    type: DataTypes.STRING(16),
                    allowNull: false
                },
                category_name: {
                    type: DataTypes.STRING(32)
                },
                category_color: {
                    type: DataTypes.STRING(8)
                }
            }, {
                    sequelize,
                    modelName: 'category',
                    tableName: 'tb_category',
                    timestamps: false,
                    underscored: true
                }
            );
        }

        static associate(models) {
            this.belongsTo(models.Board, {
                foreignKey: 'board_id',
                targetKey: 'board_id'
            })
        }
    }

    return Category;
}
