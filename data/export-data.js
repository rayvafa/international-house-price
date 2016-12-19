var xlsx = require('node-xlsx');
var fs = require('fs');

var hp1602 = xlsx.parse(__dirname + '/hp1602/hp1602.xlsx');

hp1602.map((sheet, index) => {
    if(!index) return;
    fs.writeFile(__dirname + `/hp1602/${sheet.name}.json`, JSON.stringify(sheet), function(err) {
        if(err) {
            return console.log(err);
        }

        console.log(`The ${sheet.name} sheet was saved!`);
    });
});
