# viz-account-creator-server
RESTful сервер для регистрации пользователей в VIZ.

Чтобы запустить сервер вам потребудется [установить Node.js](https://nodejs.org/en/download/package-manager/) и npm.

Npm идет в комплекте с Node.js

Также вы можете установить [клиент](https://github.com/Ivanzar/viz-account-creator-client)

## Настройки

Перейдите в  ``resources/config/config.json``

```json
{
    "blockchain": {
        "creator": "account_name",
        "creator_key": "active_wif"
    },
    "server": {
        "refund_interval_day": 7,
        "port": 8124,
        "node": "node_url"
    }
}
```

``creator`` - Аккаунт регистратора
``active_priv_key`` - Активный приватный ключ регистратора
``refund_interval_day`` - Цикл возврата средств с созанного аккаутна
``port`` - Порт на котором будет рабоать сервер
``node`` - URL ноды для связи в блокчейном VIZ. Должна поддерживать WS протокол

## Запуск

``$ npm install -g forever``

``$ npm run start``

В случае сбоя сервер будет атоматически перезапущен благодаря модулю forever

## Остановка

``$ npm run stop``

## API

``/api/broadcast/account/create/{login}?memo={memo_key}&active={active_key}&posting={posting_key}&owner={owner_key}``

``{login}``  - Логин нового пользователя

``{memo_key}`` - Публичный memo ключ для нового аккаунта

``{posting_key}`` - Публичный постинг ключ для нового аккаунта

``{active_key}`` - Публичный активный ключ для нового аккаунта

``{owner_key}`` - Публичный owner ключ для нового аккаунта
