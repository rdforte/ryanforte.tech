+++
tags = []
date = "{{ .Date }}"
draft = true
title = "{{ replace .Name "-" " " | title }}"
coverImage = "/blog/images/{{ replace .Name " " "-" | lower }}/cover.png"
headerImage = "/blog/images/{{ replace .Name " " "-" | lower }}/header.png"
+++
