#\!/bin/bash
bun run build 2>&1 | grep -v "baseline-browser-mapping" | grep -v "middleware.*deprecated"
