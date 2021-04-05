# Data Dictionary

## post
* source - source
* uniqueKey - string
* type - 'post' | 'like' | 'repost' | 'reply'
* created - epoch time in milliseconds
* updated - epoch time in milliseconds, the client may reject anything updated in the future
* text
* attachments - [media]
* replyTo - post, optional
* hash - optional
* signatures - [signature], optional 
* likesCount - int
* repostsCount - int

## source
* address
* name
* updated - epoch time in milliseconds
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
