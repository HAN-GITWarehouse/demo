'use strict';

const { v4: uuidv4 } = require('uuid');
const xml2js = require('xml2js');
const fs = require('fs');
const xmlQuery = require('xml-query');
const XmlReader = require('xml-reader');
module.exports = () => {
    const parser = new xml2js.Parser();

    // this example reads the file synchronously
    // you can read it asynchronously also
    let xml_string = fs.readFileSync("./src/assets/docs/cf4ba559-4c42-4c73-be9c-9ba5e7adeed5/ppt/slides/slide1.xml", "utf8");
    // console.log(xml_string);
    const ast = XmlReader.parseSync(xml_string);
    // const cSld = 
}