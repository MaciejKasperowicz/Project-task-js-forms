// const txt = `"1","Ogrodzieniec","Zamek Ogrodzieniec – ruiny zamku leżącego na Jurze Krakowsko-Częstochowskiej, wybudowanego w systemie tzw. Orlich Gniazd, we wsi Podzamcze w województwie śląskim, w powiecie zawierciańskim, około 2 km na wschód od Ogrodzieńca. Zamek został wybudowany w XIV – XV w. przez ród Włodków Sulimczyków.","99PLN","50PLN"
// "2","Ojców","wieś w województwie małopolskim, w powiecie krakowskim, w gminie Skała, na terenie Wyżyny Krakowsko-Częstochowskiej, w Dolinie Prądnika, na Szlaku Orlich Gniazd. W Królestwie Polskim istniała gmina Ojców. W latach 1975–1998 miejscowość położona była w województwie krakowskim. W latach 1928–1966 Ojców miał status uzdrowiska posiadającego charakter użyteczności publicznej.","40PLN","15PLN`;

// console.log( txt.split(/[\r\n]+/gm) );

const uploaderInput = document.querySelector(".uploader__input");
const excursions = document.querySelector(".excursions");
const excursionsItem = document.querySelector(".excursions__item ");
const summaryPricesAdults = document.querySelector(".summary__prices--adults");
const summaryPricesChildren = document.querySelector(".summary__prices--children");


uploaderInput.addEventListener("change", readFile);
excursions.addEventListener("click", addExcursionsToSummary)

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
        console.log({excursion, adultPrice, childPrice})
        const excursionInputs = document.querySelectorAll(`[data-excursion=${excursion}]`);
        // console.log(excursionInputs);
        function getInputValue(inputName){
            return [...excursionInputs].filter(input=> input.name === inputName)[0].value;
        }
        // const priceAdultInput = [...excursionInputs].filter(input=> input.name === "adults");
        const adultsNumber = getInputValue("adults");
        const childrenNumber = getInputValue("children");
        summaryPricesAdults.textContent = "";
        summaryPricesChildren.textContent = "";
        
        if(adultsNumber > 0 && childrenNumber > 0){
            summaryPricesAdults.textContent = `Dorośli: ${adultsNumber} x ${adultPrice} PLN`;
            summaryPricesChildren.textContent = `Dzieci: ${childrenNumber} x ${childPrice} PLN`;
        } else if(adultsNumber > 0){
            summaryPricesAdults.textContent = `Dorośli: ${adultsNumber} x ${adultPrice} PLN`;
        } else if(childrenNumber >0){
            summaryPricesChildren.textContent = `Dzieci: ${childrenNumber} x ${childPrice} PLN`;
        }
    }
    
}