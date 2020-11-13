//General script file


let currPizza = {
    size: "lg",
    toppings: []
}





//Pass in pizza object (see pizza.js for example model) and this method will return the price.
const calculatePrice = pizzaObject => {
    //Base price based on size
    let price = pizzaData.prices[pizzaObject.size];
    //For each topping listed: Add 1 to price if quantity == "reg", 2 if quantity == "double"
    for(topping of pizzaObject.toppings) {
        if(topping.quantity == "reg") price += 1;
        else if(topping.quantity == "dbl") price += 2;
    }

    //Truncate to 2 digit decimal
    price = Math.floor(price * 100) / 100;

    return price;

}



//On window load
document.addEventListener("DOMContentLoaded", () => {
    createLayout();


});

const createLayout = () => {
    //Make parent container
    let parentContainer = document.getElementById("pizza");
    
    //Make left side div
    let leftSide = document.createElement("div");
    leftSide.classList.add("leftSide");
    
    let selectionContainer = document.createElement("div");
    selectionContainer.classList.add("selection-container");
    //Populate left side with prebuilt pizzas
    for(prebuiltPizza of pizzaData.prebuilt) {
        selectionContainer.appendChild(createOptionBtn(prebuiltPizza.name, prebuiltPizza));
    }
    //Also add create custom pizza option
    selectionContainer.appendChild(createOptionBtn("Custom Pizza", null));
    leftSide.appendChild(selectionContainer);

    //Make and append pizza config menu
    leftSide.appendChild(createPizzaConfigMenu());

    parentContainer.appendChild(leftSide);
    //End left side

    //Make left side div
    let rightSide = document.createElement("div");
    rightSide.classList.add("rightSide");
    
    //Make pizza display, order, and total divs
    let pizzaDisplay = document.createElement("div");
    pizzaDisplay.classList.add("pizza");
    let order = document.createElement("div");
    order.classList.add("order");
    let total = document.createElement("div");
    total.classList.add("total");
    total.innerHTML = "Total: $0";
    //make order button
    let orderBtn = document.createElement("button");
    orderBtn.innerHTML = "Order";
    orderBtn.classList.add("orderButton");

    //Nest all elements
    rightSide.appendChild(pizzaDisplay);
    rightSide.appendChild(order);
    rightSide.appendChild(total);
    rightSide.appendChild(orderBtn);

    parentContainer.appendChild(rightSide);
    //End right side

    
}


//Helper method to make pizza btn options displayed on the left side of the screen
const createOptionBtn = (name, prebuiltPizza) => {
    let container = document.createElement("button");
        container.classList.add("btn");
        container.classList.add("btn-lg");
        container.classList.add("btn-block");
        container.innerHTML = name;
        //Add click event listener
        container.addEventListener("click", () => {
            //Change current pizza to be the contents of the prebuilt pizza clicked
            if(prebuiltPizza) {
                currPizza = {
                    size: "lg",
                    toppings: prebuiltPizza.toppings
                }
            }
            else {
                currPizza = {
                    size: "lg",
                    toppings: []
                }
            }
            console.log(currPizza);
            //Populate config menu with correct preset data
            showConfigMenu(currPizza);
        });
        return container;
}



//Create the pizza config menu
const createPizzaConfigMenu = () => {
    let pizzaConfigMenu = document.createElement("div");
    pizzaConfigMenu.classList.add("config-menu");
    pizzaConfigMenu.classList.add("hidden");
    pizzaConfigMenu.style.display = "none";
    //Size choice
    let size = document.createElement("div");
    size.classList.add("config-row");
    //row title
    let rowTitle = document.createElement("p");
    rowTitle.innerHTML = "Size";
    size.appendChild(rowTitle);
    //radio button container. Radio buttons go in this container
    let radioBtnContainer = document.createElement("div");
    radioBtnContainer.classList.add("config-radio-container");
    let radioGroup = document.createElement("div");
    radioGroup.classList.add("config-radio-group");
    radioGroup.appendChild(createRadioDiv("", "sm", "size"));
    radioGroup.appendChild(createRadioDiv("", "md", "size"));
    radioGroup.appendChild(createRadioDiv("", "lg", "size", true));
    radioGroup.appendChild(createRadioDiv("", "xl", "size"));
    radioBtnContainer.appendChild(radioGroup);
    size.appendChild(radioBtnContainer);
    pizzaConfigMenu.appendChild(size);

    for(let i = 0; i < pizzaData.toppings.length; i++) {
        pizzaConfigMenu.appendChild(createConfigToppingRow(i, pizzaData.toppings[i]));
    }


    return pizzaConfigMenu;
}


const createConfigToppingRow = (index, topping) => {
    let toppingRow = document.createElement("div");
    toppingRow.classList.add("config-row");
    //Set attribute so we can find topping
    toppingRow.setAttribute("data-topping", topping.name.toLowerCase().replace(" ", "-"));
    //row title
    let rowTitle = document.createElement("p");
    rowTitle.innerHTML = topping.name;
    toppingRow.appendChild(rowTitle);

    //Made radio button group for quantity of topping
    let radioBtnContainer = document.createElement("div");
    radioBtnContainer.classList.add("config-radio-container");
    let radioGroup = document.createElement("div");
    radioGroup.classList.add("config-radio-group");
    radioGroup.appendChild(createRadioDiv(index, "None", "amount", true));
    radioGroup.appendChild(createRadioDiv(index, "Reg", "amount"));
    radioGroup.appendChild(createRadioDiv(index, "Dbl", "amount"));
    radioBtnContainer.appendChild(radioGroup);
    
    //Made radio button group for position of topping
    radioGroup = document.createElement("div");
    radioGroup.classList.add("config-radio-group");
    radioGroup.appendChild(createRadioDiv(index, "Left", "position"));
    radioGroup.appendChild(createRadioDiv(index, "All", "position", true));
    radioGroup.appendChild(createRadioDiv(index, "Right", "position"));
    radioBtnContainer.appendChild(radioGroup);
    toppingRow.appendChild(radioBtnContainer);
    return toppingRow;
}



const createRadioDiv = (index, labelName, groupName, isChecked) => {
    let radioDiv = document.createElement("div");
    radioDiv.classList.add("config-radio-div");
    radioDiv.setAttribute("data-name", `${groupName}-${labelName.toLowerCase()}`);
    //make label. set label for  and label text equal to the name of the label 
    let label = document.createElement("label");
    label.htmlFor = labelName;
    label.innerHTML = labelName;
    //Create radio button and give it its proper group
    let radioBtn = document.createElement("input");
    radioBtn.setAttribute("type", "radio");
    radioBtn.id = labelName + index;
    radioBtn.setAttribute("name", groupName + index);
    radioBtn.setAttribute("value", labelName.toLowerCase());

    //Give radio btn an event listener to know when pizza changed
    radioBtn.addEventListener("input", (event) => {pizzaConfigChange(event.target);});

    //Disable radio buttons by default
    if(labelName == "Left" || labelName == "All" || labelName == "Right") radioBtn.disabled = true;
    //Set default checked
    if(isChecked) radioBtn.checked = true;
    //Append label and btn to container
    radioDiv.appendChild(label);
    radioDiv.appendChild(radioBtn);
    //Return container div
    return radioDiv;

}


const populateDataIntoConfigMenu = pizzaObject => {
    for(topping of pizzaObject.toppings) {
        let configRow = document.querySelector(`[data-topping='${topping.name}']`);
        configRow.querySelector(`[data-name='amount-${topping.quantity}']`).lastChild.checked = true;
        configRow.querySelector(`[data-name='position-${topping.position}']`).lastChild.checked = true;
        enableRadioButtons(configRow.lastChild.lastChild.children);
    }
}


const showConfigMenu = pizzaObject => {
    //Change view with transitions
    document.getElementsByClassName("selection-container")[0].classList.add("hidden");
    document.getElementsByClassName("config-menu")[0].style.display = "";
    setTimeout(() => {
        document.getElementsByClassName("config-menu")[0].classList.remove("hidden");
    }, 500);

    populateDataIntoConfigMenu(pizzaObject);
    updateScreen();

}

const hideConfigMenu = () => {
    //Change view with transitions
    document.getElementsByClassName("config-menu")[0].classList.add("hidden");
    setTimeout(() => {
        document.getElementsByClassName("config-menu")[0].style.display = "none";
        document.getElementsByClassName("selection-container")[0].classList.remove("hidden");
    }, 600);

    //Reset Pizza object
    currPizza = {
        size: "lg",
        toppings: []
    }
}




//Update the pizza object and screen when radio button is changed
const pizzaConfigChange = target => {
    updatePizzaObject();
    toggleAvailabilityOfRadioBtns(target);
    updateScreen();
}

//Update screen
const updateScreen = () => {
    updatePrice();
    updateDescription();
    updatePizzaImage();
}

//Disable LEFT ALL and RIGHT radion buttons when topping is not selected.
const toggleAvailabilityOfRadioBtns = target => {
    if(target.value == "none") {
        //disable btns
        disableRadioButtons(target.parentElement.parentElement.parentElement.lastChild.children);
    }
    else if(target.value == "dbl" || target.value == "reg") {
        //enable btns
        enableRadioButtons(target.parentElement.parentElement.parentElement.lastChild.children);
    }
}

const disableRadioButtons = radioGroup => {
    for(radioDiv of radioGroup) {
        radioDiv.lastChild.disabled = true;
    }
}
const enableRadioButtons = radioGroup => {
    for(radioDiv of radioGroup) {
        radioDiv.lastChild.disabled = false;
    }
}

//Update price on screen
const updatePrice = () => {
    document.getElementsByClassName("total")[0].innerHTML = `Total: $${calculatePrice(currPizza)}`;
    
}

const updatePizzaObject = () => {

    //Find which radio button was checked in the size row
    for(configRadioDiv of document.getElementsByClassName("config-menu")[0].firstChild.getElementsByClassName("config-radio-div")) {
        if(configRadioDiv.lastChild.checked) {
            currPizza.size = configRadioDiv.lastChild.value;
            break;
        }
    }
    let toppingList = [];
    //Loop through toppings rows
    for(let i = 1; i < document.getElementsByClassName("config-row").length; i++) {
        let toppingRow = document.getElementsByClassName("config-row")[i];
        let toppingObject = {name: toppingRow.dataset.topping, position: "", quantity: ""};
        for(amount of toppingRow.getElementsByClassName("config-radio-group")[0].getElementsByClassName("config-radio-div")) {
            if(amount.lastChild.checked) {
                toppingObject.quantity = amount.lastChild.value;
                break;
            }
        }
        for(position of toppingRow.getElementsByClassName("config-radio-group")[1].getElementsByClassName("config-radio-div")) {
            if(position.lastChild.checked) {
                toppingObject.position = position.lastChild.value;
                break;
            }
        }
        if(toppingObject.quantity != "none") toppingList.push(toppingObject);
    }
    currPizza.toppings = toppingList;
    console.log(currPizza);
}

const updateDescription = () => {

    document.getElementsByClassName("order")[0].innerHTML = "";

    let title = document.createElement("h5");
    title.innerHTML = `${currPizza.size} Pizza`;

    let list = document.createElement("ul");
    for(topping of currPizza.toppings) {
        let item = document.createElement("li");
        item.innerHTML = `${topping.quantity} ${topping.name} on ${topping.position}`;
        list.appendChild(item);
    }
    document.getElementsByClassName("order")[0].appendChild(title);
    document.getElementsByClassName("order")[0].appendChild(list);
}

const updatePizzaImage = () => {

}