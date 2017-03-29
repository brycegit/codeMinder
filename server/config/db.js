
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
  shortDescription: Sequelize.TEXT
  //id (auto-generated)
  //createdAt (auto-generated)
  //updatedAt (auto-generated)
  //TopicId (generated by join)
  //LanguageId (generated by join)
});

//create CodeSample table
var CodeSample = db.define('CodeSample', {
  codeSample: Sequelize.TEXT
  //id (auto-generated)
  //createdAt (auto-generated)
  //updatedAt (auto-generated)
  //SnippetId (generated by join)
});

//create Topic table
var Topic = db.define('Topic', {
  name: Sequelize.TEXT
  //id (auto-generated)
  //createdAt (auto-generated)
  //updatedAt (auto-generated)
});

//create Language table
var Language = db.define('Language', {
  name: Sequelize.TEXT,
  displayname: Sequelize.TEXT
  //id (auto-generated)
  //createdAt (auto-generated)
  //updatedAt (auto-generated)
});

//create Tag table
var Tag = db.define('Tag', {
  tag: Sequelize.TEXT
  //id (auto-generated)
  //createdAt (auto-generated)
  //updatedAt (auto-generated)
});

//create SnippetTag table
var SnippetTag = db.define('SnippetTag');
//TagId (generated by join)
//SnippetId (generated by join)
//createdAt (auto-generated)
//updatedAt (auto-generated)

//sync individual tables listed above and create join tables
Snippet.sync()
.then(() => Snippet.hasMany(CodeSample, {foreignkey: 'SnippetId'}))
.then(() => CodeSample.belongsTo(Snippet, {foreignkey: 'SnippetId'}))
.then(() => CodeSample.sync())
.then(() => Snippet.belongsTo(Topic, {foreignkey: { name: 'TopicId'}}))
.then(() => Topic.hasMany(Snippet, {foreignkey: { name: 'TopicId'}}))
.then(() => Topic.sync())
.then(() => Snippet.belongsTo(Language, {foreignkey: 'LanguageId'}))
.then(() => Language.hasMany(Snippet, {foreignkey: 'LanguageId'}))
.then(() => Language.sync())
.then(() => Tag.belongsToMany(Snippet, {through: SnippetTag }))
.then(() => Snippet.belongsToMany(Tag, {through: SnippetTag }))
.then(() => Tag.sync())
.then(() => Snippet.sync())
.then(() => SnippetTag.sync());

//export table schemas for use in other files
module.exports = {
  Snippet: Snippet,
  CodeSample: CodeSample,
  Topic: Topic,
  Language: Language,
  Tag: Tag,
  SnippetTag: SnippetTag
};
