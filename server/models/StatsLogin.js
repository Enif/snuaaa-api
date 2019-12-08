import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {

    class StatsLogin extends Model {

        static init() {
            super.init({
                user_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                login_at: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    primaryKey: true
                }
            }, {
                    sequelize,
                    modelName: 'statsLogin',
                    tableName: 'tb_stats_login',
                    timestamps: false,
                    underscored: true
                }
            );
        }

        static associate(models) {
            this.belongsTo(models.User, {
                foreignKey: 'user_id',
                targetKey: 'user_id'
            })
        }
    }

    return StatsLogin;
}
