const cheerio = require('cheerio');
const fs = require('fs')
const sleep = require('system-sleep')
const xlsx = require('xlsx')
let filepath = '\TollFree411'


let multiArr = []
let StoresArr = []




fs.readdir(filepath, (err, files) => {
    console.log(files)
    files.forEach(file => {
        fs.readFile(`${filepath}/${file}`, (err, html) => {

            if (err) console.log(err);
            else {
                console.log(file);
                let Store = new Object()
                const $ = cheerio.load(html)

                if ($('.no-results-group').length > 0) {
                    Store.Error = $('.h4').text().trim();
                    Store.TollFreeNumber = file.substr(file.indexOf('_')+1,10);
                }
                else if ($('.listing-card').length > 0) {
                    let listing = $('.listing-card');
                    for (let i = 0; i < listing.length; i++) {
                        let Store = new Object()
                        Store.Name = listing.eq(i).find("h4[itemprop = 'name']").text().trim();
                        Store.Address = listing.eq(i).find("span[itemprop = 'streetAddress']").text().trim().replace(/,/g, '');
                        Store.City = listing.eq(i).find("span[itemprop = 'addressLocality']").text().trim().replace(/,/g, '');
                        Store.Province = listing.eq(i).find("span[itemprop = 'addressRegion']").text().trim().replace(/,/g, '');
                        Store.PostCode = listing.eq(i).find("span[itemprop = 'postalCode']").text().trim();
                        Store.PhoneNumber = listing.eq(i).find("span[itemprop = 'telephone']").text().trim();
                        Store.TollFreeNumber = file.substr(file.indexOf('_')+1,10);
                        Store.ListingUrl = 'https://411.ca/' + listing.eq(i).find("a[itemprop = 'url']").attr('href').trim();

                        multiArr.push(Store)

                    }

                }

                if (multiArr.length > 0) {
                    StoresArr = StoresArr.concat(multiArr)
                    multiArr = []
                }
                else {
                    StoresArr.push(Store)
                }

            }
        })

    })


})


sleep(5000);
var newWB = xlsx.utils.book_new();
var newWS = xlsx.utils.sheet_add_json(newWB.Sheets['TollFree411'],StoresArr);
xlsx.utils.book_append_sheet(newWB,newWS,'TollFree411');//workbook name as param 
xlsx.writeFile(newWB,"TollFree411.xlsx");//file name as param







