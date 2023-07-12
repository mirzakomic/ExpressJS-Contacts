//* Hier habe ich erstmal alles notwendige importiert

import express from "express";
import fs from "node:fs";
import {URL} from "node:url"

// port, path und parsed content von Contacts

const PORT = 3000;
const contactsPath = new URL("./data/contacts.json", import.meta.url) ;
let contentOfContacts = JSON.parse(fs.readFileSync(contactsPath, {encoding: "utf8"}));

const app = express();

app.use(express.json());

//* gibt alle kontakte aus

app.get("/contacts", (req,res)=> {
    res.json(contentOfContacts);
})

//* gibt bestimmte id vom kontakt aus

app.get("/contacts/:id", (req,res)=> {
    const idPerson = Number(req.params.id);
    const contactById = contentOfContacts.find((person) => person.id === idPerson);
    res.json(contactById);
})

// fügt neuen kontakt hinzu per body (zb thunder client)

app.post("/contacts", (req,res)=> {
    const newContact = req.body;
    contentOfContacts.push(newContact);
    //! 2 damit es übersichtlicher wird
    fs.writeFileSync(contactsPath, JSON.stringify(contentOfContacts, 0, 2))
    res.json("Kontakt wurde hinzugefügt")
})

// aktualisiert den kontakt per body (zb thunder client)

app.put("/contacts/:id", (req,res)=> {
    const editedContact = req.body;
    const idPerson = Number(req.params.id);
    const index = contentOfContacts.findIndex((person) => person.id === idPerson);
    contentOfContacts[index] = editedContact;
    //! 2 damit es übersichtlicher wird
    fs.writeFileSync(contactsPath, JSON.stringify(contentOfContacts, 0, 2))
    res.json("Kontakt wurde geändert")
})

// löscht den kontakt mit der angegebenen id im request

app.delete("/contacts/:id", (req,res)=> {
    const idPerson = Number(req.params.id);
    const index = contentOfContacts.findIndex((person) => person.id === idPerson);
    contentOfContacts.splice(index);
    fs.writeFileSync(contactsPath, JSON.stringify(contentOfContacts, 0, 2))
    res.json("Wurde gelöscht");
})

app.listen(PORT, function(err){
    if (err) console.log("Irgendwas läuft nicht richtig")
    console.log("Bin auf Port:", PORT);
})