# Правила организации кода проекта

## Форматирование кода

Для форматирования кода в проекте настроен eslint и prettier.

## Деплой

Для деплоя настроены экшены.\
Деплой делается в netlify.

Так же деплой есть для каждого PR, по этому перед тем как его делать,\
убедитесь что в консоли нет предупреждений.

## Структура папок и файлов

Разработка ведется по компонентам.\
Минимальная структура:
 - нужно создать папку внутри `src\components` с названием компонента с заглавной буквы
 - внутри с таким же именем файл `.js` где и будет вестись основная работа

Так как мы разделяем стили и логику, то для стилей можно создать файл `style.js`

Если внутри компонента мы будем использовать другой компонент, то мы создаем подпапку с такой же структурой.
В дальнейшем, если вдруг этот компонент понадобится где-то еще, мы можем перенести его вверх в папку `components`

```
- src

    - components

        - NewComponent

            - SubComponent
                SubComponent.js
                style.css

          NewComponent.js
          style.js
```

## Порядок импорта

Импорт стараемся группировать.
 - реакт
 - сторонние компоненты
 - наши компоненты
 - картинки/иконки
 - стили

 Например

```javascript
import React from 'react';

import { AppBar, Toolbar, Typography, InputBase } from '@material-ui/core';

import SelectLanguage from './SelectLanguage/SelectLanguage';

import SearchIcon from '@material-ui/icons/Search';

import useStyles from './style';
```
## Yalc
Необходим для присоединения дополнительных пакетов без установки их в свой репо.

### Установка

Используя NPM:

npm i yalc -g

Используя Yarn:

yarn global add yalc

### Как использовать

1. Необходимо клонировать репозиторий (репо А), который нужен для присоединения.
2. В репо А нужно выполнить команду:
yalc publish.
3. Зайти в репо B в необходимую ветку.
4. Выпонить команду:
yalc add 'название репо B' без кавычек
5. yarn
6. yarn start

### Ошибки при запуске и их исправление(в основном на Windows)
#### Ошибка 1. После установки не запускается yalc.
Выглядит так:
yalc : Имя "yalc" не распознано как имя командлета, функции, файла сценария или выполняемой программы.
Решение.
1. Выполнить yarn global bin.
2. Скопировать путь.
3. Зайти в службу "Изменение системных переменных среды" или "Свойства системы"
4. Вкладка "Дополнительно", кнопка "Переменные среды".
5. Выбрать переменную с названием Path, нажать "Изменить".
6. В открывшемся окне нажать "Создать" и вставить путь, скопированный на 2 шаге. 
7. Запускаем yarn global add yalc и пользуемся
#### Ошибка 2. Не выполняется yalc publish.
Выглядит так:
"rm" не является внутренней или внешней коммандой...
Решение.
1. Установить yarn add rimraf.
2. В package.json поменять в строке
    "prepublishOnly": "rm rf" 
   на  
   "prepublishOnly": "rimraf" 
3. Запустить ещё раз yalc publish  
