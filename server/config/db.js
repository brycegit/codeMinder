var Sequelize = require('sequelize');
//initialize Sequelize with postgres with remote url
if (process.env.DATABASE_URL) {
  var db = new Sequelize(process.env.DATABASE_URL, {dialect: 'postgres', logging: false });
} else {
  // otherwise initialize Sequelize with postgres on your local machine
  var db = new Sequelize('stackets', process.env.POSTGRES_USER, '', {dialect: 'postgres', logging: false });
}

//create Snippet table
var Snippet = db.define('Snippet', {
  title: Sequelize.STRING,
  snippet: Sequelize.TEXT,
  notes: Sequelize.TEXT
  //id (auto-generated)
  //createdAt (auto-generated)
  //updatedAt (auto-generated)
  //LanguageId (generated by join)
  //CategoryId (generated by join)
  //SubcategoryId (generated by join)
});

//create Language table
var Language = db.define('Language', {
  name: Sequelize.TEXT,
  displayname: Sequelize.TEXT
  //id (auto-generated)
  //createdAt (auto-generated)
  //updatedAt (auto-generated)
});

// create ResourceURL table to store url's relevant to a snippet
var ResourceUrl = db.define('ResourceUrl', {
  url: Sequelize.TEXT,
  //SnippetId (generated by join)
  //id (auto-generated)
  //createdAt (auto-generated)
  //updatedAt (auto-generated)
});

// // create User table
// var User = db.define('User', {
//   name: Sequelize.TEXT,
//   email: Sequelize.TEXT,
//   photo: Sequelize.TEXT
//   //id (auto-generated)
//   //createdAt (auto-generated)
//   //updatedAt (auto-generated)
// });

//create Favorite table that contains userID and snippetID per favorite
var Favorite = db.define('Favorite');
//SnippetId (generated by join)
//createdAt (auto-generated)
//updatedAt (auto-generated)

var Category = db.define('Category', {
  name: Sequelize.TEXT
  //id (auto-generated)
  //createdAt (auto-generated)
  //updatedAt (auto-generated)
});

var Subcategory = db.define('Subcategory', {
  name: Sequelize.TEXT
  //CategoryID (generated by join)
});
// create User table
var User = db.define('User', {
  name: Sequelize.TEXT,
  image: Sequelize.TEXT,
  provider: Sequelize.TEXT,
  password: Sequelize.TEXT,
  email: Sequelize.TEXT
  //id (auto-generated)
  //createdAt (auto-generated)
  //updatedAt (auto-generated)
});

//sync individual tables listed above and create join tables
Snippet.sync()
.then(() => Snippet.belongsTo(User, {foreignkey: 'UserId'}))
.then(() => User.hasMany(Snippet, {foreignkey: 'SnippetId'}))
.then(() => Snippet.belongsTo(Language, {foreignkey: 'LanguageId'}))
.then(() => Language.hasMany(Snippet, {foreignkey: 'LanguageId'}))
.then(() => Snippet.hasMany(ResourceUrl, {foreignkey: 'SnippetId'}))
.then(() => ResourceUrl.belongsTo(Snippet, {foreignkey: 'SnippetId'}))
.then(() => Category.hasMany(Subcategory, {foreignkey: 'CategoryId'}))
.then(() => Subcategory.belongsTo(Category, {foreignkey: 'CategoryId'}))
.then(() => Snippet.belongsTo(Category, {foreignkey: 'CategoryId'}))
.then(() => Category.hasMany(Snippet, {foreignkey: 'CategoryId'}))
.then(() => Snippet.belongsTo(Subcategory, {foreignkey: 'SubcategoryId'}))
.then(() => Subcategory.hasMany(Snippet, {foreignkey: 'SubcategoryId'}))
.then(() => Snippet.hasMany(Favorite, {foreignkey: 'SnippetId'}))
.then(() => User.hasMany(Favorite, {foreignkey: 'UserId'}))
.then(() => Favorite.belongsTo(Snippet, {foreignkey: 'SnippetId'}))
.then(() => Favorite.belongsTo(User, {foreignkey: 'UserId'}))
.then(() => Language.sync())
.then(() => Snippet.sync())
.then(() => Favorite.sync())
.then(() => ResourceUrl.sync())
.then(() => Category.sync())
.then(() => Subcategory.sync());

//export table schemas for use in other files
module.exports = {
  Snippet: Snippet,
  Language: Language,
  ResourceUrl: ResourceUrl,
  User: User,
  Favorite: Favorite,
  Category: Category,
  Subcategory: Subcategory,
  sequelize: db
};
