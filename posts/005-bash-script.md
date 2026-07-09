Adding a blog post to this site is a very clunky process. I can't take it anymore.

```markdown
1. Create a markdown file in `posts/` directory
2. Copy the name of the file
3. Add an entry to `posts.json`
4. Add all the necessary post data (slug for URL, title for display, & the damn file path--make sure it matches!!!)
5. Grumble about how annoying this process is
```

I will not be using generative AI to write this script because that goes against the entire point of this website.
```bash
slow down, conquer cognitive debt, and actually learn
```

Right, so in that spirit, I am going to write my first BASH script. Let's translate the steps above into something BASH-like.

```markdown
1. Determine number of posts & increment by 1 for filename (each filename is prefaced with the blog entry number)
2. Get today's date in YYYY-MM-DD format
3. Get post slug and title from user (me)
4. Cons the latest blog post into posts.json
```

## 0. Making the bash script executable

Script is made executable with `chmod a+x <filename>.sh`

```markdown
Quick explanation: chmod means "change mode", the -a flag specifies all users, the + is adding a permission for all users, and the x flag specifies the `execute` permission. After running that command, the script is executable.
```

## 1. Determine the number of posts & increment
Let's use jq to count the number of items in the posts.json array:

```
jq '. | length' posts.json
```
I think the `.` is the initial JSON object. The `|` pipe feeds the JSON object to whatever comes after it. In our case, we pass it to the jq function `length`. Running this in terminal gives a 4 which is the correct number of posts as of today!

That's fine in terminal, but we need to assign it to a BASH variable. This is where `Command Substitution` comes into play.
```bash
# COMMAND SUBSTITUTION!
idx=$(jq '. | length' posts.json)
```

Next, we need to add 1 to `$idx`. Command Substitution will not honor the plus sign. Attempting to run `$($idx + $inc)` yields this:
```bash
4: command not found
```

Allegedly - the error code 4 indicates an "Illegal Instruction" in MacOS. Addition is actually **ILLEGAL**?! Thanks president ______! Coming from higher level languages - it's insane to be expending mental energy debugging integer addition but I suppose this is the joy of low level programming.

Whatever, now I know how to do it - see - you use syntax that LOOKS like `Command Substitution` but it is in fact `Arithmetic Expansion`. Check out these docs:

```bash
z=$(($z+3))
z=$((z+3))                                  #  Also correct.
                                            #  Within double parentheses,
                                            #  parameter dereferencing
                                            #  is optional.

# $((EXPRESSION)) is arithmetic expansion.  #  Not to be confused with
                                            #  command substitution.
```

So I guess that means our script will look something like this:

```bash
# COMMAND SUBSTITUTION!
idx=$(jq '. | length' posts.json)
inc=1

# ARITHMETIC EXPANSION
newidx=$(($idx + $inc))

#printing value of sum variable
echo $idx
echo $newidx
```

Echoes are looking good. Step 1 complete.

# 2. Get today's date in YYYY-MM-DD format
Dates are pretty easy to work with in BASH (at least for our use case).

```bash
today=$(date +%Y-%m-%d)
```

We use `Command Substitution` again here. I found the command & formatter on stackoverflow and added hyphens it just worked. What the hell? Sometimes life isn't so hard.

# 3. Get post slug and title from user (me) & create the markdown file

Let's begin then with something like this to see what happens:
```bash
# Get the filename
echo Enter the filename
read filename
echo You entered: $filename
```
So this is echoing user input without issue. That's nice. Let's try making a file in the posts directory with my filename instead of just printing it back to me.

I don't know what the hell I'm doing but - maybe this will work?

First attempt to create a markdown file in the posts/ directory
```bash
touch /path/to/{$filename}.md
```
No dice:
```bash
./scripts/add_post.sh                                                                                                                                        ~/Projects/esciafardini_website
Enter the filename
bash-script
You entered: bash-script
touch: /path/to/{bash-script}.md: No such file or directory
(main)⚡ [1] %
```
Oops, I didn't actually specify the path. Also, it looks like it's keeping the curly braces around, so let's modify:
```bash
touch ./posts/$filename.md
```
SUCCESS!

# 4. Cons the latest blog post into posts.json


I think the move is to turn `posts.json` into an in-memory JSON data structure, `cons` (or whatever the javascript equivalent to cons is) my entry to the array, and then overwrite the `posts.json` file with the text version of my new JSON object.

Here goes nothing...

```bash
json= jq < posts.json

echo $json
```

Attempting to set variable `json` to jq parsed `posts.json` file appears to work. So I think I can start calling jq fns on this `json` variable:

```
json= jq '.[] | .slug' < posts.json

echo $json

```
This give me all of the slugs in the JSON array. Now, how about adding something to the array? The docs give an example of how to append a string to an array:
```bash
.posts[].comments |= . + ["this is great"]
```

Maybe we can munge this into what we need?


............................

............................

....twenty minutes later....

............................

............................

```bash
jq '[{
      "slug": "grandma",
      "title": "Grandma What Was It Like?",
      "date": "2026-01-01",
      "tags": ["loaded"],
      "file": "zorp.md"
}] + .' posts.json > maybe.json
```

I figured this one out through trial and error. Full disclosure: I don't understand jq at all. Let's try to remedy that.

Allegedly, a lot of people use jq to pretty print JSON. Interesting.

`echo '{"k":"v"}' | jq '.'`

^ That's the pprint type thang. You can treat streams of json data like Javascript objects. The `.` sort of converts the file into the JS object.

So what is my jq call (forged from failed guesses until it worked) doing? 

It looks like the JSON stream is coming from posts.json - the `.` is the subtitution for that JSON object. We write an array with a JSON object inside of it and `+` the `.` to it. Let me look up the plus symbol in the jq docs...

```bash
Addition: +

*Numbers* are added by normal arithmetic.
*Strings* are added by being joined into a larger string.
*Arrays* are added by being concatenated into a larger array. (!!!!!!!!!!!!!!)
```

Well there you have it folks. You can concat arrays with the `+` operator. I'm not going to do any deep dives into jq right now, but I understand it enough to complete the task at hand. Maybe a jq blog entry later in life?

Here is the final working script:
```bash
#!/bin/bash

# This will be the blog post number: (total posts + 1)
postcount=$(jq '. | length' posts.json)
entrynum=$((postcount + 1))

# Capture formatted entry_num (1 -> 001, 10 -> 010)
entrynumf=$(printf "%03d" $entrynum)

# User input slug
echo Enter the slug
read slug

echo Enter post title
read posttitle

# Create the file
filename="$HOME/Projects/esciafardini_website/posts/${entrynumf}-${slug}.md"
touch $filename

today=$(date +%Y-%m-%d)

jq "[{
      \"slug\": \"${slug}\",
      \"title\": \"${posttitle}\",
      \"date\": \"${today}\",
      \"tags\": [],
      \"file\": \"posts/${entrynumf}-${slug}.md\"
}] + ." posts.json > new.json

echo "Your posts directory, sir:"
ls posts

rm posts.json
mv new.json posts.json

echo "Your posts.json file, sir:"
cat posts.json
```

# Next time?
- Adding support for tags during post creation (it was too annoying, I gave up)
- Understanding why I had to create a new file then replace the old one. It was failing before I added that step (feels hacky)
