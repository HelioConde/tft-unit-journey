window.JOURNAL_CONFIG={
  "id": "tft-unit-journey",
  "title": "TFT Unit Journey",
  "titleField": "unit",
  "groupFields": [
    "set",
    "patch",
    "unit"
  ],
  "groupLabel": "Unidades por Set e patch",
  "metric": "placement",
  "fields": [
    {
      "key": "set",
      "label": "Set",
      "type": "text",
      "required": true,
      "maxLength": 40,
      "placeholder": "Ex.: Set de teste"
    },
    {
      "key": "patch",
      "label": "Patch",
      "type": "text",
      "required": true,
      "maxLength": 20,
      "placeholder": "Ex.: 26.1"
    },
    {
      "key": "unit",
      "label": "Unidade",
      "type": "text",
      "required": true,
      "maxLength": 50,
      "placeholder": "Ex.: Ahri"
    },
    {
      "key": "placement",
      "label": "Colocação final (1–8)",
      "type": "number",
      "required": true,
      "min": 1,
      "max": 8
    },
    {
      "key": "items",
      "label": "Itens usados (opcional)",
      "type": "text",
      "maxLength": 120,
      "placeholder": "Ex.: itens A, B e C"
    },
    {
      "key": "composition",
      "label": "Composição (opcional)",
      "type": "text",
      "maxLength": 120,
      "placeholder": "Outras unidades importantes"
    },
    {
      "key": "reflection",
      "label": "Observação sobre a partida",
      "type": "textarea",
      "required": true,
      "maxLength": 500,
      "placeholder": "O que funcionou e o que não pode ser concluído desta amostra?"
    },
    {
      "key": "date",
      "label": "Data da partida",
      "type": "date",
      "required": true
    }
  ],
  "demo": [
    {
      "set": "Exemplo fictício",
      "patch": "demo.1",
      "unit": "Ahri",
      "placement": 3,
      "items": "Item A, Item B",
      "composition": "Composição demonstrativa",
      "reflection": "Registro fictício. A colocação é do time, não apenas desta unidade.",
      "date": "2026-10-27"
    },
    {
      "set": "Exemplo fictício",
      "patch": "demo.1",
      "unit": "Ahri",
      "placement": 5,
      "items": "Item C",
      "composition": "Outra composição",
      "reflection": "Amostra manual para testar a média, sem API.",
      "date": "2026-10-27"
    },
    {
      "set": "Exemplo fictício",
      "patch": "demo.1",
      "unit": "Yasuo",
      "placement": 2,
      "items": "Item D",
      "composition": "Composição diferente",
      "reflection": "Registro de exemplo, não meta oficial do Set.",
      "date": "2026-10-27"
    }
  ]
};
