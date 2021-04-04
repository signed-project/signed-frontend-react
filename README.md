# Data Dictionary

## post
* sourceAddress
* uniqueKey - string
* type - 'post' | 'like' | 'repost' | 'reply'
* created - unixtime
* updated - unixtime, the client may reject anything updated in the future
* text
* attachments - [media]
* replyTo - post, optional
* permalinks - [url]
* hash - optional
* signatures - [signature], optional 

## source
* address
* name
* updated
* avatar - media
* hosts - [url]
* signatures - [signature], optional

## signature
* address - string
* signature - string
* type - ECDSA by default

## media
* contentType - mime
* hash

## index
* fileStores - [url]
* recentPosts - [post]
* sources - [source]
* archives - [archive]
* tags - [tag]

## archive
* dateStart - unixtime
* dateEnd - unixtime
* posts - [post]
* sources - [source]
* hash - optional

## tag
* name
* posts - [post]
* sources - [source]
* hash - optional
