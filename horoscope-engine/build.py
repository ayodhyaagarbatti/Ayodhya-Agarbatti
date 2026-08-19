#!/usr/bin/env python3
"""Assemble index.html from src/ pieces (self-contained, no network at runtime)."""
import os
D = os.path.dirname(os.path.abspath(__file__))
def r(p): return open(os.path.join(D, p), encoding="utf-8").read()
page    = r("src/page.html")
lib     = r("src/astronomy.browser.min.js")
engine  = r("src/engine.js")
engine2 = r("src/engine2.js")
engine3 = r("src/engine3.js")
ui      = r("src/ui.js")
html = (page.rstrip() + "\n"
        + "<script>" + lib     + "</script>\n"
        + "<script>" + engine  + "</script>\n"
        + "<script>" + engine2 + "</script>\n"
        + "<script>" + engine3 + "</script>\n"
        + "<script>" + ui      + "</script>\n")
open(os.path.join(D, "index.html"), "w", encoding="utf-8").write(html)
print("built index.html:", len(html), "bytes")
