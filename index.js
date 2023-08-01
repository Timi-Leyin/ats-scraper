import express from "express"
import cors from "cors"


import  puppeteer from 'puppeteer';
import { writeFile } from 'fs';
import { join } from "path";



const WriteToJson = (jsonObj)=>{
  // Convert JavaScript object to JSON string
  const jsonData = JSON.stringify(jsonObj, null, 2);
  
  // Replace 'data.json' with the desired filename
  const filename = join("./public","data.json")
  
  // Write the JSON data to the file
    writeFile(filename, jsonData, (err) => {
    if (err) {
      console.error('Error writing to JSON file:', err);
    } else {
      console.log(`Data successfully written to ${filename}`);
    }
  });
  
  }




// express
const app = express()
app.use(cors("*"))
app.use(express.static("public"))
app.use("/",(req, res)=>{
  (async () => {
    try {
        console.log("Launching ...");
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        console.log("Opening Site....");

        const domains = [];
        
        for(let i =1;i<1000;i++){
            const URL ="https://www.atslibrary.com/shop/page/"+i
            const loadPage = await page.goto(URL, {
                waitUntil: "load",
                timeout: 0,
              });
              
              const status = loadPage?.status();
              console.log("Status:", status);
              // Set screen size
              await page.setViewport({width: 1080, height: 1024});
              console.log("Scrapping ...");
          
              // Get data from website
              await page.waitForSelector(".site-main ul.products")
              const domainResults = await page.$$(
                "ul.products li"
              );
              // console.log(domainResults)
              for (let domainResult of domainResults) {
                const domainInfo = await domainResult.evaluate((node) => {
                  const link = node.querySelector(".woocommerce-LoopProduct-link.woocommerce-loop-product__link");
                  const discount = node.querySelector(".woocommerce-LoopProduct-link.woocommerce-loop-product__link");
                  const title = node.querySelector(".woocommerce-loop-product__title");
                  const categories = node.querySelector(".product__categories");
                  const price1 = node.querySelector(".price del");
                  const price2 = node.querySelector(".price ins");
                  const thumb = node.querySelector("img.attachment-woocommerce_thumbnail");
                  // console.log(price)
                  return {
                    link: link.href,
                    title: (title.innerText || ""),
                    categories: categories.innerText,
                    price1:price1 && price1.textContent,
                    discount:discount.innerText,
                    price2:price2 && price2.textContent,
                    thumb: thumb.src,
                  };
                });
                domains.push(domainInfo);
              }
             
            console.log("Closing...");
        }
        console.log("Done 🚀");
        
        // close the browser when actions completed
        await browser.close();
        WriteToJson(domains)
      } catch (error) {
        console.log(error);
      }
})();
res.send("Updating")
})
app.listen(process.env.PORT || 5000,()=> console.log("Server is running"))