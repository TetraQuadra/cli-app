### Получаем и выводим весь список контактов в виде таблицы (console.table)

```
node index.js --action list
```

![Скриншот](https://i.imgur.com/sgsHlL6.png)

### Получаем контакт по id - выводим в консоль объект контакта или null, если контакта с таким id не существует.

```
node index.js --action get --id 05olLMgyVQdWRwgKfg5J6
```

![Скриншот](https://i.imgur.com/bJ0wXpp.png)

### Добавляем контакт и выводим в консоль созданный контакт

```
node index.js --action add --name Mango --email mango@gmail.com --phone 322-22-22
```

![Скриншот](https://i.imgur.com/HjnKnC3.png)

### Удаляем контакт и выводим в консоль удаленный контакт или null, если контакта с таким id не существует.

```
node index.js --action remove --id qdggE76Jtbfd9eWJHrssH
```

![Скриншот](https://i.imgur.com/85AVOz3.png)
