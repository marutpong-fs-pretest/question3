const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const prepareData = () => {
    return axios
        .get("https://codequiz.azurewebsites.net/", {
            headers: {
                Cookie: "hasCookie=true;",
            },
        })
        .then((response) => {
            return response.data;
        })
        .then((htmlString) => {
            const dom = new JSDOM(htmlString);
            return dom.window.document.querySelectorAll(
                "table tbody tr:not(:first-child)"
            );
        })
        .then((rows) => {
            let data = {};
            rows.forEach((element) => {
                const tds = element.getElementsByTagName("td");
                data[tds[0].innerHTML.trim()] = tds[1].innerHTML.trim();
            });
            return data;
        })
        .catch((error) => {
            console.error(error);
        });
};

const printNav = async (fundName) => {
    const result = await prepareData();
    console.log(result[fundName] ? result[fundName] : `Can not find the NAV for "${fundName}".`);
};

var args = process.argv.slice(2);
if (args.length == 0) {
    console.error("Please enter the Fund Name.")
} else {
    const fundName = args[0];
    printNav(fundName);
}