const fs = require("fs");
const request = require("request");
const cheerio = require("cheerio");

const crawler = require("./crawler/index.js")(request, cheerio, fs);

let url = "http://www.animesorion.tv/42602";
//let urlVideo = "http://www.animesorion.tv/70555";


let main = () => {
	try {
		request(url, (error, response, html) => {
			if(error) throw error;

			let $ = cheerio.load(html);
			$("#lcp_instance_0").each( (index, element) => {
				process.stdout.write("Accessing the main content\n");
				crawler.downloadvideos(element.children);
			});
		});
	}
	catch (err) {
		console.error(err);
	}
};

main();