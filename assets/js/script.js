// const txt = `"1","Ogrodzieniec","Zamek Ogrodzieniec – ruiny zamku leżącego na Jurze Krakowsko-Częstochowskiej, wybudowanego w systemie tzw. Orlich Gniazd, we wsi Podzamcze w województwie śląskim, w powiecie zawierciańskim, około 2 km na wschód od Ogrodzieńca. Zamek został wybudowany w XIV – XV w. przez ród Włodków Sulimczyków.","99PLN","50PLN"
// "2","Ojców","wieś w województwie małopolskim, w powiecie krakowskim, w gminie Skała, na terenie Wyżyny Krakowsko-Częstochowskiej, w Dolinie Prądnika, na Szlaku Orlich Gniazd. W Królestwie Polskim istniała gmina Ojców. W latach 1975–1998 miejscowość położona była w województwie krakowskim. W latach 1928–1966 Ojców miał status uzdrowiska posiadającego charakter użyteczności publicznej.","40PLN","15PLN`;

// console.log( txt.split(/[\r\n]+/gm) );

//MODAL
const modal = document.querySelector(".modal");
const modalBtn = document.querySelector(".closeBtn");
const modalAddress = document.querySelector(".modal__address");
const modalPrice = document.querySelector(".modal__price");
modalBtn.addEventListener("click", closeModal);
window.addEventListener("click", closeModal);



function showModal(){
    modal.style.display = "block";
    modalAddress.textContent = orderEmail.value;
    modalPrice.textContent = totalPrice;
    
    clearData();
}
function closeModal(e){
    if(e.target === modalBtn || e.target === modal){
        setPanelFormHeight();
        modal.style.display = "none";
    }
}

function clearData(){
    orderName.value = "";
    orderEmail.value = "";
    totalPrice = 0;
    summaryPanel.innerHTML = '';
    totalPriceValue.textContent = 0;
    for (const key in validatorObject) {
        validatorObject[key] = null;
    }
}
//END MODAL



//HTML ELEMENTS
const root = document.querySelector(':root');

const panelForm = document.querySelector(".panel__form");
const uploaderInput = document.querySelector(".uploader__input");
const excursions = document.querySelector(".excursions");
const excursionsItem = document.querySelector(".excursions__item ");
const orderPanel = document.querySelector(".panel__order")
const summaryPanel = document.querySelector(".panel__summary");
const summaryItem = document.querySelector(".summary__item");
const totalPriceValue = document.querySelector(".order__total-price-value");
const orderInputs = document.querySelectorAll(".order__field-input");
const orderSubmitBtn = document.querySelector(".order__field-submit");
const orderName = document.querySelector("[name=name]");
const orderEmail = document.querySelector("[name=email]");
const tooltipTextTotalPrice = document.querySelector(".tooltiptext--total-price");
const tooltipTextName = document.querySelector(".tooltiptext--name");
const tooltipTextEmail = document.querySelector(".tooltiptext--email");

//Set PanelFormHeight for smaller screens
function setPanelFormHeight(){
    panelFormHeight = parseInt(window.getComputedStyle(panelForm).height.slice(0, -2));
    root.style.setProperty("--panel__form--height", `${panelFormHeight}px`);
}
//END HTML ELEMENTS
setPanelFormHeight();


//GLOBAL VARIABLES
let summaryItemID = 1;
let totalPrice = 0;
let excursionPrice = 0;
const validatorObject ={
    name: null,
    email: null
}

//END GLOBAL VARIABLES



//FUNCTIONS

//Read .csv file
function readFile(e){
    const file = e.target.files[0];
    if(file && file.type.includes("csv")){
        uploaderInput.classList.remove("uploader__input--shake");
        const reader = new FileReader();
        reader.onload = function(readEvent){
            const content = readEvent.target.result;
            const contentArr = content.split(/[\r\n]+/gm);
            addExcursionsToDOM(contentArr)
        };
        reader.readAsText(file, "UTF-8");
    } else {
        alert("Wybierz plik w formacie .csv");
        uploaderInput.classList.add("uploader__input--shake");
    }
}

//Add Excursions to DOM
function addExcursionsToDOM(data){
    data.forEach(item => {
        const excItem = excursionsItem.cloneNode(true);
        excItem.classList.remove("excursions__item--prototype");

        const excTitle = excItem.querySelector(".excursions__title");
        const excDescription = excItem.querySelector(".excursions__description");
        const excPriceAdult = excItem.querySelector(".excursions__price--adult");
        const excPriceChild = excItem.querySelector(".excursions__price--child");

        const priceAdultInput = excItem.querySelector("[name=adults]");
        const priceChildInput = excItem.querySelector("[name=children]");
        const addOrderInput = excItem.querySelector(".excursions__field-input--submit");
        
        const splittedWordsArr = item.split(',');

        function removeQuotes(word){
            return word.slice(1, word.length - 1)
        }

        const title = removeQuotes(splittedWordsArr[1]);
        let description = splittedWordsArr.slice(2,(splittedWordsArr.length-2)).toString();
        description = removeQuotes(description);
        const priceAdult = removeQuotes(splittedWordsArr[splittedWordsArr.length -2]);
        const priceChild= removeQuotes(splittedWordsArr[splittedWordsArr.length -1]);
        
        excTitle.textContent = title;
        excDescription.textContent = description;
        excPriceAdult.textContent = priceAdult;
        excPriceChild.textContent = priceChild;
        priceAdultInput.dataset.excursion = title
        priceChildInput.dataset.excursion = title;
        addOrderInput.dataset.excursion = title;
        addOrderInput.dataset.adultPrice = priceAdult;
        addOrderInput.dataset.childPrice = priceChild;
        excursions.appendChild(excItem);

        setPanelFormHeight()
    })
}

//Add Excursions to Summary
function addExcursionsToSummary(e){
    e.preventDefault();
    const self = e.target;
    
    if(self.classList.contains("excursions__field-input--submit")){
        const {excursion, adultPrice, childPrice} = self.dataset;
        const excursionInputs = document.querySelectorAll(`[data-excursion=${excursion}]`);
        
        function getInput(inputName){
            return [...excursionInputs].filter(input=> input.name === inputName)[0];
        }
        const adultsInput = getInput("adults");
        const childrenInput = getInput("children");
        const adultsNumber = adultsInput.value;
        const childrenNumber = childrenInput.value

        excursionPrice = adultsNumber * adultPrice + childrenNumber * childPrice;

        if(adultsNumber || childrenNumber){
            const newSummaryItem = summaryItem.cloneNode(true);
            newSummaryItem.id = summaryItemID;
            newSummaryItem.value = excursionPrice;
            newSummaryItem.classList.remove("summary__item--prototype");
            const summaryItemName = newSummaryItem.querySelector(".summary__name");
            const summaryItemTotalPrice = newSummaryItem.querySelector(".summary__total-price");
            const summaryItemRemoveBtn = newSummaryItem.querySelector(".summary__btn-remove");
            const summaryPricesAdults = newSummaryItem.querySelector(".summary__prices--adults");
            const summaryPricesChildren = newSummaryItem.querySelector(".summary__prices--children");
            
            summaryItemRemoveBtn.id = summaryItemID;
            summaryItemName.textContent = excursion;
            summaryItemTotalPrice.textContent = `${excursionPrice} PLN`
            summaryPricesAdults.textContent = `Dorośli: ${adultsNumber?adultsNumber:0} x ${adultPrice} PLN`;
            summaryPricesChildren.textContent = `Dzieci: ${childrenNumber?childrenNumber:0} x ${childPrice} PLN`;

            totalPrice+=excursionPrice;
            
            totalPriceValue.innerText = totalPrice;

            summaryItemID++
            tooltipTextTotalPrice.classList.remove("tooltiptext--visible")
            summaryPanel.appendChild(newSummaryItem);


            setPanelFormHeight()

            adultsInput.value = "";
            childrenInput.value = "";

            function handleRemove(e){
                e.preventDefault()
                const summaryItems = document.querySelectorAll(".summary__item");
                summaryItems.forEach(summaryItem => {
                    if (summaryItem.id === e.target.id) {
                        summaryPanel.removeChild(summaryItem);
                        totalPrice-=summaryItem.value;
                        totalPriceValue.innerText = totalPrice;

                        setPanelFormHeight();
                    }
                })
            }

            summaryItemRemoveBtn.addEventListener("click", handleRemove)
        }
    }
}

//Validate inputs
function validate(value, input){
    let re;
    if(input === "name"){
        re = /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/;
    } else {
        re = /\S+@\S+\.\S+/;
    }
    return re.test(value);
}

//Perform validation
function handleValid(e){
    if(e.target.name === "name"){
        const isValid = validate(e.target.value, "name");
        validatorObject.name = isValid
        if(!isValid){
            tooltipTextName.classList.add("tooltiptext--visible")
        } else {
            tooltipTextName.classList.remove("tooltiptext--visible")
        }

    } else if(e.target.name === "email") {
        const isValid = validate(e.target.value, "email");
        validatorObject.email = isValid
        if(!isValid){
            tooltipTextEmail.classList.add("tooltiptext--visible")
        } else {
            tooltipTextEmail.classList.remove("tooltiptext--visible")
        } 
    }
}
//END FUNCTIONS




//EVENT LISTENERS
uploaderInput.addEventListener("change", readFile);
excursions.addEventListener("click", addExcursionsToSummary);
orderPanel.addEventListener("change", handleValid);
orderPanel.addEventListener("submit", e => {
    e.preventDefault();
    const validatorObjectValues = Object.values(validatorObject);
    if(totalPrice){
        const isValid = validatorObjectValues.every(item => item);
        // console.log(isValid);
        // console.log(totalPrice);
        if(isValid){
            showModal();
        } else{
            for (const key in validatorObject) {
                if(!validatorObject[key]){
                    document.querySelector(`.tooltiptext--${key}`).classList.add("tooltiptext--visible")
                } else{
                    document.querySelector(`.tooltiptext--${key}`).classList.remove("tooltiptext--visible")
                }
            }

        }

    } else{
        tooltipTextTotalPrice.classList.add("tooltiptext--visible")
    }
});
//END EVENT LISTENERS