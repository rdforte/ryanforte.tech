# NEW BLOG/CP ==================================================================

# blog will create a new blog
# adding the markdown file to contents/blog and
# creating an images directory in static/blog/images
blog:
	./scripts/makeBlog

# cp will create a new competitive programming question
# adding the markdown file to contents/competitive-programming and
# creating an images directory in static/competitive-programming/images
cp:
	./scripts/makeCp

# IMAGE COMPRESSION ============================================================

# compress will compress all png images for the blog specified.
compress-blog:
	./scripts/compressBlogImages

# compress will compress all png images for the competitive programming blog specified.
compress-cp:
	./scripts/compressCpImages

get-ip:
	ifconfig | grep "inet " | grep -v 127.0.0.1