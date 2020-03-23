const fs = require('fs')
const puppeteer = require('puppeteer');


var num = [
    '8003517555',
    '8889944054',
    '8775105102',
    '8006674111',
    '8774556699',
    '8003877164',
    '8447785327',
    '8002601952',
    '8447473455',
    '8557073574',
    '8888336962',
    '8667728333',
    '8664652422',
    '8447015048',
    '8662529816',
    '8442147503',
    '8554047009',
    '8773464673',
    '8662793703',
    '8664164532',
    '8666049458',
    '8003635409',
    '8773678731',
    '8005692577',
    '8668057923',
    '8332438738',
    '8002413673',
    '8668449998',
    '8779093626',
    '8554401444',
    '8334496446',
    '8662173570',
    '8779484422',
    '8447331017',
    '8554171766',
    '8665234224',
    '8664758864',
    '8003616615',
    '8887779990',
    '8774652250',
    '8554387241',
    '8559258703',
    '8334299451',
    '8005201464',
    '8442386888',
    '8772748583',
    '8008803452',
    '8003729212',
    '8667000312',
    '8558440199',
    '8448438537',
    '8006442673',
    '8777772471',
    '8333766112',
    '8005676744',
    '8553885914',
    '8885894674',
    '8552731967',
    '8007692500',
    '8558438242',
    '8008473911',
    '8883238692',
    '8006498583',
    '8003910005',
    '8664807532',
    '8002680267',
    '8888375162',
    '8008662453',
    '8668009311',
    '8557590700',
    '8888552477',
    '8665085856',
    '8002113550',
    '8004654553',
    '8772166202',
    '8662928144',
    '8004654299',
    '8885921111',
    '8335302682',
    '8558558765',
    '8007682511',
    '8448734949',
    '8668599509',
    '8664385498',
    '8669828784',
    '8008246200',
    '8888173585',
    '8662642962',
    '8666166245',
    '8009794565',
    '8006688277',
    '8007764737',
    '8443828190',
    '8773194320',
    '8442153762',
    '8003103893',
    '8443689300',
    '8884132161',
    '8665990951',
    '8002678847',
    
];


(async () => {
    
    const browser = await puppeteer.launch({
        headless: false
    })

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1500 });

    await page.goto('https://411.ca/reverse', { waitUntil: 'domcontentloaded' });
    await page.waitFor('body');

    for (i = 0; i < num.length; i++) {
        await page.waitFor(1000)
        await page.type('input[name=q]', num[i])
        await page.click('.btn-search')
        await page.waitForNavigation()
        await page.waitFor('body');
        let html = await page.evaluate((type) => {
            document.querySelector('input[name=q]').value = ''
            return document.body.innerHTML;
        });

        fs.writeFile('TollFree411/' + `411_${num[i]}.html`, html, function (err) {
            if (err) {
                return console.log(err);
            } else {
                console.log(`file saved 411_${num[i]}.html`);

            }
        })
    }
    browser.close()

})()