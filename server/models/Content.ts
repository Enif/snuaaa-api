import { Model, DataTypes } from 'sequelize';
import { AlbumModel, AttachedFileModel, BoardModel, CategoryModel, ContentTagModel, DocumentModel, ExhibitionModel, ExhibitPhotoModel, PhotoModel, PostModel, TagModel, UserModel } from '.';
import { sequelize } from './sequelize';

export default class ContentModel extends Model {

}


ContentModel.init({
    content_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    content_uuid: {
        type: DataTypes.UUID,
        allowNull: true
    },
    author_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    board_id: {
        type: DataTypes.STRING(16),
    },
    category_id: {
        type: DataTypes.STRING(16),
    },
    type: {
        type: DataTypes.STRING(16),
    },
    parent_id: {
        type: DataTypes.INTEGER
    },
    title: {
        type: DataTypes.STRING(64),
    },
    text: {
        type: DataTypes.TEXT,
    },
    view_num: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    comment_num: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    like_num: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize,
    modelName: 'content',
    tableName: 'tb_content',
    timestamps: true,
    paranoid: true,
    underscored: true
});



// ContentModel.belongsTo(BoardModel, {
//     foreignKey: 'board_id',
//     targetKey: 'board_id'
// });

// ContentModel.belongsTo(UserModel, {
//     foreignKey: 'author_id',
//     targetKey: 'user_id'
// });

// ContentModel.belongsTo(CategoryModel, {
//     foreignKey: 'category_id',
//     targetKey: 'category_id'
// })

// ContentModel.belongsToMany(UserModel, {
//     through: 'contentLike',
//     foreignKey: 'content_id',
//     otherKey: 'content_id'
// })

// ContentModel.hasOne(PostModel, {
//     as: 'post',
//     foreignKey: 'content_id'
// })

// ContentModel.hasOne(AlbumModel, {
//     as: 'album',
//     foreignKey: 'content_id'
// })

// ContentModel.hasOne(PhotoModel, {
//     as: 'photo',
//     foreignKey: 'content_id'
// })

// ContentModel.hasOne(DocumentModel, {
//     as: 'document',
//     foreignKey: 'content_id'
// })

// ContentModel.hasOne(ExhibitionModel, {
//     as: 'exhibition',
//     foreignKey: 'content_id'
// })

// ContentModel.hasOne(ExhibitPhotoModel, {
//     as: 'exhibitPhoto',
//     foreignKey: 'content_id',
// })

// ContentModel.hasOne(ContentModel, {
//     as: 'parent',
//     foreignKey: 'content_id',
//     sourceKey: 'parent_id'
// })

// ContentModel.hasMany(ContentModel, {
//     as: 'children',
//     foreignKey: 'parent_id',
//     sourceKey: 'content_id'
// })

// ContentModel.hasMany(AttachedFileModel, {
//     as: 'attachedFiles',
//     foreignKey: 'parent_id',
//     sourceKey: 'content_id'
// })

// ContentModel.belongsToMany(TagModel, {
//     through: ContentTagModel,
//     // through: 'contentTag',
//     as: 'tags',
//     foreignKey: 'content_id',
//     otherKey: 'tag_id'
// })
