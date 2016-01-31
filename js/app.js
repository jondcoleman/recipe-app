var initialRecipes = [{
  name: 'Quesadillsas',
  ingredients: 'Tortillas, Cheese, Butter'
}, {
  name: 'Hamburgers',
  ingredients: 'Bun, Meat, Ketchup'
}]

if (!localStorage.recipes01) {
  store.set('recipes01', initialRecipes)
};

function getRecipes(){
  return store.get('recipes01')
}

function addRecipe(recipe){
  var recipes = getRecipes()
  recipes.push(recipe)
  store.set('recipes01', recipes)
}

function editRecipe(recipe, index){
  var recipes = getRecipes()
  recipes.splice(index, 1, recipe)
  store.set('recipes01', recipes)
}

function deleteRecipe(index){
  var recipes = getRecipes()
  recipes.splice(index, 1)
  store.set('recipes01', recipes)
}





////////////////////////////////// Routes
var Routes = React.createClass({
  getInitialState: function() {
    return ({
      view: 'main',
      recipeIndex: undefined,
      activeItem: undefined
    })
  },
  render: function() {
    if (this.state.view === 'main') return <RecipeList changeView={this.changeView} activeItem={this.state.activeItem}/ >
    else if (this.state.view === 'add') return <RecipeForm changeView={this.changeView}/>
    else if (this.state.view === 'edit') return <RecipeForm changeView={this.changeView} recipeIndex={this.state.recipeIndex}/>
  },
  changeView: function(viewname, recipeIndex, activeItem){
    this.setState({view: viewname, recipeIndex: recipeIndex, activeItem: activeItem})
  }
})



////////////////////////////////// Recipe Form
var RecipeForm = React.createClass({
  getInitialState: function(){
    return ({name: undefined, ingredients: undefined, index: undefined})
  },
  componentDidMount: function(){
    if (this.props.recipeIndex >= 0) {
      var recipe = getRecipes()[this.props.recipeIndex]
      this.setState({name: recipe.name, ingredients: recipe.ingredients, index: this.props.recipeIndex})
    }
  },
  render: function() {
    return (
      <form>
        <input type="text" className="form-control" onChange={this.handleNameChange} placeholder="Recipe Name" value={this.state.name}/>
        <textarea className="form-control" onChange={this.handleIngredientsChange} placeholder="Ingredients separated by commas e.g. Tortillas, Steak, Avocado" value={this.state.ingredients}/>
        {this.props.recipeIndex !== undefined
          ?
          <button className="btn btn-primary" onClick={this.handleSave} disabled={!this.state.name || !this.state.ingredients}>Save</button>
          :
          <button className="btn btn-primary" onClick={this.addRecipe} disabled={!this.state.name || !this.state.ingredients}>Add</button>
        }
        <div className="btn btn-danger" onClick={this.handleCancel}>Cancel</div>
      </form>
    )
  },
  handleNameChange: function(e){
    this.setState({name: e.target.value})
  },
  handleIngredientsChange: function(e){
    this.setState({ingredients: e.target.value})
  },
  addRecipe: function(e){
    e.preventDefault()
    addRecipe({name: this.state.name, ingredients: this.state.ingredients})
    this.props.changeView('main')
  },
  handleCancel: function(e){
    this.props.changeView('main')
  },
  handleSave: function(e){
    e.preventDefault()
    var recipe = {name: this.state.name, ingredients: this.state.ingredients}
    editRecipe(recipe, this.props.recipeIndex)
    this.props.changeView('main', undefined, this.props.recipeIndex)
  }
})






////////////////////////////////// Recipe List
var RecipeList = React.createClass({
  getInitialState: function() {
    return ({
      recipes: getRecipes(),
      activeItem: this.props.activeItem || null
    })
  },
  render: function() {
    var listItems = this.state.recipes.map((recipe, index) => {
      return (
        <div key={index}>
          <li className="list-group-item recipe-item" onClick={this.setActiveItem.bind(null, index)}>{recipe.name}</li>
          {this.state.activeItem === index ?
            <li className="list-group-item">
              <RecipeDetail ingredients={recipe.ingredients} edit={this.edit.bind(null, index)} delete={this.delete.bind(null, index)}/>
            </li>:
            null}
        </div>
      )
    })

    return (
      <div>
        <ul className="list-group">{listItems}</ul>
        <div className="btn btn-primary" onClick={this.handleClick}>Add</div>
      </div>
    )
  },
  handleClick: function(e){
    e.preventDefault()
    this.props.changeView('add')
  },
  setActiveItem: function(index){
    this.setState({activeItem: index})
  },
  edit: function(recipeIndex){
    this.props.changeView('edit', recipeIndex)
  },
  delete: function(index){
    this.state.recipes.splice(index, 1)
    this.setState({recipes: this.state.recipes})
    deleteRecipe(index)
  }
})




////////////////////////////////// RecipeDetail
var RecipeDetail = React.createClass({
  render: function(){
    var ingredients = this.props.ingredients.split(",")
    var ingredientList = ingredients.map(function(ingredient, index){
      ingredient = ingredient.trim()
      return (
        <li className="list-group-item" key={index}>{ingredient}</li>
      )
    })

    return (
        <div className="panel-body">
          <h4>Ingredients</h4>
          <ul className="list-group">{ingredientList}</ul>
          <div className="btn btn-warning" onClick={this.props.edit}>Edit</div>
          <div className="btn btn-danger" onClick={this.props.delete}>Delete</div>
        </div>
    )
  }
})

var app = React.createElement(Routes);

ReactDOM.render(app, document.getElementById('content'))
