module.exports = (request, cheerio, fs) => {
    
    let accessContentLiUrl = (element) => {
        return new Promise( (resolve, reject) => {
            request(element.href, (err, res, html) => {
                if(err) throw err;

                let $ = cheerio.load(html);
                let src = $("#aba1-video1").get(0).children[1].children[3].children[1].attribs.src;
                let uploadedSize = 0;
                let videoSize = 0;

                request(src, { followAllRedirects: true })
                .on("data", (data) => {
                    let segmentLength = data.length;
                    uploadedSize += segmentLength;
                    let percent = (uploadedSize/videoSize*100).toFixed(2);
                    process.stdout.write(`Downloading ${element.title}: ${percent}%\n`);
                    if(percent >= 100) {
                        resolve(`${element.title}.mp4 downloaded \n`);
                    };
                })
                .on("response", (response) => {
                    videoSize = response.toJSON().headers["content-length"];
                    process.stdout.write("Starting to download the file.\n");
                })
                .on("error", (err) => {
                    console.error(err);
                    reject();
                })
                .pipe(fs.createWriteStream(`./download/${element.title}.mp4`));
            });
        });
    };

    let downloadvideos = async function (videos) {
        try {
            let element;
            for (let video of videos) {
                element = video.children[0].attribs;
                let result = await accessContentLiUrl(video.children[0].attribs);
                process.stdout.write(result);
            }
        }
        catch (err) {
            if(err.message.contains("ECONNRESET")){
                await accessContentLiUrl(element);
            }
            console.error(err);
        }
    }

    return {
        accessContentLiUrl: accessContentLiUrl,
        downloadvideos: downloadvideos
    }
}