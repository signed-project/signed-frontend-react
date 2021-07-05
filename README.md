# Data Dictionary

## post
* source - source
* id - string
* type - 'post' | 'like' | 'repost' | 'reply'
* createdAt - epoch time in milliseconds
* updatedAt - epoch time in milliseconds, the client may reject anything updated in the future
* text
* attachments - [media]
* target
  * sourceHash - hash. Retrieve the file from the same fileStore
  * postHash - hash. Retrieve the file from the replyToSource.fileStores
* signatures - [signature], optional 
* likesCount - int
* repostsCount - int
* commentsCount - int
* mentions - [source]
* hash - string, every post shall be stored as a separate file in the fileStore

## source
* address
* name
* updatedAt - epoch time in milliseconds
* avatar - media
* hosts - [host]
* signatures - [signature], optional
* hash - string, every source shall be stored as a separate file in the fileStore

## host
* assets - url
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
