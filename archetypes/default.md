+++
tags = []
date = "{{ .Date }}"
draft = true
title = "{{ replace .Name "-" " " | title }}"
cover = "/blog/images/{{ replace .Name " " "-" | lower }}/cover.png"
header = "/blog/images/{{ replace .Name " " "-" | lower }}/header.png"
+++
