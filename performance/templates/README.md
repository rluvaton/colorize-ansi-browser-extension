
In this directory there are JSON templates gzipped (as they are very big files)
with strings for hard coded text and number for words to generate at that length

You can generate new files by running the following command:

```bash
node ./generate-templates-from-ansi-log.mjs <path-to-ansi-log-file>
```

To generate html file from the template, run the following command:

```bash
node ./generate-html-from-template.mjs <path-to-template-file>
```

