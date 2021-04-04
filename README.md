# Data Dictionary

## post
* sourceAddress
* uniqueKey - string
* created - unixtime
* updated - unixtime, the client may reject anything updated in the future
* text
* attachments - [media]
* replyTo - post, optional
* permalinks - [url]
* url - optional
* hash - optional
* signatures - [signature], optional 

## signature
* address - string
* signature - string
* type - ECDSA by default

## source
* address
* name
* updated
* avatar - media
* hosts - [url]
* signatures - {address: signature}

## media
* contentType - mime
* content
  * url
  * hash

