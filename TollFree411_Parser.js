const cheerio = require('cheerio');
const fs = require('fs').promises;
const sleep = require('system-sleep')
const xlsx = require('xlsx')
//path of dir to read the files
let filepath = '../puppFiles/411_Bus/3/411_5'


let multiArr = []
let StoresArr = []




fs.readdir(filepath).then(function (files) {
    console.log(files)
    files.forEach(file => {
        fs.readFile(`${filepath}/${file}`).then(function (html) {
            console.log(file);
            let Store = new Object()
            const $ = cheerio.load(html)

            if ($('.no-results-group').length > 0) {
                Store.Error = $('.h4').text().trim();
                Store.BusinessNumber = file.substr(file.indexOf('_') + 1, 10);
                Store.Name = null
                Store.Address = null
                Store.City = null
                Store.Province = null
                Store.PostCode = null
                Store.PhoneNumber = null
                Store.ListingUrl = null

            }
            else if ($('.listing-card').length > 0) {
                let listing = $('.listing-card');
                for (let i = 0; i < listing.length; i++) {
                    let Store = new Object()
                    Store.Error = null;
                    Store.BusinessNumber = file.substr(file.indexOf('_') + 1, 10);
                    Store.Name = listing.eq(i).find("h4[itemprop = 'name']").text().trim();
                    Store.Address = listing.eq(i).find("span[itemprop = 'streetAddress']").text().trim().replace(/,/g, '');
                    Store.City = listing.eq(i).find("span[itemprop = 'addressLocality']").text().trim().replace(/,/g, '');
                    Store.Province = listing.eq(i).find("span[itemprop = 'addressRegion']").text().trim().replace(/,/g, '');
                    Store.PostCode = listing.eq(i).find("span[itemprop = 'postalCode']").text().trim();
                    Store.PhoneNumber = listing.eq(i).find("span[itemprop = 'telephone']").text().trim();
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

            return StoresArr

        }).then(function (StoresArr) {
            console.log(StoresArr.length)
            var newWB = xlsx.utils.book_new();
            var newWS = xlsx.utils.json_to_sheet(StoresArr);
            xlsx.utils.book_append_sheet(newWB, newWS, 'TollFree411');//workbook name as param 
            xlsx.writeFile(newWB, "../puppFiles/411_Bus/3/411_Bus_5.xlsx");//file name as param
        })

    })

})



