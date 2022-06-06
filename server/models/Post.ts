import { Model, DataTypes } from 'sequelize';
import { ContentModel } from '.';
import { sequelize } from './sequelize';

export default class PostModel extends Model {

}

PostModel.init({
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
});

PostModel.belongsTo(ContentModel, {
    // as: 'content',
    foreignKey: 'content_id',
    targetKey: 'content_id'
})
