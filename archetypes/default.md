+++
tags = []
date = "{{ .Date }}"
draft = true
title = "{{ replace .Name "-" " " | title }}"
heading = ""
name = "{{.Name}}"
coverImage = "/blog/images/{{ replace .Name " " "-" | lower }}/cover.png"
coverImageId = "{{ replace .Name " " "-" | lower }}-cover"
headerImage = "/blog/images/{{ replace .Name " " "-" | lower }}/header.png"
headerImageId = "{{ replace .Name " " "-" | lower }}-header"
+++
