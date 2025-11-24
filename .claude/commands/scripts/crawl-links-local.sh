#!/bin/bash

# Hugo Site Link Crawler - Local Development
# Purpose: Check for broken links on localhost:1313
# Usage: ./crawl-links-local.sh [--verbose]

BASE_URL="http://localhost:1313"
VERBOSE=false
TIMEOUT=10
TEMP_FILE=$(mktemp)
trap "rm -f $TEMP_FILE" EXIT

# Check if --verbose is passed
if [[ "${1:-}" == "--verbose" ]]; then
    VERBOSE=true
fi

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

is_checked() {
    grep -q "^$1$" "$TEMP_FILE" 2>/dev/null && return 0 || return 1
}

mark_checked() {
    echo "$1" >> "$TEMP_FILE"
}

normalize_url() {
    local url="$1"
    echo "${url%#*}"
}

resolve_relative_url() {
    local relative="$1"
    local base_page="$2"

    if [[ "$relative" == /* ]] || [[ "$relative" == http* ]]; then
        echo "$relative"
        return
    fi

    local base_dir=$(dirname "$base_page")

    while [[ "$relative" == "../"* ]]; do
        relative="${relative#../}"
        base_dir=$(dirname "$base_dir")
    done

    if [[ "$base_dir" == "/" ]]; then
        echo "/$relative"
    else
        echo "$base_dir/$relative"
    fi
}

is_internal() {
    local url="$1"
    if [[ "$url" == http* ]]; then
        [[ "$url" == "$BASE_URL"* ]] && return 0 || return 1
    else
        return 0
    fi
}

is_javascript_construct() {
    local link="$1"
    if echo "$link" | grep -q "^'"; then
        return 0
    fi
    if echo "$link" | grep -q "'\$"; then
        return 0
    fi
    return 1
}

get_links() {
    # Extract href attribute values (handles quoted and unquoted)
    grep -o 'href=[^ >]*' | sed 's/^href=//' | sed "s/^['\"]//; s/['\"].*$//" | while read link; do
        if [[ ! "$link" =~ ^(javascript|#|this\.value|location\.href) ]]; then
            echo "$link"
        fi
    done
    # Extract src attribute values
    grep -o 'src=[^ >]*' | sed 's/^src=//' | sed "s/^['\"]//; s/['\"].*$//" | grep -v '^$'
}

crawl_page() {
    local url="$1"
    url=$(normalize_url "$url")

    if is_checked "$url"; then
        return 0
    fi

    mark_checked "$url"

    local fetch_url="$url"
    if [[ "$url" != http* ]]; then
        fetch_url="${BASE_URL}${url}"
    fi

    [[ "$VERBOSE" == true ]] && log_info "Crawling: $fetch_url"

    local page_content
    page_content=$(curl -s -L --max-time "$TIMEOUT" "$fetch_url" 2>/dev/null)

    if [[ -z "$page_content" ]]; then
        log_error "Could not fetch: $fetch_url"
        return 1
    fi

    log_success "Crawled: $fetch_url"

    local links
    links=$(echo "$page_content" | get_links)

    local broken_count=0
    while IFS= read -r link; do
        [[ -z "$link" ]] && continue

        if [[ "$link" == \#* ]]; then
            continue
        fi

        if [[ "$link" == javascript* ]] || [[ "$link" == mailto* ]] || [[ "$link" == tel:* ]]; then
            continue
        fi

        if is_javascript_construct "$link"; then
            continue
        fi

        link=$(resolve_relative_url "$link" "$url")

        if ! is_internal "$link"; then
            [[ "$VERBOSE" == true ]] && log_info "Skipping external: $link"
            continue
        fi

        link=$(normalize_url "$link")
        if ! is_checked "$link"; then
            if ! crawl_page "$link"; then
                ((broken_count++))
            fi
        fi
    done <<< "$links"

    return $broken_count
}

main() {
    log_info "Starting site crawler..."
    log_info "Base URL: $BASE_URL"
    echo

    if ! crawl_page "/"; then
        echo
        echo "════════════════════════════════════════"
        echo "BROKEN LINKS FOUND"
        echo "════════════════════════════════════════"
        exit 1
    fi

    echo
    echo "════════════════════════════════════════"
    echo "CRAWL COMPLETE - NO BROKEN LINKS"
    echo "════════════════════════════════════════"
    echo "Total URLs checked: $(wc -l < "$TEMP_FILE")"
    exit 0
}

main "$@"
