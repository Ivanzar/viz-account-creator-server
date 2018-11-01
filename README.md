# viz-account-creator-server
RESTful сервер для регистрации пользователей в VIZ

[Client](https://github.com/Ivanzar/viz-account-creator-client)

## Настройки

Перейдите в  ``resources/config/config.json``
```json
{
    "blockchain": {
        "creator": "login",
        "creator_key": "active_priv_key"
    },
    "server": {
        "refund_interval_day": "7",
        "port": 8124
    }
}
```
Заместо login впишите логин аккаунта-регистратора

Заместо  active_priv_key впишите активный приватный ключ регистратора

## Запуск

``$ npm install``
``$ node app/index.js``

## API

``/api/broadcast/account/create/{login}?memo={memo_key}&active={active_key}&posting={posting_key}&owner={owner_key}``

``memo_key`` - Публичный memo ключ для нового аккаунта
``posting_key`` - Публичный постинг ключ для нового аккаунта
``active_key`` - Публичный активный ключ для нового аккаунта
``owner_key`` - Публичный owner ключ для нового аккаунта
