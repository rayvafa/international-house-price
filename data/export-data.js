var xlsx = require('node-xlsx');
var fs = require('fs');

var hp1602 = xlsx.parse(__dirname + '/hp1602/hp1602.xlsx');

hp1602.map((sheet, index) => {
    if(!index) return;
    const sheetJSON = JSON.stringify(sheet);
    fs.writeFile(__dirname + `/hp1602/raw-json/${sheet.name}.json`, sheetJSON, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log(`The ${sheet.name} sheet was saved!`);
    });

    let newJSONStructure = { name: sheet.name };

    let countriesData = [];
    for(let counter = 1; counter <= sheet.data[0].length; counter++) {
        const countryName = sheet.data[0][counter];
        if(!countryName) continue;
        let countryDataArray = [];
        for(let dataCounter = 2; dataCounter <= sheet.data.length; dataCounter++) {
            if(!sheet.data[dataCounter])continue;
            const quarterValue = sheet.data[dataCounter][counter];
            countryDataArray.push({
                date: sheet.data[dataCounter][0],
                value: quarterValue
            });
        }
        let countryObj = { name: countryName, data: countryDataArray };
        countriesData.push(countryObj);
    }
    newJSONStructure.data = countriesData;
    fs.writeFile(__dirname + `/hp1602/structured-json/${sheet.name}.json`, JSON.stringify(newJSONStructure), function(err) {
        if(err) {
            return console.log(err);
        }

        console.log(`Re-structured ${sheet.name} sheet was saved!`);
    });
});
