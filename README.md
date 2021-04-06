# Data Dictionary

## post
* source - source
* uniqueKey - string
* type - 'post' | 'like' | 'repost' | 'reply'
* created - epoch time in milliseconds
* updated - epoch time in milliseconds, the client may reject anything updated in the future
* text
* attachments - [media]
* replyToSource - hash. Retrieve the file from the same fileStore
* replyToPost - hash. Retrieve the file from the replyToSource.fileStores
* signatures - [signature], optional 
* likesCount - int
* repostsCount - int
* commentsCount - int
* hash - string, every post shall be stored as a separate file in the fileStore

## source
* address
* name
* updated - epoch time in milliseconds
* avatar - media
* hosts - [host]
* signatures - [signature], optional
* hash - string, every source shall be stored as a separate file in the fileStore

## host
* fileStores - [url]
* index - url

## signature
* address - string
* signature - string
* type - ECDSA by default

## media
* contentType - mime
* hash
* width - optional
* height - optional
* thumbnail - media, optional

## index
* mainSource - source
* fileStores - [url]
* recentPosts - [post]
* pinnedPosts - [post]
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
