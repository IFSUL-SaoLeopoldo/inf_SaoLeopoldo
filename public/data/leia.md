# data/
Foi criado o arquivo `dados.json` para que pudessemos ter um único arquivo com os dados utilizados no **mapa** e no **organograma**, utilizei o mesmo formato que aparece no **organograma**.

### Segue o modelo:
```json
{
    "id": <id>,
    "code": <code>,
    "name": <nome>,
    "person": <person>,
    "description": <description>,
    "contacts": {
        "tel": <telephone>,
        "whatsapp": <use whatsapp>,
        "email": <email>,
        "links": [ <list of links> ]
    },
    "parent": <parent id>,
    "defaultCollapsed": <collapsed by default>,
    "roomid": <id of the room>,
    "position": [ <X>, <Y> ]
}
```

Onde:
- **id:** representa o identificador do objeto;
- **code:** representa o código identificador interno no câmpus;
- **name:** representa o nome do objeto;
- **person:** é o nome do coordenador/responsável pelo objeto;
- **description:** descrição do objeto;
- **contacts:**
    - **tel:** é o número de telefone do objeto
    - **whatsapp:** indica se o número deve ser utilizado como whatsapp;
    - **email:** é o email utilizado pelo objeto;
    - **links:** uma lista de links úteis ao objeto;
- **parent:** indica a qual outro objeto o objeto pertence;
- [Organograma] **defaultCollapsed:** indica se o objeto deve estar colapsado por padrão
- [Mapa] **roomid:** o id do marcador da sala ao qual o objeto pertence;
- [Mapa] **position:** uma lista com a posição X e Y do marcador dentro da sala;

### Exemplo:
```json
{
        "id": "PF-GABDIR",
        "code": "PF-GABDIR",
        "name": "Chefia de Gabinete do Diretor-Geral do Campus Passo Fundo",
        "person": "Élder Francisco Fontana Bernardi",
        "contacts": {
            "tel": "+55 54 3312-2746",
            "whatsapp": true
        },
        "parent": "PF-DIRGER",
        "roomid": "gabinete",
        "position": [50, 50]
    }
```
