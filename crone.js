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




