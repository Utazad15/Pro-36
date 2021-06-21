var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;

//create feed and lastFed variable here
var feed;
var lastfed;
var feedTime;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here
  feedTheDog=createButton("Feed the dog");
  feedTheDog.position(900,95);
  feedTheDog.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background("orange");
  foodObj.display();

  //write code to read fedtime value from the database 
  feedTime = database.ref("FeedTime");
  feedTime.on("value",function(data){
    lastfed = data.val();
  })

  //write code to display text lastFed time here
  if (lastfed >= 12) {
    textSize(20);
    fill("black");
    text("Last Feed: " + lastfed%12  + "PM", 300, 30);
  }
  else if(lastfed == 0) {
    textSize(20);
    fill("black");
    text("Last Feed: 12AM ", 300, 30);
  }
  else {
    textSize(20);
    fill("black");
    text("Last Feed:  " + lastfed + "AM", 300, 30);
  }

 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  //write code here to update food stock and last fed time
  var food_stock_val = foodObj.getFoodStock();
  if(food_stock_val <= 0){
    foodObj.updateFoodStock(food_stock_val * 0);
  } else{
    foodObj.updateFoodStock(food_stock_val - 1);
  }
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime : hour()
  })

}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
