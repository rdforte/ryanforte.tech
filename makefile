# blog will create a new blog
# adding the markdown file to contents/blog and
# creating an images directory in static/blog/images
blog:
	./scripts/makeBlog

# compress will compress all png images for the blog specified.
compress:
	./scripts/compressBlogImages