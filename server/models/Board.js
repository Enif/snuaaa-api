import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {

    class Board extends Model {

        static init() {
            super.init({
                board_id: {
                    type: DataTypes.STRING(16),
                    allowNull: false,
                    primaryKey: true,
                },
                board_name: {
                    type: DataTypes.STRING(32),
                    allowNull: false,
                },
                board_type: {
                    type: DataTypes.STRING(16),
                },
                menu: {
                    type: DataTypes.INTEGER,
                },
                lv_read: {
                    type: DataTypes.INTEGER,
                },
                lv_write: {
                    type: DataTypes.INTEGER,
                },
                lv_edit: {
                    type: DataTypes.INTEGER,
                }
            }, {
                    sequelize,
                    modelName: 'board',
                    tableName: 'tb_board',
                    timestamps: false,
                    underscored: true
                }
            );
        }
    }

    return Board;
}
