var tableHasContent = false;

const userInput = document.getElementById("userInput");


userInput.addEventListener("input", updateTable);

function updateTable(event) {
    if(userInput.value == "" || userInput.value.isEmpty) {
        tableHasContent = false;
        dataTable.style.display="none";
    }
    else {
        tableHasContent = true;
        dataTable.style.display="table";
    }

    if(tableHasContent == true) {
        parseData();

        document.getElementById("dataTableHead").innerHTML = '';    //clear table
        document.getElementById("dataTableBody").innerHTML = '';    //clear table

        //add data to table
        const tableBody = document.getElementById("dataTableBody");
        const tableHead = document.getElementById("dataTableHead");
        
        //insert cells
        let newRow = tableHead.insertRow();

        newRow.insertCell(0).innerHTML = null;
        for(let i = 0; i<deliveryArr.length; i++) {
            newRow.insertCell(i+1).innerHTML = ""+(i+1);
            newRow.cells[i+1].outerHTML = "<th>"+(i)+"</th>";
        }

        let newRow2 = tableBody.insertRow();
        
        newRow2.insertCell(0).innerHTML = "Delivery";
        newRow2.cells[0].outerHTML = "<th>Delivery</th>";
        for(let i = 0; i<deliveryArr.length; i++) {
            newRow2.insertCell(i+1).innerHTML = deliveryArr[i];
        }

        let newRow3 = tableBody.insertRow();
        
        newRow3.insertCell(0).innerHTML = "Pickup";
        newRow3.cells[0].outerHTML = "<th>Pickup</th>";
        for(let i = 0; i<deliveryArr.length; i++) {
            newRow3.insertCell(i+1).innerHTML = pickupArr[i];
        }

        let newRow4 = tableBody.insertRow();
        
        newRow4.insertCell(0).innerHTML = "Balance";
        newRow4.cells[0].outerHTML = "<th>Balance</th>";
        for(let i = 0; i<deliveryArr.length; i++) {
            newRow4.insertCell(i+1).innerHTML = balanceArr[i];
        }

        
    }
}

var textArr;

var deliveryArr = [];
var pickupArr = [];
var balanceArr = [];

function parseData() {
    deliveryArr = [];
    pickupArr = [];
    balanceArr = [];

    textArr = userInput.value.split("\n");
    // console.log(JSON.stringify(textArr));


    for(let i = 0; i<textArr.length; i++) {
        if(textArr[i].includes("delivery")) deliveryArr.push(extractNumber(textArr[i]));
        else if(textArr[i].includes("pickup")) pickupArr.push(extractNumber(textArr[i]));
        else if(textArr[i].includes("balance")) balanceArr.push(extractNumber(textArr[i]));
    }

    // console.log(JSON.stringify(deliveryArr));
    // console.log(JSON.stringify(pickupArr));
    // console.log(JSON.stringify(balanceArr));

    // console.log(deliveryArr.length);
    // console.log(pickupArr.length);
    // console.log(balanceArr.length);

    
}

function extractNumber(line) {
    let number = "";
    for(let i = 0; i < line.length; i++) {
        if(Number.isInteger(Number(line.charAt(i))) == true) number = number + line.charAt(i);
    }
    number = Number(number);

    return number;
}


var MAX_DELIVER = 20;
var MAX_PICKUP = 20;

var stockBalance = 0;
var delivery = 0;
var pickup = 0;

var str = "";

var day = 1;
var tempBalance = stockBalance;
var tempDelivery = delivery;
var tempPickup = pickup;

function randomData() {
    userInput.value = "";
    
    stockBalance = 0;
    delivery = 0;
    pickup = 0;

    var str = "";
    
	day = 0;
    // tempBalance = stockBalance;
    // tempDelivery = delivery;
    // tempPickup = pickup;

    while(1) {
        console.log("test");
		tempBalance = stockBalance;
		tempDelivery = delivery;
		tempPickup = pickup;

		delivery = getRndInteger(0, MAX_DELIVER+1);  //generate rand num from 0 to MAX_DELIVER
		pickup = getRndInteger(0, MAX_PICKUP+1);
		
		if (pickup > (stockBalance + delivery)) {
			stockBalance = tempBalance;
			delivery = tempDelivery;
			pickup = tempPickup;
			continue;
			day--;
		}
		
		stockBalance = stockBalance + delivery - pickup;

		// printf("-----[DAY %d]-----\ndelivery: %d\npickup: %d\nbalance: %d\n", day, delivery, pickup, stockBalance);
		
        str += "-----[DAY "+day+"]-----\n"+"delivery: "+delivery+"\n"+"pickup: "+pickup+"\n"+"balance: "+stockBalance+"\n";
        

		day++;
		if ((stockBalance == 0 && getRndInteger(0,2) == 1) || day > 40) break;
	}
        if(day > 40 || day < 4) { //day > 40-1 || day < 4-1   b/c of day++ before this conditional
            randomData();
            return;
        }

        userInput.value = str;
        updateTable();
        findWorkDays();     //find workable days automatically
}


function getRndInteger(min, max) {  //stole this from https://www.w3schools.com/js/js_random.asp
  return Math.floor(Math.random() * (max - min) ) + min;
}   //always returns a random integer between min (included) and max (excluded):

var isWorkDayArr = [];
function findWorkDays() {
    console.log("testing");

    //@@@ add error checking 

    let tempBalance = 0;
    let isWorkDay = true;
    isWorkDayArr = [];
    document.getElementById("workDay").innerHTML="";

    for(let i = 0; i<deliveryArr.length; i++) {
        tempBalance = 0;
        isWorkDay = true;
        

        for(let j = i; j<deliveryArr.length + i; j++) {
            let j2 = j % deliveryArr.length

            if(j2==i) {
                tempBalance += deliveryArr[j2] - pickupArr[j2];
            }
            else {
                tempBalance += deliveryArr[j2] - pickupArr[j2];
            }

            if(tempBalance < 0) {
                isWorkDay = false;
                break;
            }
        }
        
        if(isWorkDay == false)  console.log(i+" is not a work day");
        else {
            console.log("@@@@!!!! "+i+" is a work day");
            isWorkDayArr.push(i);
        }
    }

    for(let i = 0; i < isWorkDayArr.length; i++) {
        document.getElementById("workDay").innerHTML += (i == isWorkDayArr.length - 1) ? isWorkDayArr[i] + " " : isWorkDayArr[i] + ", ";
    }
    if(isWorkDayArr.length > 1)
    document.getElementById("workDay").innerHTML += "are workable days."
    else
    document.getElementById("workDay").innerHTML += "is a workable day."
}