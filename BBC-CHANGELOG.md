# Changelog

This changelog aims to document all the high-level changes added by the BBC on top of upstream [sandflow/imscJS](https://github.com/sandflow/imscJS) library.

For more detailed changes, please use the commit history.

## Changes

- Handle TTML1 1st Edition CR ttaf namespace declarations
- Add `options` parameter to `imscHTML.render()` to allow customisation of presentation
- Compute `tts:fontFamily` and `tts:fontSize` values and apply to `p` elements so that `line-height` CSS property resolves to correct size
- Performance improvements inside `generateISD`. [#6](https://github.com/bbc/imscJS/pull/6)
