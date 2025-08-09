#!/bin/bash

read -p "Numéro de la décision (ex: 0003) : " num
read -p "Titre de la décision : " title

filename="docs/adr/${num}-$(echo $title | tr '[:upper:]' '[:lower:]' | tr ' ' '-').md"

cp docs/adr/adr-template.md "$filename"
echo "✅ Fichier ADR créé : $filename"
