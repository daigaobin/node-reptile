/**
 * 获取依赖
 * @type {*}
 */
const superagent = require('superagent');
const charset = require('superagent-charset');
const cheerio = require('cheerio');
const fs = require('fs');
charset(superagent); //设置字符
/**
 * 定义请求地址
 * @type {*}
 */
const reptileUrl = "http://cwzx.shdjt.com/jgtop500.asp";
/**
 * 处理空格和回车
 * @param text
 * @returns {string}
 */
function replaceText(text) {
    return text.replace(/\n/g, "").replace(/\s/g, "");
}

let links = [];

function init() {
    superagent.get(reptileUrl).set('User-Agent',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36')
        .end(function (err, res) {
            // 抛错拦截
            if (err) {
                return console.error(err);
            }

            let $ = cheerio.load(res.text);
            //console.log(res.text);
            // console.log($('.tdleft tr a').length);
            $('.tdleft tr a').each(function (i, elem) {
                let _this = $(elem);
                links.push('http://cwzx.shdjt.com/' + _this.attr('href'));
            });

            crawlData();

        });
}

function crawlData() {
    if(!links.length) {
        return;
    }

    let jsonData = [];

    links.forEach((link,index) => {
        console.log('开始:',index);
        superagent.get(link).charset().set('User-Agent',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36')
        .end(function (err, res) {
            // 抛错拦截
            if (err) {
                return console.error(err);
            }

            let $ = cheerio.load(res.text);
            //console.log(res.text);
            // console.log($('.tdleft tr a').length);
            $('.tb0td1 tr').each(function (i, elem) {
                let tds = elem.children;
                if(!i) return;
                jsonData.push({
                    id: $(tds[0]).text(),
                    stockCode: $(tds[1]).text(),
                    stockName: $(tds[2]).text(),
                    originalPrice: $(tds[3]).text(),
                    currentPrice: $(tds[4]).text(),
                    intervalGain: $(tds[5]).text(),
                    shareholderType: $(tds[6]).text(),
                    updateDate: $(tds[7]).text(),
                    companyName: $(tds[8]).text(),
                    quantity: $(tds[9]).text(),
                    marketValue: $(tds[10]).text(),
                    proportion: $(tds[12]).text(),
                    stockType: $(tds[13]).text(),
                    operationType: $(tds[14]).text(),
                    changeQuantity: $(tds[15]).text(),
                });
            });

        });
    })

    fs.writeFile(__dirname + '/data/article.json', JSON.stringify({
        status: 0,
        data: jsonData
    }), function (err) {
        if (err) throw err;
        console.log('写入完成');
    });
}

init();


/**
 * 核心业务
 * 发请求，解析数据，生成数据
 */
/* superagent.get(reptileUrl).set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36').end(function (err, res) {
    // 抛错拦截
    if (err) {
        return console.error(err);
    }
    // 解析数据
    let $ = cheerio.load(res.text);
    console.log(res.text);
    let data = [];
    // 获取数据
    $('#list-container .note-list li').each(function (i, elem) {
        let _this = $(elem);
        data.push({
            id: _this.attr('data-note-id'),
            slug: _this.find('.title').attr('href').replace(/\/p\//, ""),
            author: {
                //slug: _this.find('.avatar').attr('href').replace(/\/u\//, ""),
                //avatar: _this.find('.avatar img').attr('src'),
                nickname: replaceText(_this.find('.blue-link').text()),
                sharedTime: _this.find('.time').attr('data-shared-at')
            },
            title: replaceText(_this.find('.title').text()),
            abstract: replaceText(_this.find('.abstract').text()),
            thumbnails: _this.find('.wrap-img img').attr('src'),
            collection_tag: replaceText(_this.find('.collection-tag').text()),
            reads_count: replaceText(_this.find('.ic-list-read').parent().text()) * 1,
            comments_count: replaceText(_this.find('.ic-list-comments').parent().text()) * 1,
            likes_count: replaceText(_this.find('.ic-list-like').parent().text()) * 1
        });
    });
    // 生成数据
    // 写入数据, 文件不存在会自动创建
    fs.writeFile(__dirname + '/data/article.json', JSON.stringify({
        status: 0,
        data: data
    }), function (err) {
        if (err) throw err;
        console.log('写入完成');
    });
}); */