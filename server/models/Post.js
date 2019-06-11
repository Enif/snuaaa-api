import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {

    class Post extends Model {

        static init() {
            super.init({
                content_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
            }, {
                    sequelize,
                    modelName: 'post',
                    tableName: 'tb_post',
                    timestamps: false,
                    underscored: true
                }
            );
        }

        static associate(models) {
            this.belongsTo(models.Content, {
                as: 'content',
                foreignKey: 'content_id',
                targetKey: 'content_id'
            })
        }
    }

    return Post;
}
