import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {

    class Tag extends Model {

        static init() {
            super.init({
                tag_id: {
                    type: DataTypes.STRING(16),
                    allowNull: false,
                    primaryKey: true
                },
                board_id: {
                    type: DataTypes.STRING(16),
                    allowNull: false
                },
                tag_name: {
                    type: DataTypes.STRING(32)
                },
                tag_type: {
                    type: DataTypes.STRING(8)
                }
            }, {
                    sequelize,
                    modelName: 'tag',
                    tableName: 'tb_tag',
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

            this.belongsToMany(models.Content, {
                through: 'contentTag',
                foreignKey: 'tag_id',
                otherKey: 'content_id'
            })
        }
    }

    return Tag;
}
