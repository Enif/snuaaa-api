import { Model, DataTypes } from 'sequelize';
import { sequelize } from './sequelize';

export default class PhotoModel extends Model {

}

PhotoModel.init({
    content_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    // album_id: {
    //     type: DataTypes.INTEGER,
    // },
    file_path: {
        type: DataTypes.STRING(256),
    },
    thumbnail_path: {
        type: DataTypes.STRING(256),
    },
    location: {
        type: DataTypes.STRING(256),
    },
    camera: {
        type: DataTypes.STRING(256),
    },
    lens: {
        type: DataTypes.STRING(256),
    },
    exposure_time: {
        type: DataTypes.STRING(256),
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
    modelName: 'photo',
    tableName: 'tb_photo',
    timestamps: false,
    underscored: true
});
