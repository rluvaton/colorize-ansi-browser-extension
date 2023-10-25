const fixture1SpanResult = [
    {
        text: " Reset\n",
        css: ""
    },
    {
        text: " Bold\n",
        css: "font-weight: bold;"
    },
    {
        text: " Faint\n",
        css: "color:rgba(0,0,0,0.5);"
    },
    {
        text: " Italic\n",
        css: "font-style: italic;color:rgba(0,0,0,0.5);"
    },
    {
        text: " Underline\n",
        css: "font-style: italic;text-decoration: underline;color:rgba(0,0,0,0.5);"
    },
    {
        text: " Slow Blink\n",
        css: "font-style: italic;text-decoration: underline;color:rgba(0,0,0,0.5);"
    },
    {
        text: " Rapid Blink\n",
        css: "font-style: italic;text-decoration: underline;color:rgba(0,0,0,0.5);"
    },
    {
        text: " Reverse Video\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(255,255,255,0.5);color:rgba(0,0,0,1);"
    },
    {
        text: " Conceal\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(255,255,255,0.5);color:rgba(0,0,0,1);"
    },
    {
        text: " Crossed Out\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(255,255,255,0.5);color:rgba(0,0,0,1);"
    },
    {
        text: " Black\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(0,0,0,0.5);color:rgba(0,0,0,1);"
    },
    {
        text: " Red\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(204,0,0,0.5);color:rgba(0,0,0,1);"
    },
    {
        text: " Green\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(0,204,0,0.5);color:rgba(0,0,0,1);"
    },
    {
        text: " Yellow\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(204,102,0,0.5);color:rgba(0,0,0,1);"
    },
    {
        text: " Blue\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(0,0,255,0.5);color:rgba(0,0,0,1);"
    },
    {
        text: " Magenta\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(204,0,204,0.5);color:rgba(0,0,0,1);"
    },
    {
        text: " Cyan\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(0,153,255,0.5);color:rgba(0,0,0,1);"
    },
    {
        text: " White\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(200,200,200,0.5);color:rgba(0,0,0,1);"
    },
    {
        text: " Black Background\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(200,200,200,0.5);color:rgba(0,0,0,1);"
    },
    {
        text: " Red Background\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(200,200,200,0.5);color:rgba(204,0,0,1);"
    },
    {
        text: " Green Background\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(200,200,200,0.5);color:rgba(0,204,0,1);"
    },
    {
        text: " Yellow Background\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(200,200,200,0.5);color:rgba(204,102,0,1);"
    },
    {
        text: " Blue Background\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(200,200,200,0.5);color:rgba(0,0,255,1);"
    },
    {
        text: " Magenta Background\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(200,200,200,0.5);color:rgba(204,0,204,1);"
    },
    {
        text: " Cyan Background\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(200,200,200,0.5);color:rgba(0,153,255,1);"
    },
    {
        text: " White Background\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(200,200,200,0.5);color:rgba(200,200,200,1);"
    },
    {
        text: " Bright Black\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(100,100,100,0.5);color:rgba(200,200,200,1);"
    },
    {
        text: " Bright Red\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(255,51,0,0.5);color:rgba(200,200,200,1);"
    },
    {
        text: " Bright Green\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(51,204,51,0.5);color:rgba(200,200,200,1);"
    },
    {
        text: " Bright Yellow\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(255,153,51,0.5);color:rgba(200,200,200,1);"
    },
    {
        text: " Bright Blue\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(26,140,255,0.5);color:rgba(200,200,200,1);"
    },
    {
        text: " Bright Magenta\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(255,0,255,0.5);color:rgba(200,200,200,1);"
    },
    {
        text: " Bright Cyan\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(0,204,255,0.5);color:rgba(200,200,200,1);"
    },
    {
        text: " Bright White\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(255,255,255,0.5);color:rgba(200,200,200,1);"
    },
    {
        text: " Bright Black Background\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(255,255,255,0.5);color:rgba(100,100,100,1);"
    },
    {
        text: " Bright Red Background\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(255,255,255,0.5);color:rgba(255,51,0,1);"
    },
    {
        text: " Bright Green Background\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(255,255,255,0.5);color:rgba(51,204,51,1);"
    },
    {
        text: " Bright Yellow Background\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(255,255,255,0.5);color:rgba(255,153,51,1);"
    },
    {
        text: " Bright Blue Background\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(255,255,255,0.5);color:rgba(26,140,255,1);"
    },
    {
        text: " Bright Magenta Background\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(255,255,255,0.5);color:rgba(255,0,255,1);"
    },
    {
        text: " Bright Cyan Background\n",
        css: "font-style: italic;text-decoration: underline;background:rgba(255,255,255,0.5);color:rgba(0,204,255,1);"
    },
    {
        text: " Bright White Background",
        css: "font-style: italic;text-decoration: underline;background:rgba(255,255,255,0.5);color:rgba(255,255,255,1);"
    }
]

module.exports = {
    fixture1SpanResult
}
