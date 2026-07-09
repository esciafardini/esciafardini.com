I asked an LLM if anything was non-idiomatic or bugged out with my script. I'm okay with using LLMs like that. Sue me. Here is what I got:

```markdown
1. Add set -euo pipefail at the top.
2. Quote every expansion — "$filename", "$entrynum", etc.
3. Use --arg in jq instead of splicing variables into the filter string.
4. Use mktemp instead of rm & mv, trap rm -rf after
  - Also, explore why this was needed in the first place?
5. jq --arg slug "$slug" ... 'FILTER' posts.json > "$tmp" && mv "$tmp" posts.json
6. Anchor paths to the script location (cd to repo root) instead of hardcoding $HOME/....
7. Validate slug/title are non-empty before writing.
8. Add support for comma-separated tags (??!?!?!)
```

In the spirit of the website, I will be implementing these changes WITHOUT the help of LLMs. Sue me!!!!!

I'd like to begin by saying the script worked great for adding this blogpost. What a beautiful script.

# 1. Add set -euo pipefail at the top

This is rather prescriptive. What for? What does it all mean? It means "strict mode" I guess. If anything fails, the script will stop running. Here is something from someone who knows a lot more than I do:
```markdown
set -e exits immediately when a command returns a non-zero status.
set -u treats references to unset variables as an error.
set -o pipefail makes a pipeline fail if any command in it fails, not just the last.
```

Let's see if my script still works with it?

:runs script:

It works. I suppose this is a "best practice" type of thing. Neat.

# 2. Quote every expansion

Okay, done. I looked into it and it is conventional wisdom (especially for bash n00bs like me) to always double quote variables, arithmetic expansion, and command substitution. In bash, a string with spaces can be treated as multiple arguments instead of a single string. I don't think it would've bitten me in this script, but I'll adopt it as a best practice anyway.

# 3. Use --arg in jq instead of splicing variables

Interesting. What is --arg flag?


#   tmp=$(mktemp ./posts.json.XXXXXX)
#   trap 'rm -f "$tmp"' EXIT
