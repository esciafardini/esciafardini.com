I sort of despise the current state of software engineering. I am being automated in front of my very eyes. I'm learning less, doing less, becoming less of person maybe even - but recently I started using a tool that is making me feel real again.

It's called Obsidian. I've had it for a while but recently I've gotten pretty damn serious about maintaining it - slowing down and taking notes with tags and structure. Writing things in my own words. Testing out ideas. Reading books! Anyway, this isn't REALLY a post about Obsidian - more of a continuation of my Bash Quest. We will call this post Bash Quest 3. What will I use BASH for this time?!

On my local network, I use an Obsidian plugin called live-sync to push changes to my home media server which in turn pushes changes to other devices that utilize my Obsidian vault. I used this video to set it up: https://www.youtube.com/watch?v=AbS7orD1B8g

This is great and all - but what if my house burns down? IT COULD HAPPEN. It would be nice to sync my vault into the greater Internet. It would make me feel so safe and secure, really. It would fix everything.

IDEA: write a BASH script that somehow gets run every 24 hours.

BEHOLD!!! My second BASH script:
```bash
#!/bin/bash
echo "ran at $(date)" >> ~/obsidian-backup-heartbeat.log
cd ~/obsidian
git add .
git commit -m "backup $(date +%Y-%m-%d)" || exit 0
git push
```

This utilizes the same date formatter from my first BASH script. This should work fine, I think.  The `|| exit 0` will prevent a commit if there is nothing to commit. The || in BASH script signifies what to do if the attempted command doesn't work out. An exit code of 0 indicates that nothing actually went wrong.

Let's test it out. Running once:
```bash
[main 129e1ad] backup 2026-07-15
 9 files changed, 112 insertions(+), 34 deletions(-)
 create mode 100644 1 - Notepad (thoughts, rough drafts)/Hand Method.md
 create mode 100644 1 - Notepad (thoughts, rough drafts)/Obsidian Sync.md
 create mode 100644 2 - Source Material/Books/Nonfiction/Nutrition For Taekwondo.md
 create mode 100644 3 - Tags/diet.md
 create mode 100644 3 - Tags/nutrition.md
 create mode 100644 6 - Atomic Notes/Health Guidelines.md
Enumerating objects: 29, done.
Counting objects: 100% (29/29), done.
Delta compression using up to 8 threads
Compressing objects: 100% (16/16), done.
Writing objects: 100% (17/17), 2.91 KiB | 2.91 MiB/s, done.
Total 17 (delta 11), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (11/11), completed with 10 local objects.
To [REDACTED].git
   a4bdab3..129e1ad  main -> main
```

Running twice:
```bash
% ./obsidian-backup.sh
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

I think adding time to the commit message would be a solid move (just in case I the script gets run twice in a day - and I will be running it a lot today...for TESTING PURPOSES!)

This seems to work:
`git commit -m "backup $(date +%Y-%m-%dT%H:%M:%S)" || exit 0`

Okay, very good. Now to get this running without my manual intervention.

The MacOS way of doing this is a launchd task. I've never set up a launchd task. I can have my own daemon running in MacOS if I configure it. The configuration lives in an XML file.
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>obsidian-backup</string>
    <key>Program</key>
    <string>$HOME/bin/obsidian-backup.sh</string>
    <key>StartInterval</key>
    <integer>86400</integer>
    <key>StandardOutPath</key>
    <string>/tmp/obsidian-backup.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/obsidian-backup.log</string>
</dict>
</plist>
```

It looks insane but it's quite simple. The headers are just copied from https://www.launchd.info/ and the `dict` can be thought of as a generic hashmap. A label is required. The Program is just "run this script". There are `.log` specified in case anything goes wrong. Also - you should replace $HOME/ with the actual path. Simple enough.

I was able to successfully invoke the program like so:
`launchctl start obsidian-backup`

Once this file is saved to `~/Library/LaunchAgents` a notification pops up saying "obsidian-backup.sh can run in the background. You can manage background activity in Login Items & Extensions".

It was auto-enabled for me. You can see it registered under "Background App Activity". And now I can see when it runs every day in the heartbeat log file that gets echo'd to on every run. Pretty cool. I will check it tomorrow to be sure it's running as expected.

## The Next Day
Woke up in the morning and I asked myself is life worth living *ahem* did my obsidian sync job run? It didn't. Ahhhhh daaaaaahmmmmnit.

It turns out `StartInterval` isn't the best tool for this job. My laptop was asleep when the specified 86,400 seconds (24 hours) interval ended. 

According to the documentation:
```markdown
StartInterval <integer>
- Causes the job to be started every N seconds.
- If the system is asleep during the time of the next scheduled interval firing, that interval will be missed due to shortcomings in kqueue(3). (!!!!!)

StartCalendarInterval <dictionary of integers or array of dictionaries of integers>
- Causes the job to be started every calendar interval as specified.
- When the computer is asleep, launchd will start the job the next time the computer wakes up. (!!!!!!!!!!!!!!)
- If multiple intervals transpire before the computer is woken, those events will be coalesced into one event upon wake from sleep. (!!!!!!)
```

These docs are accessible from terminal via `man launchd.plist` btw. In other words:
```markdown
StartInterval is lossy as hell. If the laptop is asleep, the job won't run.

StartCalendarInterval is so cool. All jobs will be run as one even if the laptop is asleep during the specified times.
```

So since I want this to run at least once a day (whether my laptop is asleep or not), I will use `StartCalendarInterval` and specify 9am and 5pm for running the program. The final form:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>obsidian-backup</string>
    <key>Program</key>
    <string>/Users/remote-dev/bin/obsidian-backup.sh</string>
    <key>StartCalendarInterval</key>
    <array>
        <dict>
            <key>Hour</key>
            <integer>9</integer>
            <key>Minute</key>
            <integer>0</integer>
        </dict>
        <dict>
            <key>Hour</key>
            <integer>17</integer>
            <key>Minute</key>
            <integer>0</integer>
        </dict>
    </array>
    <key>StandardOutPath</key>
    <string>/tmp/obsidian-backup.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/obsidian-backup.log</string>
</dict>
</plist>
```
It works now, look!
```markdown
ran at Fri Jul 17 09:00:05 EDT 2026
ran at Fri Jul 17 14:00:05 EDT 2026
```
