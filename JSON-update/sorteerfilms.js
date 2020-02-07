let xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
        sortFilmObjects.data = JSON.parse(this.responseText);
        sortFilmObjects.addJSDate();

        //caps
        sortFilmObjects.data.forEach( film => {
        film.titelUpper = film.titel.toUpperCase();
        //naam schrijvers 
        film.sortActeur = film.acteur[0];

        });

       //sorteer boeken
        sortFilmObjects.sorteren();
    }
}

xmlhttp.open('GET', "films.json", true);
xmlhttp.send();

const makeHead = (arr) => {
    let kop = "<table class='films'><tr>";
    arr.forEach((item) => {
        kop += "<th>" + item + "</th>";
    });
    kop += "</tr>";
    return kop;
}

const giveMonthNumber = (month) => {
    let number;
    switch(month){
        case "januari":     number = 0; break;
        case "februari":    number = 1; break;
        case "maart":       number = 2; break;
        case "april":       number = 3; break;
        case "mei":         number = 4; break;
        case "juni":        number = 5; break;
        case "juli":        number = 6; break;
        case "augustus":    number = 7; break;
        case "september":   number = 8; break;
        case "oktober":     number = 9; break;
        case "november":    number = 10; break;
        case "december":    number = 11; break;

        default: number = 0;
    }
    return number;
}

const makeValidDate = (monthYear) => {
    let myArray = monthYear.split(" ");
    let date = new Date(myArray[1], giveMonthNumber(myArray[0]));
    return date;
}

const makeSummary = (array) => {
    let string = "";
    for(let i=0; i<array.length; i++){
        switch (i) {
            case array.length-1 : string += array[i]; break;
            case array.length-2 : string += array[i] + " en "; break;
            default: string += array[i] + ", ";
        }
    }
    return string;
}

const keerTekstOn = (string) => {
    if(string.indexOf(',') != -1) {
        let array = string.split(',');
        string = array[1] + ' ' + array[0];
    }
    return string;
}



//sorteren
let sortFilmObjects = {
    data: "",   
    unique: "titelUpper",
    oplopend: 1,
    addJSDate: function () {
        this.data.forEach((item) => {
            item.JSDate = makeValidDate(item.uitgave);
        });
    },
    //sorteren2
    sorteren: function(){
        this.data.sort( (a,b) => a[this.unique] > b[this.unique] ? 1*this.oplopend :  -1*this.oplopend);
        this.uitvoeren(this.data);
    },
    //tabel
    uitvoeren: function(data){
        //leeg
        document.getElementById("films").innerHTML = "";

        data.forEach(films => {
            let sectie = document.createElement('section');
            sectie.className = 'filmSelectie';

            //grid
            let main = document.createElement('main');
            main.className = "filmSelectie__main";

            //cover
            let afbeelding = document.createElement("img");
            afbeelding.className = "filmSelectie__cover";
            afbeelding.setAttribute("src", film.cover);
            afbeelding.setAttribute("alt", keerTekstOn(film.titel));

            //titel
            let titel = document.createElement('h3');
            titel.className = "filmSelectie__titel";
            titel.textContent = keerTekstOn(film.titel);

            //schrijvers
            let acteurs = document.createElement('p');
            acteurs.className = 'filmSelectie__acteurs';
            //namen
            film.acteur[0] = keerTekstOn(film.acteur[0]);
            acteurs.textContent = makeSummary(film.acteur);

            //informatie boeken
            let overig = document.createElement('p');
            overig.className = "filmSelectie__overig";
            overig.textContent = "Datum: " + film.uitgave + " | Pagina's: " + film.paginas + " | Taal: " + film.taal + " | EAN: " + film.ean;


            //prijs van boekem
            let prijs = document.createElement("div");
            prijs.className = "filmSelectie__prijs";
            //prijs van boeken 2
            prijs.textContent = film.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: "currency"});


            sectie.appendChild(afbeelding);
            main.appendChild(titel);
            main.appendChild(acteurs);
            main.appendChild(overig);
            sectie.appendChild(main)
            sectie.appendChild(prijs);
            document.getElementById("films").appendChild(sectie);
        });
    }
}

document.getElementById('kenmerk').addEventListener('change', (e) => {
    sortFilmObjects.unique = e.target.value;
    sortFilmObjects.sorteren();
});

document.getElementsByName('oplopend').forEach((item) => {
    item.addEventListener('click', (e) => {
        sortFilmObjects.oplopend = parseInt(e.target.value);
        sortFilmObjects.sorteren();
    })
})