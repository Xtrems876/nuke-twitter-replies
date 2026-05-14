# nuke-twitter-replies

A browser console script that bulk-deletes your replies on Twitter/X.

## Usage

1. **Navigate to your Twitter/X replies page.**  
   Go to `https://x.com/YourHandle/with_replies` (replace `YourHandle` with your own handle).

2. **Open the browser developer console.**  
   Press `F12` (or `Ctrl+Shift+J` on Windows/Linux, `Cmd+Option+J` on macOS) and select the **Console** tab.

3. **Paste the script.**  
   Copy the entire contents of [`nuke-replies.js`](nuke-replies.js) and paste it into the console.

4. **Edit your handle and run.**  
   Before pressing Enter, change `'@YourHandle'` at the bottom of the script to your actual Twitter/X handle, for example:
   ```js
   bulkDeleteTwitterReplies('@Xtrems876');
   ```
   Then press **Enter** to start.

5. **Watch the progress.**  
   The script logs each deletion to the console (`Deleted: 1/312`, `Deleted: 2/312`, …) and prints a summary when finished.

## Parameters

```js
bulkDeleteTwitterReplies(handle, limit = 312)
```

| Parameter | Type   | Default | Description                                      |
|-----------|--------|---------|--------------------------------------------------|
| `handle`  | string | —       | Your Twitter/X handle (with or without `@`)      |
| `limit`   | number | `312`   | Maximum number of replies to delete in one run   |

To delete more (or fewer) replies at once, pass a second argument:
```js
bulkDeleteTwitterReplies('@YourHandle', 500);
```

## Notes

- The script only deletes **your own** replies — it looks for tweet articles that contain your handle and then clicks the standard delete flow.
- Deletion is confirmed through Twitter/X's own confirmation dialog, so only tweets you actually own can be removed.
- Supported UI languages: **English** and **Polish** (delete button detection covers both).
- If the script says *"No more replies found"*, scroll down the page a little and run it again.
- Twitter/X may rate-limit deletions. If you hit limits, wait a few minutes before re-running.
