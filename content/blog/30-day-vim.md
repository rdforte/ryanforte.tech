+++
tags = []
date = "2022-09-03T12:22:52+10:00"
draft = false
title = "30 days of Vim with VSCode. Was it worth it… 🤔"
coverImage = "/blog/images/30-days-vim/cover.png"
headerImage = "/blog/images/30-days-vim/header.png"
+++

Im gonna keep this short and sweet outlining my journey using Vim with VSCode, the main commands I used on a daily basis, whether it increased/decreased productivity, whether or not I recommend it and how to get setup incase you wanna give it a crack also!
Let's start with whether I recommend it.

#### HELL YEAH! 🔥
So as of writing this article I have currently been using Vim with VSCode for approximately 3 months and looking back in the early days i'm not gonna lie the first 30 days were rough, my productivity was definitely sub optimal. I had to think of the vim commands in order to navigate around my code which would break my train of thought so context switching between vim commands and the code I was writing was definitely hindering my performance.
Though after about 30 days of using vim everyday this is where my productivity started to ramp up. I was thinking less about the commands I was using and just doing them and navigating around my code was fast. I could keep my hands on the keyboard and just glide around my code without the use of a mouse. It was a pretty nice feeling. 😌

## Getting Starting With Vim for VSCode
1. Install [VSCode](https://code.visualstudio.com/download)
2. Add the Extension [VSCodeVim](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim)

![Vim Emulation](/blog/images/30-days-vim/vim-emulation-vscode.png)

3. Follow the Installation guide as expressed in the Extension [Overview](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim)

## The main Key Bindings I use on a daily basis

### Moving in/out of insert mode
When in insert mode you will be able to type code as you normally would. When you are not in insert mode this is when you will be able to use your vim commands.

![Insert Mode](/blog/images/30-days-vim/insert-mode.png)

```
i = enter insert mode before cursor.
a = enter insert mode after cursor.
esc = exit insert mode.
```

**👉 NOTE** I map my Caps Lock key to be an escape key and use my shift keys as my caps lock keys therefore allowing me to easily move in/out of insert mode. You can do this on a mac by going:
System Preferences -> Keyboard -> Modifier Keys…

### Move Cursor with H, J, K, L

![Move cursor](/blog/images/30-days-vim/move-cursor.png)

```
h = move left.
j = move down.
k = move up.
l = move right.
```

### Jump to Start/End of line

![Jump to start/end of line](/blog/images/30-days-vim/jump-start-end-line.png)

```
Shift 4 = jump to end of line.
0 = jump to start of line.
Shift i = jump to start of line in insert mode.
Shift a = jump to end of line in insert mode.
```

### Jump to top of file

![Jump to top](/blog/images/30-days-vim/jump-top.png)

```
double tap the `g` key to jump to the top of the file.
```

### Jump to bottom of file

![Jump to bottom](/blog/images/30-days-vim/jump-bottom.png)

```
Shift g = Jump to bottom of file.
```

**👉 NOTE** You can navigate to any line number by first typing in the line you want to navigate to followed by Shift g