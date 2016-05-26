# muxer
[![Build Status][travis-svg]][travis]
[![npm][npm-svg]][npm]
[![semantic-release][semantic-release-svg]][semantic-release]

[travis-svg]:           https://travis-ci.org/tusharmath/muxer.svg?branch=master
[travis]:               https://travis-ci.org/tusharmath/muxer
[semantic-release-svg]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release]:     https://github.com/semantic-release/semantic-release
[npm-svg]:              https://img.shields.io/npm/v/muxer.svg
[npm]:                  https://www.npmjs.com/package/muxer


A simple multiplexer utility of RxJS based streams.

### Installation
```
npm install muxer --save
```

### Example

```javascript
import {Observable as O} from 'rx'
import {mux, demux} from 'muxer'


function create$ () {
  const interval$ = O.interval(1000)
  const mod2$ = interval$.filter(x => x%2 === 0).map(2) 
  const mod3$ = interval$.filter(x => x%3 === 0).map(3)
  const mod7$ = interval$.filter(x => 7%3 === 0).map(7)
  mux({mod2$, mod3$})
} 
 
// Create a single stream that contains events from each of the individual streams 
const mod$ = create$() 
const [{mod2$}, rest$] = demux(mod$, 'mod2$')

mod2$.subscribe(x => console.log('MOD2', x))
rest$.subscribe(x => console.log('REST', x))
```

## Functions

* [mux(sources)](#mux) ⇒ <code>[Observable](#external_Observable)</code>
* [demux(source$, ...keys)](#demux) ⇒ <code>Array</code>

## External

* [Observable](#external_Observable)

<a name="mux"></a>

## mux(sources) ⇒ <code>[Observable](#external_Observable)</code>
Creates a multiplexed stream from all the input streams

**Kind**: global function  
**Returns**: <code>[Observable](#external_Observable)</code> - Multiplexed stream  

| Param | Type | Description |
| --- | --- | --- |
| sources | <code>Object</code> | Dictionary of source streams. |

<a name="demux"></a>

## demux(source$, ...keys) ⇒ <code>Array</code>
De-multiplexes the source stream

**Kind**: global function  
**Returns**: <code>Array</code> - Tuple of the selected streams and the rest of them  

| Param | Type | Description |
| --- | --- | --- |
| source$ | <code>[Observable](#external_Observable)</code> | Input multiplexed stream |
| ...keys | <code>String</code> | Map of source streams |

<a name="external_Observable"></a>

## Observable
An observable is an interface that provides a generalized mechanism for push-based notification,
also known as observer design pattern.

**Kind**: global external  
**See**: [RxJS Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)  
