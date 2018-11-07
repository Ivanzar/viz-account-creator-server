# viz-account-creator-server
RESTful сервер для регистрации пользователей в VIZ.

Чтобы запустить сервер вам потребуется [установить Node.js](https://nodejs.org/en/download/package-manager/) и npm.

Npm идет в комплекте с Node.js

Также вы можете установить [клиент](https://github.com/Ivanzar/viz-account-creator-client)

## Настройки

Установите модуль Forever

``$ npm install -g forever``

Перейдите в ``resources/config/config.json``

Чтобы запустить сервер в тестовом режиме укажите в переменную ОС NODE_ENV занчанеи ``dev``, тогда сервер будет использовать конфиг из файла ``resources/dev/config/config.json``

```json
{
    "blockchain": {
        "creator": "account_name",
        "creator_key": "active_wif"
    },
    "server": {
        "host": "127.0.0.1",
        "refund_interval_sec": 0,
        "port": 8124,
        "node": "node_url"
    }
}
```


``creator`` - Аккаунт регистратора

``active_priv_key`` - Активный приватный ключ регистратора

``refund_interval_sec`` - Цикл возврата средств с созданного аккаунта в секундах, если поставить 0, то списание происходит сразу

``port`` - Порт на котором будет работать сервер

``host`` - Хост на котором будет работать сервер

``node``  - URL ноды для связи c блокчейном VIZ. Должна поддерживать WS протокол

## Запуск

``$ npm run start``

В случае сбоя сервер будет автоматически перезапущен благодаря модулю forever

## Остановка

``$ npm run stop``

## API

``/api/broadcast/account/create/{login}?memo={memo_key}&active={active_key}&posting={posting_key}&owner={owner_key}``

``{login}`` - Логин нового пользователя

``{memo_key}`` - Публичный memo ключ для нового аккаунта

``{posting_key}`` - Публичный постинг ключ для нового аккаунта

``{active_key}`` - Публичный активный ключ для нового аккаунта

``{owner_key}`` - Публичный owner ключ для нового аккаунта