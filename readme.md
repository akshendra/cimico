# Cimico

[![npm version](https://badge.fury.io/js/cimico.svg)](https://badge.fury.io/js/cimico)

> **Work in progress**

Just another logger, based on DEBUG, with call site details and pretty printing.

![Preview](http://i.imgur.com/U7w7fyZ.png)


#### DEBUG

Uses the `DEBUG` env variable to figure out whether to log or not.
Create a logger using (see **Flags** for options)

```js
const logger = cimico('app:parser', {
  format: false,
  color: true,
  pretty: true,
  timestamp: false,
  filename: true,
});
```

If the `DEBUG` variable is set to `*`, `app:*`, `app:parser` or `app:parser:*`, then the logs will appear

#### Methods

The methods available to `logger` are with their shorthands

- `log/l`(stdout)
- `success/s`(stdout)
- `debug/d`(stdout)
- `error/e`(stderr)

#### Flags

Chance the way the method work by using,

- `format/f`, allows the use of format string, see below
- `color/c`, turns color on
- `pretty/p`, prints errors and objects in a pretty way
- `timestamp/ts`, adds timestamp to header label
- `filename/fn`, add filename to header label

#### Formatting

When formatting flag is used or `format` is `true` in options, the a format string can be used to render the data.

- `d` for dim
- `b` for bold
- `u` for underline
- `(name)` for key value pair

Eg,

```js
logger.format.log('This is bold=%b or %b(bold)', 'one', 'two');
```