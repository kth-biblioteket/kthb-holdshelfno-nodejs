let config = require('./configs/config/config');

holdshelf = require('./holdshelfModel');

const mysql = require("promise-mysql");

var js2xmlparser = require("js2xmlparser");

//Randomskapat cipher som byter ut bokstav mot annan bokstav men behåller andra tecken som de är
//var plain = (function(a,b){while(a--)b[a]=a+65;return b})(32,[]);
//var plain = (function(a,b){while(a--)b[a]=a+97;return b})(26,[]);
//var cipher = shuffle(plain.slice(0));

//TODO
//Kolla primary ID mot LDAP?

var cipher = config.cipher
exports.index = async function (req, res) {
    let crypted_primaryid = encrypt(req.params.primaryid);
    let sql;
    let result;
    let currentnumber;
    let holdshelfnumber;

    const db = await mysql.createConnection({
        host: config.dbhost,
        user: config.dbuser,
        password: config.dbpassword,
        database: config.db
    });

    //hämta aktuell användares högsta löpnummer
    sql = `SELECT max(number) AS number 
            FROM holdshelfnumber
            WHERE userid_encrypted = '${crypted_primaryid}'`;
    result = await db.query(sql);

    if(result.length > 0) {
        for (const row of result) {
            currentnumber = row.number
        }
    } else {
        currentnumber = 0;
    }
    //hämta aktuell användare och additional_id
    sql = `SELECT * 
            FROM holdshelfnumber
            WHERE userid_encrypted = '${crypted_primaryid}' AND additional_id = '${req.params.additional_id}'`;
    result = await db.query(sql);

    //Lägg till ny rad med uppräknat löpnummer om användaren + additional_id inte finns
    if(result.length == 0) {
    sql = `INSERT INTO holdshelfnumber
            VALUES('${crypted_primaryid}',${currentnumber + 1},'${req.params.additional_id}')`;
    result = await db.query(sql);
    }

    //Hämta raden
    sql = `SELECT * 
            FROM holdshelfnumber
            WHERE userid_encrypted = '${crypted_primaryid}' AND additional_id = '${req.params.additional_id}'`;
    result = await db.query(sql);
    if(result.length > 0) {
        for (const row of result) {
            holdshelfnumber = zeroPad(row.number, 3);
            userid_encrypted = row.userid_encrypted;
        }
    }

    var data = {
        "records": result.length,
        "holdshelfnumber": holdshelfnumber,
        "userid_encrypted": userid_encrypted
    };
    xmlres = js2xmlparser.parse("holdshelfnumber",data);
    res.type('application/xml');
    res.send(xmlres);
    //res.json(data);
    db.end();
};

//Funktioner
function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

  
/**
 * 
 * @param {*} o 
 */
function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

/**
 * 
 * @param {*} plainstr 
 */
function encrypt(plainstr)
{    
  var plainArr = plainstr.split('');
  var cryptArr = new Array(plainArr.length);

  for(var i=0;i<cryptArr.length;i++){
     cryptArr[i] = String.fromCharCode(cipher[plainArr[i].charCodeAt(0)-32]);
  }

  return cryptArr.join("");
}

/**
 * 
 * @param {*} cryptstr 
 */
function decrypt(cryptstr)
{
  var cryptArr = cryptstr.split('');
  var plainArr = new Array(cryptArr.length);

  for(var i=0;i<plainArr.length;i++){
     plainArr[i] =  String.fromCharCode(plain[cipher.indexOf(cryptArr[i].charCodeAt(0))]);
  }

  return plainArr.join("");
}