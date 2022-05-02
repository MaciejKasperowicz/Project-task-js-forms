// const txt = `"1","Ogrodzieniec","Zamek Ogrodzieniec – ruiny zamku leżącego na Jurze Krakowsko-Częstochowskiej, wybudowanego w systemie tzw. Orlich Gniazd, we wsi Podzamcze w województwie śląskim, w powiecie zawierciańskim, około 2 km na wschód od Ogrodzieńca. Zamek został wybudowany w XIV – XV w. przez ród Włodków Sulimczyków.","99PLN","50PLN"
// "2","Ojców","wieś w województwie małopolskim, w powiecie krakowskim, w gminie Skała, na terenie Wyżyny Krakowsko-Częstochowskiej, w Dolinie Prądnika, na Szlaku Orlich Gniazd. W Królestwie Polskim istniała gmina Ojców. W latach 1975–1998 miejscowość położona była w województwie krakowskim. W latach 1928–1966 Ojców miał status uzdrowiska posiadającego charakter użyteczności publicznej.","40PLN","15PLN`;

// console.log( txt.split(/[\r\n]+/gm) );

const uploaderInput = document.querySelector(".uploader__input");
const excursions = document.querySelector(".excursions");
const excursionsItem = document.querySelector(".excursions__item ");
const orderPanel = document.querySelector(".panel__order")
const summaryPanel = document.querySelector(".panel__summary");
const summaryItem = document.querySelector(".summary__item");
const totalPriceValue = document.querySelector(".order__total-price-value");
const orderInputs = document.querySelectorAll(".order__field-input");
const orderSubmitBtn = document.querySelector(".order__field-submit");


let summaryItemID = 1;
let totalPrice = 0;
const validatorObject ={
    name: null,
    email: null
}

uploaderInput.addEventListener("change", readFile);
excursions.addEventListener("click", addExcursionsToSummary);
// orderInputs.forEach(orderInput => {
//     orderInput.addEventListener("change", handleOrder)
// });
orderPanel.addEventListener("change", handleValid);
orderPanel.addEventListener("submit", e => {
    e.preventDefault();
    const isValid = Object.values(validatorObject).every(item => item);
    console.log(isValid);
})

function validate(value, input){
    let re;
    if(input === "name"){
        // re = /[AaĄąBbCcĆćDdEeĘęFfGgHhIiJjKkLlŁłMmNnŃńOoÓóPpRrSsŚśTtUuWwYyZzŹźŻż]/
        re = /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/
    } else {
        re = /\S+@\S+\.\S+/;
    }
    return re.test(value);
}

function handleValid(e){
    console.log(e.target)
    if(e.target.name === "name"){
        validatorObject.name = validate(e.target.value, "name")
    } else {
        validatorObject.email = validate(e.target.value, "email")
    }
}


function readFile(e){
    const file = e.target.files[0];
    if(file && file.type.includes("csv")){
        const reader = new FileReader();
        reader.onload = function(readEvent){
            const content = readEvent.target.result;
            const contentArr = content.split(/[\r\n]+/gm);
            addExcursionsToDOM(contentArr)
        };
        reader.readAsText(file, "UTF-8");
    } else {
        alert("Wybierz plik w formacie .csv")
    }
}



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

        // const title = splittedWordsArr[1].slice(1, splittedWordsArr[1].length - 1)
        const title = removeQuotes(splittedWordsArr[1]);
        let description = splittedWordsArr.slice(2,(splittedWordsArr.length-2)).toString();
        description = removeQuotes(description);
        // description = removeQuotes(description);
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
        excursions.appendChild(excItem)
    })
}


function addExcursionsToSummary(e){
    e.preventDefault();
    // console.log("e.target", e.target)
    // console.log("e.currentTarget", e.currentTarget)
    const self = e.target;
    
    if(self.classList.contains("excursions__field-input--submit")){
        // console.log(self.dataset)
        const {excursion, adultPrice, childPrice} = self.dataset;
        // console.log({excursion, adultPrice, childPrice})
        const excursionInputs = document.querySelectorAll(`[data-excursion=${excursion}]`);
        // console.log(excursionInputs);
        function getInput(inputName){
            return [...excursionInputs].filter(input=> input.name === inputName)[0];
        }
        // const priceAdultInput = [...excursionInputs].filter(input=> input.name === "adults");
        const adultsInput = getInput("adults");
        const childrenInput = getInput("children");
        const adultsNumber = adultsInput.value;
        const childrenNumber = childrenInput.value

        totalPrice = adultsNumber * adultPrice + childrenNumber * childPrice;
        
        

        if(adultsNumber || childrenNumber){
            const newSummaryItem = summaryItem.cloneNode(true);
            newSummaryItem.id = summaryItemID;
            newSummaryItem.value = totalPrice;
            newSummaryItem.classList.remove("summary__item--prototype");
            const summaryItemName = newSummaryItem.querySelector(".summary__name");
            const summaryItemTotalPrice = newSummaryItem.querySelector(".summary__total-price");
            const summaryItemRemoveBtn = newSummaryItem.querySelector(".summary__btn-remove");
            const summaryPricesAdults = newSummaryItem.querySelector(".summary__prices--adults");
            const summaryPricesChildren = newSummaryItem.querySelector(".summary__prices--children");
            
            summaryItemRemoveBtn.id = summaryItemID;
            summaryItemName.textContent = excursion;
            summaryItemTotalPrice.textContent = `${totalPrice} PLN`
            summaryPricesAdults.textContent = `Dorośli: ${adultsNumber?adultsNumber:0} x ${adultPrice} PLN`;
            summaryPricesChildren.textContent = `Dzieci: ${childrenNumber?childrenNumber:0} x ${childPrice} PLN`;

            
            totalPriceValue.innerText = Number(totalPriceValue.innerText) + Number(totalPrice)

            summaryItemID++
            summaryPanel.appendChild(newSummaryItem);
            adultsInput.value = "";
            childrenInput.value = "";

            function handleRemove(e){
                e.preventDefault()
                // console.log(e.target)
                const summaryItems = document.querySelectorAll(".summary__item");
                summaryItems.forEach(summaryItem => {
                    // console.log(summaryItem)
                    if (summaryItem.id === e.target.id) {
                        summaryPanel.removeChild(summaryItem);
                        totalPriceValue.innerText = Number(totalPriceValue.innerText) - Number(summaryItem.value);
                    }
                })
            }

            summaryItemRemoveBtn.addEventListener("click", handleRemove)
            
        }
        

    }
    
}